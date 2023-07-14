import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { getSession } from "@/actions/getSession";
import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import { buttonVariants } from "@/components/ui/button";
import { getCustomFeedPosts } from "@/actions/getCustomFeedPosts";
import { getGeneralFeedPosts } from "@/actions/getGeneralFeedPosts";

export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getSession();

  const customFeedPosts = await getCustomFeedPosts();

  const generalFeedPosts = await getGeneralFeedPosts();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {session ? (
          <CustomFeed posts={customFeedPosts} />
        ) : (
          <GeneralFeed posts={generalFeedPosts} />
        )}

        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <HomeIcon className="w-4 h-4" />
              Home
            </p>
          </div>

          <div className="divide-y divide-gray-100 px-6 py-1.5 text-sm leading-6">
            <p className="text-zinc-500">
              Your personal Breadit frontpage. Come here to check in with your
              favorite communities.
            </p>

            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
              })}
              href="/r/create"
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
