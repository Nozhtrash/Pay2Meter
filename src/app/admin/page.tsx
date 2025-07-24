
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useAllGamesMetadata } from "@/hooks/useAllGamesMetadata";
import { AdminGameItem } from "@/components/admin/AdminGameItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPostTab } from "@/components/admin/AdminPostTab";
import { AdminReviewsTab } from "@/components/admin/AdminReviewsTab";
import { UserManagementTab } from "@/components/admin/UserManagementTab";
import type { UserProfile } from "@/types";

const ADMIN_ROLES: UserProfile['role'][] = ['admin'];
const EDITOR_ROLES: UserProfile['role'][] = ['admin', 'editor'];

export default function AdminPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { games, loading: gamesLoading } = useAllGamesMetadata();
  const router = useRouter();

  const hasAdminAccess = userProfile && ADMIN_ROLES.includes(userProfile.role);
  const hasEditorAccess = userProfile && EDITOR_ROLES.includes(userProfile.role);

  useEffect(() => {
    if (!authLoading && !hasEditorAccess) {
      router.push("/login");
    }
  }, [user, userProfile, authLoading, router, hasEditorAccess]);

  if (authLoading || gamesLoading || !userProfile || !hasEditorAccess) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const defaultTab = hasAdminAccess ? 'users' : 'posts';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter text-white sm:text-5xl">
          Panel de Administración
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gestiona el contenido y la comunidad de Pay2Meter.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto mb-10">
           {hasAdminAccess && (
            <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
          )}
          <TabsTrigger value="posts">Gestión de Posts</TabsTrigger>
          <TabsTrigger value="games">Gestión de Juegos</TabsTrigger>
          {hasAdminAccess && (
            <TabsTrigger value="reviews">Moderar Reseñas</TabsTrigger>
          )}
        </TabsList>

        {hasAdminAccess && (
          <TabsContent value="users">
            <UserManagementTab />
          </TabsContent>
        )}

        <TabsContent value="posts">
          <AdminPostTab allGames={games} />
        </TabsContent>
        <TabsContent value="games">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <AdminGameItem key={game.id} game={game} />
            ))}
          </div>
        </TabsContent>
        {hasAdminAccess && (
          <TabsContent value="reviews">
            <AdminReviewsTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
