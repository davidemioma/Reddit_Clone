"use client";

import React from "react";
import { Input } from "./ui/input";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import UserAvatar from "./UserAvatar";
import { useRouter, usePathname } from "next/navigation";
import { Image as ImageIcon, Link2 } from "lucide-react";

interface Props {
  session: Session | null;
}

const MiniCreatePosts = ({ session }: Props) => {
  const router = useRouter();

  const pathname = usePathname();

  return (
    <div className="bg-white py-4 px-6 shadow rounded-md overflow-hidden">
      <div className="flex justify-between gap-3 sm:gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full outline outline-2 outline-white" />
        </div>

        <Input
          className="flex-1"
          readOnly
          placeholder="Create post"
          onClick={() => router.push(`${pathname}/submit`)}
        />

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => router.push(`${pathname}/submit`)}
          >
            <ImageIcon className="text-zinc-600" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => router.push(`${pathname}/submit`)}
          >
            <Link2 className="text-zinc-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MiniCreatePosts;
