"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/libs/utils";
import { Button } from "../ui/button";
import { VoteType } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { usePrevious } from "@mantine/hooks";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useCustomToasts } from "@/hooks/use-custom-toast";
import { PostVoteRequest } from "@/libs/validator/vote";

interface Props {
  postId: string;
  initialVote: VoteType | null;
  initialVoteAmount: number;
}

const UpvoteClient = ({ postId, initialVote, initialVoteAmount }: Props) => {
  const { loginToast } = useCustomToasts();

  const [currentVote, setCurrentVote] = useState(initialVote);

  const [voteCount, setVoteCount] = useState(initialVoteAmount);

  const [loading, setLoading] = useState(false);

  const previousVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);

    setVoteCount(initialVoteAmount);
  }, [initialVote, initialVoteAmount]);

  const vote = async (voteType: VoteType) => {
    setLoading(true);

    try {
      const payload: PostVoteRequest = {
        voteType,
        postId,
      };

      await axios.patch("/api/subreddit/post/vote", payload);

      if (currentVote === voteType) {
        setCurrentVote(null);

        if (voteType === "UP") {
          setVoteCount((prev) => prev - 1);
        } else {
          setVoteCount((prev) => prev + 1);
        }
      } else {
        setCurrentVote(voteType);

        if (voteType === "UP") {
          setVoteCount((prev) => prev + (currentVote ? 2 : 1));
        } else {
          setVoteCount((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    } catch (err) {
      if (voteType === "UP") {
        setVoteCount((prev) => prev - 1);
      } else {
        setVoteCount((prev) => prev + 1);
      }

      setCurrentVote(previousVote!);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your vote was not registered. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        disabled={loading}
        isLoading={loading}
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {voteCount}
      </p>

      <Button
        className={cn({
          "text-emerald-500": currentVote === "DOWN",
        })}
        size="sm"
        variant="ghost"
        aria-label="downvote"
        disabled={loading}
        isLoading={loading}
        onClick={() => vote("DOWN")}
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default UpvoteClient;
