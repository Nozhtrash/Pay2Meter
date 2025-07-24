
"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from '@/types';

export function useTopReviewers(count: number) {
  const [reviewers, setReviewers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("points", "desc"), limit(count));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topReviewersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setReviewers(topReviewersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching top reviewers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [count]);

  return { reviewers, loading };
}
