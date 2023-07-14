"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/libs/utils";
import { Button } from "../ui/button";
import { VoteType } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { usePrevious } from "@mantine/hooks";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useCustomToasts } from "@/hooks/use-custom-toast";
import { CommentVoteRequest } from "@/libs/validator/vote";

interface Props {
  commentId: string;
  votesCount: number;
  voteType?: VoteType | null;
}

const CommentVote = ({ commentId, votesCount, voteType }: Props) => {
  const { loginToast } = useCustomToasts();

  const [loading, setLoading] = useState(false);

  const [currentVoteType, setCurrentVoteType] = useState(voteType);

  const [currentVoteCount, setCurrentVoteCount] = useState(votesCount);

  const prevVoteType = usePrevious(currentVoteType);

  useEffect(() => {
    setCurrentVoteType(voteType);

    setCurrentVoteCount(votesCount);
  }, [voteType, votesCount]);

  const vote = async (voteType: VoteType) => {
    setLoading(true);

    try {
      const payload: CommentVoteRequest = {
        voteType,
        commentId,
      };

      await axios.patch("/api/subreddit/comment/vote", payload);

      if (currentVoteType === voteType) {
        setCurrentVoteType(null);

        if (voteType === "UP") {
          setCurrentVoteCount((prev) => prev - 1);
        } else {
          setCurrentVoteCount((prev) => prev + 1);
        }
      } else {
        setCurrentVoteType(voteType);

        if (voteType === "UP") {
          setCurrentVoteCount((prev) => prev + (currentVoteType ? 2 : 1));
        } else {
          setCurrentVoteCount((prev) => prev - (currentVoteType ? 2 : 1));
        }
      }
    } catch (err) {
      if (voteType === "UP") {
        setCurrentVoteCount((prev) => prev - 1);
      } else {
        setCurrentVoteCount((prev) => prev + 1);
      }

      setCurrentVoteType(prevVoteType);

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
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        isLoading={loading}
        disabled={loading}
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVoteType === "UP",
          })}
        />
      </Button>

      <p className="text-center py-2 px-1 font-medium text-xs text-zinc-900">
        {currentVoteCount}
      </p>

      <Button
        className={cn({
          "text-emerald-500": currentVoteType === "DOWN",
        })}
        size="sm"
        variant="ghost"
        aria-label="downvote"
        isLoading={loading}
        disabled={loading}
        onClick={() => vote("DOWN")}
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVoteType === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVote;
