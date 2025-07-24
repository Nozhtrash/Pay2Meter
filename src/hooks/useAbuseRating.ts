
"use client";

import { useState, useEffect } from 'react';
import { onSnapshot } from "firebase/firestore";
import { getGameDocRef } from '@/lib/firebase';

export function useAbuseRating(gameId: string) {
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) {
        setLoading(false);
        return;
    };
    
    const gameRef = getGameDocRef(gameId);
    const unsub = onSnapshot(gameRef, (snapshot) => {
      const data = snapshot.data();
      setRating(data?.abuseRating ?? 0);
      setLoading(false);
    }, (error) => {
        console.error(`Error fetching abuse rating for game ${gameId}:`, error);
        setLoading(false);
    });
    
    return () => unsub();
  }, [gameId]);

  return { abuseRating: rating, loading };
}
