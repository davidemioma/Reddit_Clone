"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SubscribeToSubredditPayload } from "@/libs/validator/subreddit";
import { useCustomToasts } from "@/hooks/use-custom-toast";

interface Props {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
}

const SubsToggleBtn = ({ isSubscribed, subredditId, subredditName }: Props) => {
  const router = useRouter();

  const { loginToast } = useCustomToasts();

  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    setLoading(true);

    try {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      await axios.post("/api/subreddit/subscribe", payload);

      router.refresh();

      toast({
        title: "Subscribed!",
        description: `You are now subscribed to r/${subredditName}`,
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }

        if (err.response?.status === 422) {
          toast({
            title: "Something went wrong.",
            description: "Invalid subreddit id.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);

    try {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      await axios.post("/api/subreddit/unsubscribe", payload);

      router.refresh();

      toast({
        title: "Unsubscribed!",
        description: `You are now unsubscribed from/${subredditName}`,
      });
    } catch (err: any) {
      toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={loading}
      onClick={unsubscribe}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={loading}
      onClick={subscribe}
    >
      Join to post
    </Button>
  );
};

export default SubsToggleBtn;
