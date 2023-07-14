import React from "react";
import UpvoteClient from "./UpvoteClient";
import { notFound } from "next/navigation";
import { getSession } from "@/actions/getSession";
import { VoteType, Post, Vote } from "@prisma/client";

interface Props {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const UpvoteServer = async ({
  postId,
  initialVote,
  initialVotesAmt,
  getData,
}: Props) => {
  const session = await getSession();

  let _votesAmt: number = 0;

  let _currentVote: VoteType | null = null;

  if (getData) {
    const post = await getData();

    if (!post) return notFound();

    _currentVote = post.votes.find((vote) => vote.userId === session?.user?.id)
      ?.type!;

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;

      if (vote.type === "DOWN") return acc - 1;

      return acc;
    }, 0);
  } else {
    _currentVote = initialVote!;

    _votesAmt = initialVotesAmt!;
  }

  return (
    <UpvoteClient
      postId={postId}
      initialVote={_currentVote}
      initialVoteAmount={_votesAmt}
    />
  );
};

export default UpvoteServer;
