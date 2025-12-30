
"use client";

import Link from "next/link";
import { LogIn, LogOut, Menu, ShieldCheck, User as UserIcon } from "lucide-react";
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

const NAV_ITEMS = [
  { href: "/games", label: "Todos los Juegos", emoji: { symbol: "🎮", label: "Juegos" } },
  { href: "/posts", label: "Posts", emoji: { symbol: "📜", label: "Posts" } },
  { href: "/community", label: "Comunidad", emoji: { symbol: "💬", label: "Comunidad" } },
];

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Button variant="ghost" asChild>
    <Link href={href} className="text-base font-semibold">
      {children}
    </Link>
  </Button>
);

const DiscordIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 fill-current"
  >
    <title>Discord</title>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8852-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4463.8163-.6675 1.2784a18.6368 18.6368 0 00-9.3244 0c-.2212-.4621-.4565-.9031-.6675-1.2784a.077.077 0 00-.0785-.037.0185.0185 0 00-.0093.0074 19.7913 19.7913 0 00-4.8852 1.5152.0699.0699 0 00-.0327.0278C.7324 9.4827-1.1235 15.2742.7324 20.294a.0823.0823 0 00.0467.0371c2.4273.8163 4.5621 1.1699 6.2488 1.0347a.077.077 0 00.0699-.0278c.4463-.6398.8163-1.3265 1.1235-2.0221a.0741.0741 0 00-.0467-.1112c-1.6822-.4621-3.0803-1.025-4.0416-1.6124a.077.077 0 01-.0185-.1112c.0278-.0278.0556-.0648.0834-.0926a.0741.0741 0 01.0785-.0093c4.5621 2.2487 9.9402 2.2487 14.5023 0a.0741.0741 0 01.0785.0093c.0278.0278.0648.0556.0926.0834a.077.077 0 01-.0185.1112c-.9521.5873-2.3502 1.1495-4.0416 1.6124a.0741.0741 0 00-.0467.1112c.3164.7048.6864 1.3827 1.1235 2.0221a.077.077 0 00.0699.0278c1.6866.1352 3.8214-.2184 6.2488-1.0347a.0823.0823 0 00.0467-.0371c1.8651-5.0198-.0093-10.8113-3.4687-15.9242a.0654.0654 0 00-.0327-.0278zM8.0203 15.6234c-1.1852 0-2.1557-1.0827-2.1557-2.4182s.9705-2.4182 2.1557-2.4182c1.1944 0 2.1649 1.0827 2.1557 2.4182s-.9613 2.4182-2.1557 2.4182zm7.9705 0c-1.1852 0-2.1557-1.0827-2.1557-2.4182s.9705-2.4182 2.1557-2.4182c1.1944 0 2.1649 1.0827 2.1557 2.4182s-.9613 2.4182-2.1557 2.4182z" />
  </svg>
);

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
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} href={item.href}>
          <Emoji symbol={item.emoji.symbol} label={item.emoji.label} /> {item.label}
        </NavLink>
      ))}
      <Button variant="ghost" asChild className="text-base font-semibold">
        <a href="https://discord.gg/cKZ7RKJ" target="_blank" rel="noopener noreferrer">
          <DiscordIcon />
          <span className="ml-2">Únete a nuestro Discord</span>
        </a>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-4 md:flex" aria-label="Navegación principal">
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
              <Button variant="ghost" size="icon" aria-label="Abrir menú de navegación">
                <span className="sr-only">Abrir menú</span>
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

    
