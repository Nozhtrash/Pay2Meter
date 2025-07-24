
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, where, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Review } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Undo2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "../ui/skeleton";
import { Emoji } from "../ui/Emoji";

const ReviewList = ({ reviews, onAction, actionType, searchTerm }: { reviews: Review[], onAction: (reviewId: string) => void, actionType: 'delete' | 'restore', searchTerm: string }) => {
    
    const filteredReviews = useMemo(() => reviews.filter(review =>
        review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.opinion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.deletedReason && review.deletedReason.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [reviews, searchTerm]);

    if (filteredReviews.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No se encontraron reseñas.</p>;
    }

    return (
        <div className="space-y-4">
            {filteredReviews.map(review => (
                <Card key={review.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{review.author}</CardTitle>
                                <CardDescription>Rango: {review.authorRank} | Abusividad: {review.abusiveness}%</CardDescription>
                                {review.deletedAt && (
                                     <CardDescription className="text-destructive mt-1">
                                        Eliminada hace {formatDistanceToNow(review.deletedAt.toDate(), { locale: es })} por: {review.deletedReason}
                                     </CardDescription>
                                )}
                            </div>
                            <Button variant={actionType === 'delete' ? "destructive" : "outline"} size="icon" onClick={() => onAction(review.id)}>
                                {actionType === 'delete' ? <Trash2 className="h-4 w-4" /> : <Undo2 className="h-4 w-4" />}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{review.opinion}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function AdminReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
      setReviews(reviewsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo obtener las reseñas." });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const visibleReviews = useMemo(() => reviews.filter(r => r.status === 'visible'), [reviews]);
  const deletedReviews = useMemo(() => reviews.filter(r => r.status === 'deleted'), [reviews]);

  const handleDeleteReview = async (reviewId: string) => {
    const reason = window.prompt("Motivo de la eliminación (ej: spam, ofensivo):");
    if (!reason) {
        toast({ variant: "destructive", title: "Cancelado", description: "Se requiere un motivo para eliminar." });
        return;
    }

    const reviewRef = doc(db, "reviews", reviewId);
    try {
      await updateDoc(reviewRef, {
        status: "deleted",
        deletedReason: reason,
        deletedAt: Timestamp.now(),
      });
      toast({ title: "Reseña eliminada", description: "La reseña ha sido marcada como eliminada." });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar la reseña." });
    }
  };

  const handleRestoreReview = async (reviewId: string) => {
    if (!window.confirm("¿Restaurar esta reseña y hacerla visible de nuevo?")) return;

    const reviewRef = doc(db, "reviews", reviewId);
    try {
        await updateDoc(reviewRef, {
            status: "visible",
            deletedReason: null,
            deletedAt: null,
        });
        toast({ title: "Reseña Restaurada", description: "La reseña es visible de nuevo." });
    } catch (error) {
        console.error("Error restoring review:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo restaurar la reseña." });
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 max-w-sm" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-4 mt-2">
                {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="🔎 Buscar por autor, opinión o motivo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Tabs defaultValue="visible" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visible"><Emoji symbol="👀" label="visible" /> Visibles ({visibleReviews.length})</TabsTrigger>
            <TabsTrigger value="deleted"><Emoji symbol="🗑️" label="eliminadas" /> Eliminadas ({deletedReviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="visible">
            <ReviewList reviews={visibleReviews} onAction={handleDeleteReview} actionType="delete" searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent value="deleted">
            <ReviewList reviews={deletedReviews} onAction={handleRestoreReview} actionType="restore" searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
