import Link from "next/link";
import { ShieldAlert } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <ShieldAlert className="h-7 w-7 text-primary" />
      <h1 className="font-headline text-xl font-bold tracking-tighter sm:text-2xl">
        Pay2Meter
      </h1>
    </Link>
  );
};

export default Logo;
