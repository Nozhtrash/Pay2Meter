"use client";

import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Crea una Cuenta</CardTitle>
          <CardDescription>Introduce tu correo y contraseña para unirte a Pay2Meter y compartir tu opinión.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
