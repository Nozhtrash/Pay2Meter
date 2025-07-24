
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, OAuthProvider } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs, limit, writeBatch, Timestamp } from "firebase/firestore";
import { auth, db, getUserByNickname } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Emoji } from "../ui/Emoji";

const signupSchema = z.object({
  nickname: z.string().min(3, { message: "El nickname debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Introduce una dirección de correo válida." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "El email o nickname es obligatorio." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

const resetPasswordSchema = z.object({
    email: z.string().email({ message: "Introduce una dirección de correo válida." }),
});

type AuthFormProps = {
  mode: "login" | "signup";
};

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.25C2.999 7.082 3.36 8 4.213 8h3.787v2.37H7.438a4.826 4.826 0 0 1-4.783-3.321A4.73 4.73 0 0 1 3.51 5.713a4.92 4.92 0 0 1 4.49-3.56C11.191 2.247 13 3.84 13.528 5.756H15.545z"/>
    </svg>
);

const DiscordIcon = () => (
    <svg role="img" viewBox="0 0 248 193" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current"><title>Discord</title><path d="M216.856 16.593c-14.282-10.258-30.153-16.13-46.99-17.583a.585.585 0 0 0-.585.498c-1.846 9.31-5.176 18.23-9.743 26.54-12.48-4.32-25.548-7.14-39.06-8.525-13.511-1.383-27.53-1.383-40.91.084-13.382 1.469-26.45 4.29-38.93 8.525-4.567-8.31-7.898-17.23-9.743-26.54a.585.585 0 0 0-.585-.498C51.54 0.463 35.668 6.335 21.386 16.593a.585.585 0 0 0-.214.772C10.18 40.59 2.123 71.04 0 107.24a.585.585 0 0 0 .195.543c16.32 13.924 33.45 22.84 50.81 29.5a.585.585 0 0 0 .668-.184c6.12-8.302 11.23-17.65 15.22-27.76a.585.585 0 0 0-.272-.692c-8.9-5.1-17.39-11.23-25.13-18.46a.585.585 0 0 1-.035-.856c2.89-3.235 5.56-6.685 7.97-10.32a.585.585 0 0 1 .632-.31c40.06 20.16 83.13 20.16 122.95 0a.585.585 0 0 1 .633.31c2.41 3.635 5.08 7.085 7.97 10.32a.585.585 0 0 1-.034.856c-7.74 7.23-16.23 13.36-25.13 18.46a.585.585 0 0 0-.273.692c3.99 10.11 9.1 19.458 15.22 27.76a.585.585 0 0 0 .668.184c17.36-6.66 34.49-15.576 50.81-29.5a.585.585 0 0 0 .195-.543C245.24 74.24 235.8 45.1 217.07.365a.585.585 0 0 0-.214-.772zM82.63 118.91c-9.52 0-17.23-9.5-17.23-21.2 0-11.71 7.71-21.2 17.23-21.2s17.23 9.49 17.23 21.2c.001 11.7-7.71 21.2-17.23 21.2zm82.74 0c-9.52 0-17.23-9.5-17.23-21.2 0-11.71 7.71-21.2 17.23-21.2s17.23 9.49 17.23 21.2c0 11.7-7.71 21.2-17.23 21.2z"/></svg>
);


export default function AuthForm({ mode: initialMode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "resetPassword">(initialMode);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const formSchema = mode === 'signup' 
    ? signupSchema 
    : mode === 'login' 
    ? loginSchema 
    : resetPasswordSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mode === 'login'
        ? { identifier: "", password: "" }
        : { email: "", password: "", ...(mode === 'signup' && { nickname: "" }) },
  });

  const handlePasswordReset = async (values: z.infer<typeof resetPasswordSchema>) => {
      setLoading(true);
      try {
          await sendPasswordResetEmail(auth, values.email);
          toast({
              title: "Correo enviado",
              description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
          });
          setMode("login"); 
      } catch (error: any) {
          console.error(error);
          toast({
              variant: "destructive",
              title: "Error",
              description: "No se pudo enviar el correo. Verifica que la dirección sea correcta.",
          });
      } finally {
          setLoading(false);
      }
  };

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
        let userEmail = values.identifier;

        if (!values.identifier.includes('@')) {
            const userProfile = await getUserByNickname(values.identifier);
            if (userProfile) {
                userEmail = userProfile.email;
            } else {
                 toast({
                    variant: "destructive",
                    title: "Error de Autenticación",
                    description: "No se encontró ningún usuario con ese email o nickname.",
                });
                setLoading(false);
                return;
            }
        }
        
        await signInWithEmailAndPassword(auth, userEmail, values.password);
        toast({ title: "¡Has iniciado sesión!", description: "Bienvenido de nuevo." });
        router.push("/profile");

    } catch (error: any) {
        console.error("Login error:", error.code, error.message);
        let errorMessage = "Ocurrió un error inesperado.";

        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            errorMessage = "El email/nickname o la contraseña son incorrectos.";
        }
        toast({
            variant: "destructive",
            title: "Error de Autenticación",
            description: errorMessage,
        });
    } finally {
        setLoading(false);
    }
  }
  
  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      const existingUserByNickname = await getUserByNickname(values.nickname);
      if (existingUserByNickname) {
        form.setError("nickname", { message: "Este nickname ya está en uso." });
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      const adminQuery = query(collection(db, 'users'), where('role', '==', 'admin'), limit(1));
      const adminSnapshot = await getDocs(adminQuery);
      const role = adminSnapshot.empty && values.nickname.toLowerCase() === 'nozhtrash' ? 'admin' : 'usuario';

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        nickname: values.nickname,
        role: role,
        points: role === 'admin' ? 9999 : 100,
        rank: role === 'admin' ? 'Admin' : "Hoja",
        createdAt: Timestamp.now(),
      });

      toast({ title: "¡Cuenta creada!", description: "Bienvenido a Pay2Meter." });
      router.push("/profile");

    } catch (error: any) {
       console.error("Signup error:", error);
       let errorMessage = 'Ocurrió un error inesperado durante el registro.';
       if (error.code === 'auth/email-already-in-use') {
          form.setError("email", { message: "Este correo electrónico ya está en uso." });
          errorMessage = 'Este correo electrónico ya está en uso.';
       }
       toast({
          variant: "destructive",
          title: "Error de Registro",
          description: errorMessage,
       });
    } finally {
        setLoading(false);
    }
  }

  const handleOAuthSignIn = async (provider: GoogleAuthProvider | OAuthProvider) => {
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid), limit(1)));

        if (userDoc.empty) { // New user
            const nickname = user.displayName || user.email?.split('@')[0] || `user${user.uid.substring(0, 5)}`;
            // Ensure nickname is unique
            let finalNickname = nickname;
            let i = 1;
            while(await getUserByNickname(finalNickname)) {
                finalNickname = `${nickname}${i}`;
                i++;
            }

            const adminQuery = query(collection(db, 'users'), where('role', '==', 'admin'), limit(1));
            const adminSnapshot = await getDocs(adminQuery);
            const role = adminSnapshot.empty && finalNickname.toLowerCase() === 'nozhtrash' ? 'admin' : 'usuario';

            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                nickname: finalNickname,
                role: role,
                points: role === 'admin' ? 9999 : 100,
                rank: role === 'admin' ? 'Admin' : 'Hoja',
                createdAt: Timestamp.now(),
            });
            toast({ title: "¡Cuenta creada con éxito!", description: "Bienvenido a Pay2Meter." });
        } else {
            toast({ title: "¡Has iniciado sesión!", description: "Bienvenido de nuevo." });
        }
        router.push("/profile");

    } catch (error: any) {
        console.error("OAuth Sign-In Error", error);
        toast({ variant: 'destructive', title: 'Error de inicio de sesión', description: 'No se pudo iniciar sesión. Por favor, inténtalo de nuevo.' });
    } finally {
        setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (mode === 'resetPassword') {
        handlePasswordReset(values as z.infer<typeof resetPasswordSchema>);
    } else if (mode === 'login') {
        handleLogin(values as z.infer<typeof loginSchema>);
    } else {
        handleSignup(values as z.infer<typeof signupSchema>);
    }
  };

  if (mode === 'resetPassword') {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de tu cuenta</FormLabel>
                      <FormControl>
                        <Input placeholder="📧 tu@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full font-bold" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enviar enlace de recuperación"}
                </Button>
                <Button variant="link" className="w-full" onClick={() => setMode('login')}>
                    Volver a Iniciar Sesión
                </Button>
            </form>
        </Form>
    );
  }

  return (
    <Form {...form}>
        <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full font-bold" onClick={() => handleOAuthSignIn(new GoogleAuthProvider())} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><GoogleIcon /> Google</>}
                </Button>
                <Button variant="outline" className="w-full font-bold" onClick={() => handleOAuthSignIn(new OAuthProvider('discord.com'))} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><DiscordIcon /> Discord</>}
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                </div>
            </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mode === 'signup' && (
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname</FormLabel>
                <FormControl>
                  <Input placeholder="🎮 Tu Nickname Gamer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name={mode === 'login' ? 'identifier' : 'email'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{mode === 'login' ? 'Email o Nickname' : 'Email'}</FormLabel>
              <FormControl>
                <Input placeholder={mode === 'login' ? '📧 tu_nickname o tu@ejemplo.com' : '📧 tu@ejemplo.com'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                    <Input 
                        type={isPasswordVisible ? "text" : "password"} 
                        placeholder="🔒 ••••••••" 
                        {...field} 
                    />
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode === 'login' && (
            <div className="text-right">
                <Button type="button" variant="link" className="p-0 h-auto text-sm" onClick={() => setMode('resetPassword')}>
                    ¿Olvidaste tu contraseña?
                </Button>
            </div>
        )}
        <Button type="submit" className="w-full font-bold" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            mode === "signup" ? <><Emoji label="crear cuenta" symbol="✍️" /> Crear Cuenta</> : <><Emoji label="login" symbol="🔐" /> Iniciar Sesión</>
          )}
        </Button>
      </form>
        </div>
    </Form>
  );
}
