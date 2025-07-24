
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GameDetailModal } from "@/components/game/GameDetailModal";
import { useState } from "react";
import type { Game } from "@/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAllGamesMetadata } from "@/hooks/useAllGamesMetadata";
import { mockAllGames } from "@/lib/mockData";

export default function GamesPage() {
    const { games, loading } = useAllGamesMetadata();
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const handleGameClick = (game: Game) => {
        setSelectedGame(game);
    };

    const handleCloseModal = () => {
        setSelectedGame(null);
    };
    
    // Use mock data if firestore is empty
    const displayGames = games.length > 0 ? games : mockAllGames;

    const sortedGames = [...displayGames].sort((a, b) => (b.abuseRating ?? 0) - (a.abuseRating ?? 0));

    if (loading && games.length === 0) {
        return (
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                        Ranking de Juegos Pay2Win
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        La comunidad ha hablado. Estos son los juegos con las prácticas más abusivas.
                    </p>
                </div>

                <div className="space-y-4">
                    {sortedGames.map((game, index) => (
                        <Card key={game.id} className="flex flex-col md:flex-row items-center overflow-hidden border-border/60 bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                            <div className="relative w-full h-48 md:w-48 md:h-full flex-shrink-0">
                                 <Image
                                    src={game.imageUrl}
                                    alt={game.name}
                                    fill
                                    className="object-cover"
                                    data-ai-hint="game cover"
                                />
                            </div>
                            <CardHeader className="flex-1">
                                <CardTitle className="font-headline text-2xl text-white">{index + 1}. {game.name}</CardTitle>
                                <CardDescription>{game.developer}</CardDescription>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{game.critic}</p>
                            </CardHeader>
                            <CardContent className="flex items-center gap-8 text-center p-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Abusividad</p>
                                    <p className="text-3xl font-bold text-primary">
                                        {game.abuseRating !== undefined ? `${game.abuseRating}%` : '???'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Opiniones</p>
                                    <p className="text-3xl font-bold">{game.reviewCount}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6">
                                 <Button onClick={() => handleGameClick(game)}>Ver Detalles</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            {selectedGame && <GameDetailModal game={selectedGame} onClose={handleCloseModal} />}
        </>
    )
}
