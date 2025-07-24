
"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, orderBy, limit } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Post } from '@/types';

export function usePosts(count?: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let postsQuery = query(collection(db, 'posts'), orderBy('date', 'desc'));
    
    if (count && count > 0) {
        postsQuery = query(postsQuery, limit(count));
    }

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching posts`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [count]);

  return { posts, loading };
}
