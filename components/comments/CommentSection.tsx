import React from "react";
import { getSession } from "@/actions/getSession";
import { getTopComments } from "@/actions/getTopComments";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

interface Props {
  postId: string;
}

const CommentSection = async ({ postId }: Props) => {
  const session = await getSession();

  const comments = await getTopComments(postId);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CommentForm postId={postId} />

      <div className="flex flex-col gap-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((comment) => {
            const topLevelCommentVoteCount = comment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;

                if (vote.type === "DOWN") return acc - 1;

                return acc;
              },
              0
            );

            const toplevelCommentVote = comment.votes.find(
              (vote) => vote.userId === session?.user?.id
            );

            return (
              <div key={comment.id} className="flex flex-col gap-2">
                <Comment
                  postId={postId}
                  comment={comment}
                  currentVote={toplevelCommentVote}
                  votesCount={topLevelCommentVoteCount}
                />

                {comment.replies.map((reply) => {
                  const replyVoteCount = reply.votes.reduce((acc, vote) => {
                    if (vote.type === "UP") return acc + 1;

                    if (vote.type === "DOWN") return acc - 1;

                    return acc;
                  }, 0);

                  const replyVote = reply.votes.find(
                    (vote) => vote.userId === session?.user?.id
                  );

                  return (
                    <div
                      key={reply.id}
                      className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                    >
                      <Comment
                        postId={postId}
                        comment={reply}
                        currentVote={replyVote}
                        votesCount={replyVoteCount}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
