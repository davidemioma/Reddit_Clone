import Editor from "@/components/Editor";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSubreddit } from "@/actions/getSubreddit";

export default async function SubmitPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const subreddit = await getSubreddit(slug);

  if (!subreddit) return notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-5 border-b border-gray-200">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>

          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in r/{params.slug}
          </p>
        </div>
      </div>

      <Editor slug={slug} subredditId={subreddit.id} />

      <div className="w-full flex justify-end">
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Post
        </Button>
      </div>
    </div>
  );
}
