
"use client";

import { useState, useEffect } from 'react';
import { onSnapshot } from "firebase/firestore";
import { getFreeGamesQuery } from '@/lib/firebase';
import { FreeGame } from '@/types';

export function useFreeGames(count: number) {
  const [freeGames, setFreeGames] = useState<FreeGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (count <= 0) {
        setLoading(false);
        return;
    };
    
    const freeGamesQuery = getFreeGamesQuery(count);
    
    const unsubscribe = onSnapshot(freeGamesQuery, (snapshot) => {
      const freeGamesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FreeGame[];
      setFreeGames(freeGamesData);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching free games`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [count]);

  return { freeGames, loading };
}
