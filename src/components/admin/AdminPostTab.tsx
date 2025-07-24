
"use client";

import { useState } from "react";
import { Game, Post } from "@/types";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addPost, updatePost, deletePost } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "../ui/skeleton";
import { Emoji } from "../ui/Emoji";

interface AdminPostTabProps {
    allGames: Game[];
}

export function AdminPostTab({ allGames }: AdminPostTabProps) {
    const { posts, loading } = usePosts();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<Post> | null>(null);

    const openModal = (postItem: Partial<Post> | null = null) => {
        if (postItem) {
            setCurrentPost({ ...postItem });
        } else {
            setCurrentPost({
                title: "",
                summary: "",
                content: "",
                relatedGames: [],
                date: Timestamp.now()
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPost(null);
    };

    const handleSave = async () => {
        if (!currentPost || !currentPost.title || !currentPost.summary || !currentPost.content) {
            toast({ variant: "destructive", title: "Faltan campos", description: "Título, resumen y contenido son obligatorios." });
            return;
        }
        if (!user) {
            toast({ variant: "destructive", title: "No autenticado", description: "Debes iniciar sesión para guardar." });
            return;
        }

        setIsSubmitting(true);
        try {
            if (currentPost.id) {
                await updatePost(currentPost.id, currentPost as Post, user.uid);
                toast({ title: "Post actualizado" });
            } else {
                await addPost({ ...currentPost, authorId: user.uid } as Omit<Post, 'id'>);
                toast({ title: "Post creado" });
            }
            closeModal();
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el post." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsSubmitting(true);
        try {
            await deletePost(id);
            toast({ title: "Post eliminado" });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGameSelection = (gameId: string) => {
        if (!currentPost) return;
        const relatedGames = currentPost.relatedGames ? [...currentPost.relatedGames] : [];
        const gameIndex = relatedGames.indexOf(gameId);
        if (gameIndex > -1) {
            relatedGames.splice(gameIndex, 1);
        } else {
            relatedGames.push(gameId);
        }
        setCurrentPost({ ...currentPost, relatedGames });
    };

    if (loading) {
        return (
          <div className="space-y-4">
            <Skeleton className="h-10 w-40 ml-auto" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        )
    }

    return (
        <div>
            <div className="text-right mb-4">
                <Button onClick={() => openModal()}>
                    <PlusCircle className="mr-2" />
                    Crear Post
                </Button>
            </div>
            <div className="space-y-4">
                {posts.map(item => (
                    <Card key={item.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openModal(item)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Esto eliminará permanentemente el post.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(item.id)} disabled={isSubmitting}>
                                                {isSubmitting ? <Skeleton className="h-5 w-5 rounded-full" /> : "Eliminar"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground">Publicado: {format(item.date.toDate(), 'dd/MM/yyyy')}</p>
                           <p className="text-sm mt-2 line-clamp-2">{item.summary}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isModalOpen && currentPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="bg-card p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-headline">{currentPost.id ? "Editar" : "Crear"} Post</h2>
                            <Button variant="ghost" size="icon" onClick={closeModal}><X /></Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    value={currentPost.title}
                                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="summary">Resumen (Previa)</Label>
                                <Textarea
                                    id="summary"
                                    value={currentPost.summary}
                                    onChange={(e) => setCurrentPost({ ...currentPost, summary: e.target.value })}
                                    rows={3}
                                />
                            </div>
                             <div>
                                <Label htmlFor="content">Contenido Completo (Markdown compatible)</Label>
                                <Textarea
                                    id="content"
                                    value={currentPost.content}
                                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                    rows={10}
                                    className="whitespace-pre-wrap"
                                />
                            </div>
                            <div>
                                <Label>Juegos Relacionados</Label>
                                <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border p-4 mt-2">
                                    {allGames.map(game => (
                                        <div key={game.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`game-${game.id}`}
                                                checked={currentPost.relatedGames?.includes(game.id)}
                                                onCheckedChange={() => handleGameSelection(game.id)}
                                            />
                                            <Label htmlFor={`game-${game.id}`}>{game.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={closeModal}>Cancelar</Button>
                            <Button onClick={handleSave} disabled={isSubmitting}>
                                {isSubmitting && <Skeleton className="h-5 w-5 rounded-full" />}
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
