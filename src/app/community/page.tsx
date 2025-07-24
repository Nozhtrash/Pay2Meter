
"use client";

import { DiscordWidget } from "@/components/DiscordWidget";
import { Emoji } from "@/components/ui/Emoji";

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter text-white sm:text-5xl flex items-center justify-center gap-2">
            <Emoji symbol="💬" label="comunidad" /> Comunidad
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Únete a la conversación, comparte tus quejas y conecta con otros jugadores.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
         <DiscordWidget />
         {/* Aquí irá el foro o el feed de actividad en el futuro */}
         <div className="text-center py-16 border-2 border-dashed border-border/60 rounded-lg mt-8">
            <p className="text-2xl font-bold text-muted-foreground">Foros Próximamente</p>
            <p className="text-muted-foreground mt-2">Estamos construyendo un espacio para que puedas debatir y organizar quejas. ¡Vuelve pronto!</p>
        </div>
      </div>
    </div>
  );
}
