
"use client";

import { useState } from "react";
import { Game, Post } from "@/types";
import { GameCard } from "@/components/game/GameCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameDetailModal } from "@/components/game/GameDetailModal";
import { PostDetailModal } from "@/components/posts/PostDetailModal";
import { useAllGamesMetadata } from "@/hooks/useAllGamesMetadata";
import { Loader2 } from "lucide-react";
import { useFreeGames } from "@/hooks/useFreeGames";
import { usePosts } from "@/hooks/usePosts";
import { format } from "date-fns";
import { mockAllGames, mockFreeGames, mockNews } from '@/lib/mockData';
import { TopReviewers } from "@/components/TopReviewers";
import { AdSlot } from "@/components/AdSlot";
import { Skeleton } from "@/components/ui/skeleton";
import { Emoji } from "@/components/ui/Emoji";


export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { games: allGamesFromHook, loading: gamesLoading } = useAllGamesMetadata();
  const { posts, loading: postsLoading } = usePosts(1);
  const { freeGames: freeGamesFromHook, loading: freeGamesLoading } = useFreeGames(6);

  // Use mock data initially for faster load, then update when real data arrives
  const allGames = allGamesFromHook.length > 0 ? allGamesFromHook : mockAllGames;
  const pcGames = allGames.filter(g => g.platform === "PC");
  const androidGames = allGames.filter(g => g.platform === "Android");

  const news = mockNews;
  const freeGames = freeGamesFromHook.length > 0 ? freeGamesFromHook : mockFreeGames;
  const freeGamesPlaceholders = Array.from({ length: Math.max(0, 6 - freeGames.length) });

  const latestPost = posts[0];

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
    setSelectedPost(null);
  };
  
  const GameGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
    <div className="container mx-auto px-4 py-12">
       <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          El Muro de la Vergüenza del Gaming
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-3xl mx-auto">
          La comunidad destapa las prácticas más abusivas. Descubre qué juegos debes evitar según las opiniones y valoraciones de miles de jugadores.
        </p>
      </div>

      {postsLoading && !latestPost ? <Skeleton className="h-24 w-full" /> : latestPost ? (
        <section className="mb-12">
            <Card className="border-primary/40 bg-secondary/20 hover:border-primary/80 transition-all">
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="font-headline text-2xl font-bold">Último Análisis del Editor</h2>
                        <p className="text-lg text-primary">{latestPost.title}</p>
                        <p className="text-sm text-muted-foreground">
                            Publicado el {format(latestPost.date.toDate(), 'dd/MM/yyyy')}
                        </p>
                    </div>
                    <Button onClick={() => setSelectedPost(latestPost)}>Leer Análisis Completo</Button>
                </CardContent>
            </Card>
        </section>
      ) : null}

      <section className="mb-12">
        <Tabs defaultValue="pc" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-10">
                <TabsTrigger value="pc">Top PC Abusivos</TabsTrigger>
                <TabsTrigger value="android">Top Android Abusivos</TabsTrigger>
            </TabsList>
            <TabsContent value="pc">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pcGames.slice(0,6).map((game) => (
                        <div key={game.id} onClick={() => handleGameClick(game)} className="cursor-pointer">
                            <GameCard game={game} />
                        </div>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="android">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {androidGames.slice(0,6).map((game) => (
                        <div key={game.id} onClick={() => handleGameClick(game)} className="cursor-pointer">
                            <GameCard game={game} />
                        </div>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
      </section>
      
      <Separator className="my-16 bg-border/40" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <section className="lg:col-span-3">
            <h2 className="font-headline text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                <Emoji symbol="📰" label="noticias" /> Noticias de la Semana
            </h2>
            {news.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.slice(0, 6).map((item) => (
                    <a href={item.sourceUrl} key={item.id} target="_blank" rel="noopener noreferrer" className="group">
                        <Card className="rounded-2xl dark:bg-gradient-to-br dark:from-neutral-900 dark:to-black bg-gradient-to-br from-neutral-100 to-white overflow-hidden h-full flex flex-col transition-all border-2 border-neutral-800 dark:border-yellow-400 hover:border-neutral-700 dark:hover:border-yellow-300 hover:shadow-lg dark:hover:shadow-yellow-400/20">
                        <div className="relative w-full aspect-video">
                                <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="news article" />
                            </div>
                        <CardContent className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors flex-1">{item.title}</h3>
                            <p className="text-xs text-muted-foreground mt-2">{item.source}</p>
                        </CardContent>
                        </Card>
                    </a>
                    ))}
                </div>
            )}
        </section>
        <div className="flex flex-col space-y-8">
            <TopReviewers title="🏆 Top 10 Críticos" />
            <AdSlot adId="ad-sidebar-1">
                <p className="text-sm font-semibold">¿Quieres ver tu juego aquí?</p>
                <p className="text-xs text-muted-foreground mt-1">Contacta con nosotros para oportunidades de patrocinio.</p>
                <Button size="sm" className="w-full mt-3">Anúnciate</Button>
            </AdSlot>
        </div>
      </div>

      <Separator className="my-16 bg-border/40" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <section className="lg:col-span-3">
            <h2 className="font-headline text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                <Emoji symbol="🎲" label="juegos gratis" /> Juegos Gratis de la Semana
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {freeGames.slice(0, 6).map(game => (
                    <a href={game.url} key={game.id} target="_blank" rel="noopener noreferrer" className="group">
                        <Card className="rounded-2xl dark:bg-gradient-to-br dark:from-neutral-900 dark:to-black bg-gradient-to-br from-neutral-100 to-white overflow-hidden h-full flex flex-col transition-all border-2 border-neutral-800 dark:border-yellow-400 hover:border-neutral-700 dark:hover:border-yellow-300 hover:shadow-lg dark:hover:shadow-yellow-400/20">
                            <div className="relative w-full aspect-video">
                                <Image src={game.imageUrl} alt={game.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="free game" />
                            </div>
                            <CardContent className="p-4 text-center flex-1 flex flex-col">
                                <h3 className="font-bold text-xl group-hover:text-primary transition-colors flex-1">{game.title}</h3>
                                {game.critic && <p className="text-sm text-muted-foreground mt-2 italic">"{game.critic}"</p>}
                            </CardContent>
                             <CardContent className="p-4 pt-0">
                                <p className="text-lg text-muted-foreground">{game.platform}</p>
                                <Button className="mt-4 w-full" variant="secondary">Reclamar</Button>
                             </CardContent>
                        </Card>
                    </a>
                ))}
                {(freeGamesLoading && freeGames.length === 0 ? freeGamesPlaceholders : []).map((_, index) => (
                    <Card key={`placeholder-${index}`} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/60 bg-secondary/20 min-h-[300px]">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-muted-foreground">¿?</p>
                            <p className="mt-2 text-muted-foreground">Próximamente...</p>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
        
        <div className="flex flex-col space-y-8">
            <TopReviewers title="💸 Top 10 Contribuidores" />
             <AdSlot adId="ad-sidebar-2">
                <p className="text-sm font-semibold">¡Únete a nuestro Discord!</p>
                <p className="text-xs text-muted-foreground mt-1">Participa en sorteos y discusiones exclusivas.</p>
                <Button size="sm" variant="secondary" className="w-full mt-3">Unirse ahora</Button>
            </AdSlot>
        </div>
      </div>

    </div>
    {selectedGame && <GameDetailModal game={selectedGame} onClose={handleCloseModal} />}
    {selectedPost && <PostDetailModal post={selectedPost} allGames={allGames} onClose={handleCloseModal} />}
    </>
  );
}

    
