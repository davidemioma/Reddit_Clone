import React from "react";
import Image from "next/image";
import { User } from "next-auth";
import { User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarProps } from "@radix-ui/react-avatar";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar = ({ user, ...props }: Props) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative w-full h-full overflow-hidden">
          <Image
            className="object-cover"
            src={user.image}
            fill
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>

          <UserIcon className="w-4 h-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
