
"use client";

import Image from "next/image";
import { X, Gamepad2 } from "lucide-react";
import { Post, Game } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';

interface PostDetailModalProps {
  post: Post;
  allGames: Game[];
  onClose: () => void;
}

export function PostDetailModal({ post, allGames, onClose }: PostDetailModalProps) {
  
  const relatedGamesDetails = post.relatedGames
    .map(gameId => allGames.find(g => g.id === gameId))
    .filter((g): g is Game => g !== undefined);


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-lg shadow-xl text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
          <X size={24} />
        </button>

        <div className="overflow-y-auto max-h-[90vh] p-8">
            <p className="text-sm text-primary font-semibold">Post Detallado</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-1">{post.title}</h1>
            <p className="text-lg text-muted-foreground mt-2">
                Publicado el {format(post.date.toDate(), 'dd MMMM, yyyy')}
            </p>
            
            <Separator className="my-6" />

            <div className="prose prose-invert prose-lg max-w-none text-foreground/90 whitespace-pre-wrap">
                <p>{post.content}</p>
            </div>

            {relatedGamesDetails.length > 0 && (
                <>
                    <Separator className="my-8" />
                    <div>
                        <h2 className="font-headline text-3xl font-bold mb-6">Juegos Analizados</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {relatedGamesDetails.map(game => (
                                <Card key={game.id} className="bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                    <CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <Image src={game.imageUrl} alt={game.name} fill className="object-cover rounded-md" sizes="48px" data-ai-hint="game icon" />
                                        </div>
                                        <CardTitle className="text-lg leading-tight">{game.name}</CardTitle>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
}

    