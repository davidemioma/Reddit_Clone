"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";
import { Textarea } from "../ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { formatTimeToNow } from "@/libs/utils";
import CommentVoteComponent from "./CommentVote";
import { CommentRequest } from "@/libs/validator/comment";
import { User, CommentVote, Comment } from "@prisma/client";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface Props {
  postId: string;
  comment: ExtendedComment;
  votesCount: number;
  currentVote: CommentVote | undefined;
}

const Comment = ({ postId, comment, votesCount, currentVote }: Props) => {
  const router = useRouter();

  const { data: session } = useSession();

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const commentRef = useRef<HTMLDivElement>(null);

  const [isReplying, setIsReplying] = useState(false);

  useOnClickOutside(commentRef, () => {
    setIsReplying(false);
  });

  const replyBtnHandler = () => {
    if (!session) return router.push("/sign-in");

    setIsReplying((prev) => !prev);
  };

  const replyHandler = async ({ postId, replyToId, text }: CommentRequest) => {
    setLoading(true);

    try {
      const payload: CommentRequest = { postId, replyToId, text };

      await axios.patch("/api/subreddit/post/comment", payload);
    } catch (err) {
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
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center gap-2">
        <UserAvatar className="h-6 w-6" user={comment.author} />

        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>

          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex items-center gap-2">
        <CommentVoteComponent
          commentId={comment.id}
          voteType={currentVote?.type}
          votesCount={votesCount}
        />

        <Button size="sm" variant="ghost" onClick={replyBtnHandler}>
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>
      </div>

      {isReplying && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="comment">Your comment</Label>

          <Textarea
            id="comment"
            rows={1}
            value={input}
            autoFocus
            placeholder="What are your thoughts?"
            onChange={(e) => setInput(e.target.value)}
            onFocus={(e) =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              )
            }
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>

            <Button
              isLoading={loading}
              disabled={!input.trim() || loading}
              onClick={() =>
                replyHandler({
                  postId,
                  text: input,
                  replyToId: comment.replyToId ?? comment.id,
                })
              }
            >
              Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
