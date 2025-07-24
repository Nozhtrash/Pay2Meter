
import { Timestamp } from "firebase/firestore";

// Define rank thresholds
export const rankThresholds: Record<string, number> = {
    "Hoja": 0,
    "Madera": 100,
    "Hierro": 500,
    "Bronce": 1000,
    "Plata": 2000,
    "Oro": 5000,
    "Platino": 10000,
    "Diamante": 20000,
};
export const RANKS = Object.keys(rankThresholds);

export const getRankForPoints = (points: number): string => {
    let userRank = "Hoja";
    for (const rank of RANKS) {
        if (points >= rankThresholds[rank]) {
            userRank = rank;
        } else {
            break;
        }
    }
    return userRank;
};


export interface UserProfile {
  uid: string;
  email: string | null;
  nickname: string;
  role: "admin" | "editor" | "usuario";
  points: number;
  rank: string;
  createdAt?: Timestamp;
  country?: string;
  socialLink?: string;
  languages?: string;
  discord?: string;
  phone?: string;
}

export interface Game {
    id: string;
    name: string;
    developer: string;
    imageUrl: string;
    p2wScore: number;
    reviewCount: number;
    platform: "PC" | "Android";
    description: string;
    abuseRating?: number;
    critic?: string;
}

export interface Review {
    id: string;
    gameId: string;
    userId: string;
    author: string;
    authorRank: string;
    opinion: string;
    abusiveness: number;
    createdAt: Timestamp;
    status: 'visible' | 'deleted';
    upvotes: number;
    downvotes: number;
    deletedReason?: string | null;
    deletedAt?: Timestamp | null;
}

export interface News {
    id: string;
    title: string;
    source: string;
    sourceUrl: string;
    imageUrl: string;
    publishedAt?: Timestamp;
}

export interface FreeGame {
    id: string;
    title: string;
    platform: string;
    imageUrl: string;
    url: string;
    releaseDate?: Timestamp;
    critic?: string;
}

export interface Post {
    id: string;
    title: string;
    date: Timestamp;
    summary: string;
    content: string;
    authorId: string;
    relatedGames: string[]; // Array of game IDs
}

export interface PostHistory {
    id: string;
    editorUid: string;
    timestamp: Timestamp;
    changedFields: Record<string, { from: any; to: any }>;
}
