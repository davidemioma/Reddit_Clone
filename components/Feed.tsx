"use client";

import React, { useRef } from "react";
import axios from "axios";
import Post from "./Post";
import { ExtendedPost } from "@/types/db";
import { useSession } from "next-auth/react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

interface Props {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const Feed = ({ initialPosts, subredditName }: Props) => {
  const { data: session } = useSession();

  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "");

      const { data } = await axios.get(query);

      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  const posts = data?.pages?.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, i) => {
        const votesAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;

          if (vote.type === "DOWN") return acc - 1;

          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user?.id
        );

        if (i === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                votesAmount={votesAmount}
                subredditName={post.subreddit.name}
                currentVote={currentVote}
                commentAmt={post.comments.length}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              votesAmount={votesAmount}
              subredditName={post.subreddit.name}
              currentVote={currentVote}
              commentAmt={post.comments.length}
            />
          );
        }
      })}
    </ul>
  );
};

export default Feed;
