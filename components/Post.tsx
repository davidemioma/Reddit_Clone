"use client";

import React, { useRef } from "react";
import Link from "next/link";
import EditorOutput from "./EditorOutput";
import { MessageSquare } from "lucide-react";
import { formatTimeToNow } from "@/libs/utils";
import { Post, User, Vote } from "@prisma/client";
import UpvoteClient from "./upvote/UpvoteClient";

type PartialVote = Pick<Vote, "type">;

interface Props {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmount: number;
  subredditName: string;
  currentVote?: PartialVote;
  commentAmt: number;
}

const Post = ({
  post,
  votesAmount,
  subredditName,
  currentVote,
  commentAmt,
}: Props) => {
  const pRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="bg-white rounded-md shadow">
      <div className="flex justify-between py-4 px-6">
        <UpvoteClient
          postId={post.id}
          initialVote={currentVote?.type!}
          initialVoteAmount={votesAmount}
        />

        <div className="flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName && (
              <>
                <Link
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </Link>

                <span className="px-1">•</span>
              </>
            )}
            <span>Posted by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <Link href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </Link>

          <div
            className="relative w-full max-h-40 text-sm overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />

            {pRef?.current?.clientHeight === 160 && (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-4 sm:px-6 text-sm">
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
