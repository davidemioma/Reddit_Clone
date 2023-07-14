import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { formatTimeToNow } from "@/libs/utils";
import { getPostById } from "@/actions/getPostById";
import EditorOutput from "@/components/EditorOutput";
import PostVoteShell from "./components/PostVoteShell";
import CommentSection from "@/components/comments/CommentSection";
import UpvoteServer from "@/components/upvote/UpvoteServer";

//This is to prevent caching.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function PostPage({
  params,
}: {
  params: {
    postId: string;
  };
}) {
  const { postId } = params;

  let post = await getPostById(postId!);

  if (!post) return notFound();

  return (
    <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
      <Suspense fallback={<PostVoteShell />}>
        {/* @ts-expect-error server component */}
        <UpvoteServer
          postId={post?.id!}
          getData={async () => {
            return await getPostById(postId);
          }}
        />
      </Suspense>

      <div className="flex-1 w-full bg-white p-4 rounded-sm">
        <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
          Posted by u/{post?.author.username}{" "}
          {formatTimeToNow(new Date(post?.createdAt))}
        </p>

        <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
          {post?.title}
        </h1>

        {post.content && <EditorOutput content={post.content} />}

        <Suspense
          fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}
        >
          {/* @ts-expect-error server component */}
          <CommentSection postId={postId} />
        </Suspense>
      </div>
    </div>
  );
}
