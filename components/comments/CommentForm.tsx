"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CommentRequest } from "@/libs/validator/comment";
import { useCustomToasts } from "@/hooks/use-custom-toast";

interface Props {
  postId: string;
  replyToId?: string;
}

const CommentForm = ({ postId, replyToId }: Props) => {
  const router = useRouter();

  const [input, setInput] = useState("");

  const { loginToast } = useCustomToasts();

  const [loading, setLoading] = useState(false);

  const postComment = async () => {
    setLoading(true);

    try {
      const payload: CommentRequest = { postId, text: input, replyToId };

      await axios.patch("/api/subreddit/post/comment", payload);

      setInput("");

      router.refresh();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Label htmlFor="comment">Your comment</Label>

      <Textarea
        id="comment"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={1}
        placeholder="What are your thoughts?"
      />

      <div className="mt-2 flex justify-end">
        <Button
          isLoading={loading}
          disabled={!input.trim() || loading}
          onClick={postComment}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
