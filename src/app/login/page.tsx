"use client";

import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">¡Bienvenido de nuevo!</CardTitle>
          <CardDescription>Inicia sesión para dejar tu opinión y valoración.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" />
           <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
              Regístrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
