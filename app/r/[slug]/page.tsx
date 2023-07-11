import { notFound } from "next/navigation";
import { getSession } from "@/actions/getSession";
import { getSubreddit } from "@/actions/getSubreddit";
import MiniCreatePosts from "@/components/MiniCreatePosts";

export default async function SubredditPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = params;

  const session = await getSession();

  const subreddit = await getSubreddit(slug);

  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="h-14 text-3xl md:text-4xl font-bold">
        r/{subreddit.name}
      </h1>

      <MiniCreatePosts session={session} />

      {/* Post Feed */}
    </>
  );
}
