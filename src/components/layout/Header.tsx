
"use client";

import Link from "next/link";
import { LogIn, LogOut, Menu, User as UserIcon, ShieldCheck } from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { Emoji } from "../ui/Emoji";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Button variant="ghost" asChild>
    <Link href={href} className="text-base font-semibold">
      {children}
    </Link>
  </Button>
);

const DiscordIcon = () => (
    <svg role="img" viewBox="0 0 248 193" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Discord</title><path d="M216.856 16.593c-14.282-10.258-30.153-16.13-46.99-17.583a.585.585 0 0 0-.585.498c-1.846 9.31-5.176 18.23-9.743 26.54-12.48-4.32-25.548-7.14-39.06-8.525-13.511-1.383-27.53-1.383-40.91.084-13.382 1.469-26.45 4.29-38.93 8.525-4.567-8.31-7.898-17.23-9.743-26.54a.585.585 0 0 0-.585-.498C51.54 0.463 35.668 6.335 21.386 16.593a.585.585 0 0 0-.214.772C10.18 40.59 2.123 71.04 0 107.24a.585.585 0 0 0 .195.543c16.32 13.924 33.45 22.84 50.81 29.5a.585.585 0 0 0 .668-.184c6.12-8.302 11.23-17.65 15.22-27.76a.585.585 0 0 0-.272-.692c-8.9-5.1-17.39-11.23-25.13-18.46a.585.585 0 0 1-.035-.856c2.89-3.235 5.56-6.685 7.97-10.32a.585.585 0 0 1 .632-.31c40.06 20.16 83.13 20.16 122.95 0a.585.585 0 0 1 .633.31c2.41 3.635 5.08 7.085 7.97 10.32a.585.585 0 0 1-.034.856c-7.74 7.23-16.23 13.36-25.13 18.46a.585.585 0 0 0-.273.692c3.99 10.11 9.1 19.458 15.22 27.76a.585.585 0 0 0 .668.184c17.36-6.66 34.49-15.576 50.81-29.5a.585.585 0 0 0 .195-.543C245.24 74.24 235.8 45.1 217.07.365a.585.585 0 0 0-.214-.772zM82.63 118.91c-9.52 0-17.23-9.5-17.23-21.2 0-11.71 7.71-21.2 17.23-21.2s17.23 9.49 17.23 21.2c.001 11.7-7.71 21.2-17.23 21.2zm82.74 0c-9.52 0-17.23-9.5-17.23-21.2 0-11.71 7.71-21.2 17.23-21.2s17.23 9.49 17.23 21.2c0 11.7-7.71 21.2-17.23 21.2z"/></svg>
)

const UserMenu = () => {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  return userProfile ? (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
           <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-xl">
                  <UserIcon className="h-6 w-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile.nickname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile.rank}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <UserIcon className="mr-2" />
          Perfil
        </DropdownMenuItem>
        {userProfile.role && ['admin', 'editor'].includes(userProfile.role) && (
            <DropdownMenuItem onClick={() => router.push('/admin')}>
                <ShieldCheck className="mr-2" />
                Panel de Admin
            </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2" />
          Salir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/login">
          <LogIn className="mr-2 h-5 w-5" />
          Login
        </Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Crear Cuenta</Link>
      </Button>
    </div>
  );
};

export default function Header() {
  const navLinks = (
    <>
      <NavLink href="/games">
        <Emoji symbol="🎮" label="Juegos" /> Todos los Juegos
      </NavLink>
      <NavLink href="/posts">
        <Emoji symbol="📜" label="Posts" /> Posts
      </NavLink>
      <NavLink href="/community">
        <Emoji symbol="💬" label="Comunidad" /> Comunidad
      </NavLink>
      <Button variant="ghost" asChild className="text-base font-semibold">
          <a href="https://discord.gg/cKZ7RKJ" target="_blank" rel="noopener noreferrer">
              <DiscordIcon />
              Únete a nuestro Discord
          </a>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-4 md:flex">
            {navLinks}
          </nav>
        </div>

        <div className="hidden items-center md:flex">
          <ThemeToggle />
          <UserMenu />
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-8 flex flex-col gap-4">
                {navLinks}
                <hr className="my-4 border-border" />
                 <div className="mt-6 flex items-center justify-between">
                    <UserMenu />
                    <ThemeToggle />
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
