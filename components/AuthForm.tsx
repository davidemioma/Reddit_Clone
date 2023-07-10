"use client";

import React, { useState } from "react";
import { cn } from "@/libs/utils";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const AuthForm = ({ className, ...props }: Props) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    setLoading(true);

    try {
      await signIn("google");
    } catch (err) {
      toast({
        title: "Something went wrong.",
        description: "There was an error logging in with Google.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(`flex justify-center`, className)} {...props}>
      <Button
        className="w-full"
        size="sm"
        isLoading={loading}
        onClick={loginWithGoogle}
      >
        {loading ? null : <FcGoogle size={25} className="mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default AuthForm;
