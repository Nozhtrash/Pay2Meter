
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Game } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { updateAbuseRating } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AdminGameItemProps {
    game: Game;
}

export function AdminGameItem({ game }: AdminGameItemProps) {
    const [rating, setRating] = useState(game.abuseRating ?? 0);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateAbuseRating(game.id, rating);
            toast({
                title: 'Guardado',
                description: `La puntuación de ${game.name} ha sido actualizada.`,
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo guardar la puntuación.',
            });
        } finally {
            setLoading(false);
        }
    };
    
    const getRatingColor = (value: number) => {
        if (value > 66) return 'hsl(var(--destructive))';
        if (value > 33) return 'hsl(var(--primary))';
        return 'hsl(142.1 76.2% 36.3%)';
    }

    return (
        <Card className="flex h-full flex-col overflow-hidden border-border/60 bg-card">
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
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-4">
                <CardTitle className="font-headline text-lg text-white truncate">{game.name}</CardTitle>
                <CardDescription className="text-sm">{game.developer}</CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 p-4 pt-0">
                <div className="w-full space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-muted-foreground">Puntuación de Abusividad</label>
                        <span className="font-bold text-lg text-white">{rating}%</span>
                    </div>
                    <Slider
                        value={[rating]}
                        onValueChange={(value) => setRating(value[0])}
                        max={100}
                        step={1}
                        className="[&>div]:bg-secondary"
                        style={{'--slider-range-color': getRatingColor(rating)} as React.CSSProperties}
                    />
                </div>
                <Button onClick={handleSave} className="w-full font-bold" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Guardar'}
                </Button>
            </CardFooter>
        </Card>
    );
}

    