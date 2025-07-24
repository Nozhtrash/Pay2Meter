
"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, orderBy, limit } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { News } from '@/types';
import { mockNews } from '@/lib/mockData';

export function useNews(count?: number) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using static mock data for now.
    // This can be re-enabled when using Firestore for news.
    setNews(mockNews);
    setLoading(false);
    /*
    let newsQuery = query(collection(db, 'news'), orderBy('publishedAt', 'desc'));
    if (count && count > 0) {
        newsQuery = query(newsQuery, limit(count));
    }
    
    const unsubscribe = onSnapshot(newsQuery, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as News[];
      setNews(newsData);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching news`, error);
      setLoading(false);
    });

    return () => unsubscribe();
    */
  }, [count]);

  return { news, loading };
}
