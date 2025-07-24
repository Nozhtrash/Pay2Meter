
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp, runTransaction, query, where, orderBy, limit, Timestamp, updateDoc, deleteDoc, getDocs, getDoc, collectionGroup, writeBatch, increment } from "firebase/firestore";
import { firebaseConfig } from "./config";
import type { Review, Post, UserProfile } from "@/types";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);


// Firestore helpers
export function getGamesQuery() {
    return query(collection(db, 'gameMetadata'), orderBy('name'));
}

export function getGameDocRef(gameId: string) {
  return doc(db, 'gameMetadata', gameId);
}

export function getGameReviewsQuery(gameId: string) {
    return query(collection(db, 'reviews'), where('gameId', '==', gameId), where('status', '==', 'visible'), orderBy('createdAt', 'desc'));
}

export function getNewsQuery(count?: number) {
    const newsCollection = collection(db, 'news');
    if (count) {
        return query(newsCollection, orderBy('publishedAt', 'desc'), limit(count));
    }
    return query(newsCollection, orderBy('publishedAt', 'desc'));
}

export function getFreeGamesQuery(count: number) {
    return query(collection(db, 'freeGames'), orderBy('releaseDate', 'desc'), limit(count));
}

export function getPostsQuery(count?: number) {
    const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
    if (count) {
        return query(q, limit(count));
    }
    return q;
}

export async function getUserByNickname(nickname: string): Promise<UserProfile | null> {
    if (!nickname) return null;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("nickname", "==", nickname), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    return querySnapshot.docs[0].data() as UserProfile;
}


export async function updateAbuseRating(gameId: string, rating: number) {
  const gameRef = getGameDocRef(gameId);
  const newRating = Math.max(0, Math.min(100, rating));
  await setDoc(gameRef, { abuseRating: newRating }, { merge: true });
}

export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) {
    const gameDocRef = getGameDocRef(reviewData.gameId);
    const userDocRef = doc(db, 'users', reviewData.userId);

    await runTransaction(db, async (transaction) => {
        const gameDoc = await transaction.get(gameDocRef);
        if (!gameDoc.exists()) {
            throw "El documento del juego no existe!";
        }

        // Add the new review
        const newReviewRef = doc(collection(db, "reviews"));
        transaction.set(newReviewRef, {
            ...reviewData,
            createdAt: serverTimestamp(),
            upvotes: 0,
            downvotes: 0,
        });
        
        // Update the review count on the game
        const newReviewCount = (gameDoc.data().reviewCount || 0) + 1;
        transaction.update(gameDocRef, { reviewCount: newReviewCount });

        // Add points to the user for submitting a review
        transaction.update(userDocRef, { points: increment(10) });
    });
}

// Post Functions
export async function addPost(postData: Omit<Post, 'id'>) {
  const postCollectionRef = collection(db, 'posts');
  await addDoc(postCollectionRef, {
      ...postData,
      date: Timestamp.now(),
  });
}

export async function updatePost(id: string, postData: Post, editorUid: string) {
  const postDocRef = doc(db, 'posts', id);
  const { id: postId, ...dataToUpdate } = postData;
  
  const originalPostSnap = await getDoc(postDocRef);
  const originalPost = originalPostSnap.data() as Post;

  const changedFields: Record<string, any> = {};
  Object.keys(dataToUpdate).forEach(keyStr => {
      const key = keyStr as keyof Post;
      if (key !== 'id' && originalPost[key] !== dataToUpdate[key]) {
          // Special handling for array comparison
          if (Array.isArray(originalPost[key]) && Array.isArray(dataToUpdate[key])) {
              const arr1 = originalPost[key] as any[];
              const arr2 = dataToUpdate[key] as any[];
              if (arr1.length !== arr2.length || arr1.some((val, i) => val !== arr2[i])) {
                  changedFields[key] = { from: originalPost[key], to: dataToUpdate[key] };
              }
          } else {
              changedFields[key] = { from: originalPost[key], to: dataToUpdate[key] };
          }
      }
  });

  const batch = writeBatch(db);

  batch.update(postDocRef, dataToUpdate);

  if (Object.keys(changedFields).length > 0) {
      const historyRef = doc(collection(db, 'posts', id, 'history'));
      batch.set(historyRef, {
          editorUid,
          timestamp: serverTimestamp(),
          changedFields,
      });
  }
  
  await batch.commit();
}

export async function deletePost(id: string) {
  const postDocRef = doc(db, 'posts', id);
  await deleteDoc(postDocRef);
}

// User Management
export async function updateUserRole(uid: string, role: 'admin' | 'editor' | 'usuario') {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { role });
}

export { app, auth, db };
