import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ToFeedBtn from "@/components/ToFeedBtn";
import { getSession } from "@/actions/getSession";
import { getSubreddit } from "@/actions/getSubreddit";
import SubsToggleBtn from "@/components/SubsToggleBtn";
import { buttonVariants } from "@/components/ui/button";
import { getSubscription } from "@/actions/getSubscription";
import { getSubscriptionCount } from "@/actions/getSubscriptionCount";

export default async function Layout({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getSession();

  const subreddit = await getSubreddit(slug);

  const subscription = await getSubscription(slug);

  const memberCount = await getSubscriptionCount(slug);

  const isSubscribed = !!subscription;

  if (!subreddit) return notFound();

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <ToFeedBtn />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          <div className="flex flex-col col-span-2 gap-6">{children}</div>

          <div className="h-fit order-first md:order-last rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About r/{subreddit?.name}</p>
            </div>

            <dl className="bg-white px-6 py-4 text-sm leading-6 divide-y divide-gray-100">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>

                <dd className="text-gray-700">
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>

                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>

              {subreddit.creatorId === session?.user.id && (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">You created this community</dt>
                </div>
              )}

              {subreddit.creatorId !== session?.user.id && (
                <SubsToggleBtn
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              )}

              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full mb-6 outline",
                })}
                href={`/r/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
