
"use client";

import { useState } from "react";
import { Post, Game } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/usePosts";
import { Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { PostDetailModal } from "@/components/posts/PostDetailModal";
import { useAllGamesMetadata } from "@/hooks/useAllGamesMetadata";

export default function PostsPage() {
    const { posts, loading: postsLoading } = usePosts();
    const { games, loading: gamesLoading } = useAllGamesMetadata();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const handleCloseModal = () => {
        setSelectedPost(null);
    };

    const loading = postsLoading || gamesLoading;

    return (
        <>
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                        Panel de Edición
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Análisis y críticas detalladas sobre las prácticas de la industria del videojuego.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-8">
                        {posts.map(item => (
                            <Card key={item.id} className="bg-secondary/20 border-border/50">
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl text-primary">{item.title}</CardTitle>
                                    <CardDescription>
                                        Publicado el: {format(item.date.toDate(), 'dd MMMM, yyyy')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground line-clamp-3">{item.summary}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={() => setSelectedPost(item)}>Leer más</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-border/60 rounded-lg">
                        <p className="text-xl text-muted-foreground">Aún no hay posts publicados.</p>
                        <p className="text-muted-foreground mt-2">Vuelve pronto para ver los análisis más recientes.</p>
                    </div>
                )}
            </div>
            {selectedPost && <PostDetailModal post={selectedPost} allGames={games} onClose={handleCloseModal} />}
        </>
    );
}
