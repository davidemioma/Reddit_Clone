"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomToasts } from "@/hooks/use-custom-toast";
import { CreateSubredditPayload } from "@/libs/validator/subreddit";

export default function Create() {
  const router = useRouter();

  const [input, setInput] = useState("");

  const { loginToast } = useCustomToasts();

  const [loading, setLoading] = useState(false);

  const createCommunity = async () => {
    setLoading(true);

    try {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const res = await axios.post("/api/subreddit", payload);

      router.push(`/r/${res.data}`);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast({
            title: "Subreddit already exists.",
            description: "Please choose a different name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          toast({
            title: "Invalid subreddit name.",
            description: "Please choose a name between 3 and 21 letters.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "Something went wrong.",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <h1 className="text-xl font-semibold">Create a Community</h1>

        <hr className="bg-zinc-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>

          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>

          <div className="relative">
            <p className="absolute left-0 inset-y-0 grid place-items-center w-8 text-sm text-zinc-400">
              r/
            </p>

            <Input
              className="pl-8"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={createCommunity}
            isLoading={loading}
            disabled={!input.trim()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
}
