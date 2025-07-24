"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Game } from '@/types';

export function useAllGamesMetadata() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gamesCollectionRef = collection(db, 'gameMetadata');
    
    const unsubscribe = onSnapshot(gamesCollectionRef, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Game[];
      setGames(gamesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching games metadata:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { games, loading };
}
