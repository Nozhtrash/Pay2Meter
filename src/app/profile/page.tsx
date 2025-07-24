
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, User as UserIcon, Shield, Star, Mail, Phone, Globe, Languages, ChevronDown, ChevronUp, Link as LinkIcon, MessageSquare } from "lucide-react";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Emoji } from "@/components/ui/Emoji";

const rankBorders: Record<string, string> = {
    "Admin": "border-primary",
    "Editor": "border-accent",
    "Hoja": "border-gray-400",
    "Madera": "border-[#A0522D]",
    "Hierro": "border-gray-500",
    "Bronce": "border-[#CD7F32]",
    "Plata": "border-[#C0C0C0]",
    "Oro": "border-[#FFD700]",
    "Platino": "border-[#E5E4E2]",
    "Diamante": "border-[#B9F2FF]",
};

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading || !userProfile) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const { nickname, email, role, points, rank, country, socialLink, languages, discord, phone } = userProfile;

  return (
    <div className="container mx-auto max-w-2xl py-12">
       <Card>
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Avatar className={cn("h-28 w-28 border-4", rankBorders[rank] || "border-muted")}>
                    <AvatarFallback className="bg-secondary text-5xl">
                        <UserIcon className="h-16 w-16 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
            </div>
          <CardTitle className="font-headline text-4xl">{nickname}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" /> {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-secondary p-4">
                    <h4 className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground"><Shield/>Rango</h4>
                    <p className="text-2xl font-bold">{rank}</p>
                </div>
                 <div className="rounded-lg bg-secondary p-4">
                    <h4 className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground"><Star/>Puntos</h4>
                    <p className="text-2xl font-bold">{points}</p>
                </div>
            </div>

            <Separator />
            
            <Collapsible open={isInfoVisible} onOpenChange={setIsInfoVisible}>
              <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full">
                    Información Adicional
                    {isInfoVisible ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                  </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <div className="mt-4 space-y-3 rounded-lg bg-secondary/50 p-4">
                      {country && <p className="flex items-center gap-2"><Globe/>País: <span className="font-semibold">{country}</span></p>}
                      {socialLink && <p className="flex items-center gap-2"><LinkIcon />Redes: <a href={socialLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{socialLink}</a></p>}
                      {languages && <p className="flex items-center gap-2"><Languages/>Idiomas: <span className="font-semibold">{languages}</span></p>}
                      {discord && <p className="flex items-center gap-2"><MessageSquare />Discord: <span className="font-semibold">{discord}</span></p>}
                      {phone && <p className="flex items-center gap-2"><Phone/>Teléfono: <span className="font-semibold">{phone}</span></p>}
                      {!country && !socialLink && !languages && !discord && !phone && (
                          <p className="text-center text-muted-foreground">No hay información adicional para mostrar.</p>
                      )}
                  </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />
            
             <div className="text-center">
                 <h3 className="text-lg font-semibold text-muted-foreground">Mis Opiniones</h3>
                 <p className="mt-2 text-muted-foreground">Aquí aparecerán las valoraciones que has enviado.</p>
                 {role === 'admin' && (
                     <Button onClick={() => router.push('/admin')} className="mt-4">
                         Ir al Panel de Administración
                     </Button>
                 )}
            </div>
            <Button onClick={handleLogout} className="w-full" variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    
