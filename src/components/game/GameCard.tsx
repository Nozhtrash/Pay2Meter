
"use client";

import Image from "next/image";
import { Flame, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Game } from "@/types";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card className="rounded-2xl dark:bg-gradient-to-br dark:from-neutral-900 dark:to-black bg-gradient-to-br from-neutral-100 to-white flex h-full w-full flex-col overflow-hidden border-2 border-neutral-800 dark:border-yellow-400 hover:border-neutral-700 dark:hover:border-yellow-300 hover:shadow-lg dark:hover:shadow-yellow-400/20 transition-all">
      <div className="flex-grow flex flex-col">
        <CardHeader className="p-0">
          <div className="relative aspect-video">
            <Image
              src={game.imageUrl}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="game cover"
            />
            <Badge className="absolute top-2 right-2" variant={game.platform === 'PC' ? 'default' : 'secondary'}>{game.platform}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <CardTitle className="font-headline text-xl text-white">{game.name}</CardTitle>
          <CardDescription className="mt-1 text-sm">{game.developer}</CardDescription>
          <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{game.critic}</p>
        </CardContent>
      </div>
      <CardFooter className="flex flex-col items-start gap-4 p-4 pt-0 mt-auto">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-destructive" />
                <span className="font-bold text-lg text-white">{game.abuseRating?.toFixed(0) ?? '???'}%</span>
                <span className="text-xs">(Abusividad)</span>
            </div>
            <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-amber-400" />
                 <span className="font-bold text-lg text-white">{game.reviewCount.toLocaleString()}</span>
                 <span className="text-xs">(Opiniones)</span>
            </div>
        </div>
        <Button className="w-full font-bold">Ver Opiniones y Detalles</Button>
      </CardFooter>
    </Card>
  );
}

    
