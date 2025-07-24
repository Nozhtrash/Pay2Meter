
"use client";

import { useState, useEffect } from 'react';
import { onSnapshot } from "firebase/firestore";
import { getGameReviewsQuery } from '@/lib/firebase';
import { Review } from '@/types';

export function useGameReviews(gameId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) {
        setLoading(false);
        return;
    };
    
    const reviewsQuery = getGameReviewsQuery(gameId);
    
    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
      setReviews(reviewsData);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching reviews for game ${gameId}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId]);

  return { reviews, loading };
}
