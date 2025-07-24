
"use client";

import Image from "next/image";
import { X, Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Game, Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { AbuseRatingCircle } from "./AbuseRatingCircle";
import { useAuth } from "@/hooks/useAuth";
import { addReview } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useGameReviews } from "@/hooks/useGameReviews";
import { Slider } from "@/components/ui/slider";
import { useAbuseRating } from "@/hooks/useAbuseRating";


interface GameDetailModalProps {
  game: Game;
  onClose: () => void;
}

export function GameDetailModal({ game, onClose }: GameDetailModalProps) {
  const { abuseRating, loading: ratingLoading } = useAbuseRating(game.id);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [opinion, setOpinion] = useState("");
  const [userAbuseRating, setUserAbuseRating] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reviews, loading: reviewsLoading } = useGameReviews(game.id);

  const handleSubmitReview = async () => {
    if (!user || !userProfile) {
      toast({
        variant: "destructive",
        title: "No has iniciado sesión",
        description: "Debes iniciar sesión para dejar una opinión.",
      });
      return;
    }
    if (!opinion.trim()) {
        toast({
            variant: "destructive",
            title: "Opinión vacía",
            description: "Por favor, escribe algo antes de enviar.",
        });
        return;
    }

    setIsSubmitting(true);
    try {
        await addReview({
            gameId: game.id,
            userId: user.uid,
            author: userProfile.nickname,
            authorRank: userProfile.rank,
            opinion: opinion,
            abusiveness: userAbuseRating,
            status: 'visible'
        });
        toast({
            title: "¡Opinión enviada!",
            description: "Gracias por tu contribución a la comunidad.",
        });
        setOpinion("");
        setUserAbuseRating(50);
    } catch (error) {
        console.error("Error submitting review:", error);
        toast({
            variant: "destructive",
            title: "Error al enviar",
            description: "No se pudo guardar tu opinión. Inténtalo de nuevo.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }


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

        <div className="overflow-y-auto max-h-[90vh] p-0">
          <div className="relative h-64 md:h-80 w-full">
            <Image
              src={game.imageUrl}
              alt={game.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              data-ai-hint="game cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
          </div>

          <div className="p-6 md:p-8 -mt-20 relative z-10">
            <Badge className="mb-2" variant={game.platform === 'PC' ? 'default' : 'secondary'}>{game.platform}</Badge>
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{game.name}</h1>
            <p className="text-lg text-muted-foreground">{game.developer}</p>
            <p className="mt-4 text-base">{game.critic}</p>
            
            <div className="mt-6 flex flex-col md:flex-row items-center justify-around bg-secondary/50 rounded-lg p-4 gap-6">
                <div className="flex items-center gap-4">
                    {ratingLoading ? <Loader2 className="h-12 w-12 animate-spin"/> : <AbuseRatingCircle rating={abuseRating || game.abuseRating || 0} />}
                     <div>
                        <p className="font-headline text-2xl">Abusividad</p>
                        <p className="text-sm text-muted-foreground">Qué tanto exprime al jugador</p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Puntuación P2W</p>
                        <p className="text-4xl font-bold text-primary">{game.p2wScore?.toFixed(1) ?? 'N/A'}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Opiniones</p>
                        <p className="text-4xl font-bold">{game.reviewCount?.toLocaleString() ?? 0}</p>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />
            
            <Card className="bg-secondary/30 border-border/50">
                <CardHeader>
                    <CardTitle>Deja tu Opinión</CardTitle>
                    <CardDescription>{user ? `Como ${userProfile?.nickname}, ¡tu voz es la que importa!` : "Inicia sesión para poder opinar."}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">¿Qué tan abusivo lo consideras?</label>
                            <span className="font-bold text-lg text-white">{userAbuseRating}%</span>
                        </div>
                        <Slider
                            value={[userAbuseRating]}
                            onValueChange={(value) => setUserAbuseRating(value[0])}
                            max={100}
                            step={1}
                            disabled={!user || isSubmitting}
                        />
                    </div>
                    <Textarea 
                        placeholder={user ? "Escribe tu opinión honesta sobre las mecánicas del juego..." : "Inicia sesión para dejar una opinión."} 
                        className="bg-background/50"
                        value={opinion}
                        onChange={(e) => setOpinion(e.target.value)}
                        disabled={!user || isSubmitting}
                    />
                    <Button 
                        className="w-full font-bold" 
                        onClick={handleSubmitReview}
                        disabled={!user || isSubmitting || !opinion.trim()}
                    >
                         {isSubmitting ? <Loader2 className="animate-spin" /> : 'Enviar Valoración'}
                    </Button>
                </CardContent>
            </Card>


            <Separator className="my-8" />

            <div>
              <h2 className="font-headline text-3xl font-bold mb-6">Opiniones de la Comunidad</h2>
               {reviewsLoading ? (
                <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id} className="bg-secondary/30 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold">{review.author}</p>
                            <p className="text-xs text-muted-foreground">Rango: {review.authorRank}</p> 
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Nivel de Abuso</p>
                            <p className="text-2xl font-bold text-destructive">{review.abusiveness}%</p>
                          </div>
                        </div>
                        <p className="my-4 text-sm">{review.opinion}</p>
                        <div className="flex items-center justify-end gap-4 mt-2">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-green-500">
                                <ThumbsUp size={16} />
                                <span>{review.upvotes ?? 0}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-red-500">
                                <ThumbsDown size={16} />
                                <span>{review.downvotes ?? 0}</span>
                            </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Este juego todavía no tiene opiniones. ¡Sé el primero!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    