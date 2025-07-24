
"use client";

import { useTopReviewers } from "@/hooks/useTopReviewers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Star, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

const rankBorders: Record<string, string> = {
    "Admin": "border-primary",
    "Editor": "border-accent",
    "Hoja": "border-gray-400",
    "Madera": "border-[#A0522D]",
    "Hierro": "border-gray-500",
    "Bronce": "border-[#CD7F32]",
    "Plata": "border-[#C0C0C0]",
    "Oro": "border-[#FFD700]",
    "Platino": "border-[#E5E4E2]",
    "Diamante": "border-[#B9F2FF]",
};

interface ReviewerItemProps {
  reviewer: UserProfile;
  rankNumber: number;
}

/**
 * Renders a single reviewer item in the list.
 */
const ReviewerItem = ({ reviewer, rankNumber }: ReviewerItemProps) => (
  <li className="flex items-center gap-4">
    <span className="font-bold text-lg w-6 text-center text-muted-foreground">{rankNumber}</span>
    <Avatar className={cn("h-12 w-12 border-2", rankBorders[reviewer.rank] || "border-muted")}>
      <AvatarFallback className="bg-secondary text-xl">
        <UserIcon className="h-6 w-6 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 overflow-hidden">
      <p className="font-bold truncate text-white">{reviewer.nickname}</p>
      <p className="text-sm text-muted-foreground">{reviewer.rank}</p>
    </div>
    <div className="flex items-center gap-1.5 text-primary">
      <Star className="h-4 w-4" />
      <span className="font-mono font-bold text-lg">{reviewer.points}</span>
    </div>
  </li>
);

interface TopReviewersProps {
  title?: string;
}

/**
 * Displays a ranked list of top reviewers.
 * This component is now a self-contained sidebar element.
 */
export function TopReviewers({ title = "🏆 Top 10 Críticos" }: TopReviewersProps) {
  const { reviewers, loading } = useTopReviewers(10);

  return (
    <Card className="bg-secondary/20 border-border/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ul className="space-y-4">
            {reviewers.map((reviewer, index) => (
                <ReviewerItem key={reviewer.uid} reviewer={reviewer} rankNumber={index + 1} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

    