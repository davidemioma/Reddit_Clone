"use client";

import React, { useState } from "react";
import { z } from "zod";
import { cn } from "@/libs/utils";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsernameValidator } from "@/libs/validator/username";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "username">;
}

type FormData = z.infer<typeof UsernameValidator>;

const UsernameForm = ({ user, className, ...props }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(false);

    try {
      const payload: FormData = {
        name: values.name,
      };

      await axios.patch("/api/account", payload);

      toast({
        description: "Your username has been updated.",
      });

      router.refresh();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username already taken.",
            description: "Please choose another username.",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your username was not updated. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>

          <CardDescription>
            Please enter a display name you are comfortable with.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 grid place-items-center w-8 h-10 ">
              <span className="text-sm text-zinc-400">u/</span>
            </div>

            <Label className="sr-only" htmlFor="name">
              Name
            </Label>

            <Input
              className="w-[400px] pl-6"
              id="name"
              size={32}
              {...register("name")}
            />

            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" isLoading={loading} disabled={loading}>
            Change name
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UsernameForm;
