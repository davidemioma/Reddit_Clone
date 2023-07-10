import React from "react";
import Link from "next/link";
import Image from "next/image";
import UserAccount from "./UserAccount";
import { buttonVariants } from "./ui/button";
import { getSession } from "@/actions/getSession";

const Navbar = async () => {
  const session = await getSession();

  return (
    <nav className="fixed top-0 inset-x-0 h-fit z-10 bg-zinc-100 py-2 border-b border-zinc-300">
      <div className="container max-w-7xl mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 overflow-hidden">
            <Image
              className="object-cover"
              src="/assets/icon.png"
              fill
              alt="Logo"
            />
          </div>

          <p className="hidden md:block text-sm text-zinc-700 font-medium">
            Reddit
          </p>
        </Link>

        {session?.user ? (
          <UserAccount user={session?.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
