import prismadb from "@/libs/prismadb";
import { getSession } from "next-auth/react";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

export const getCustomFeedPosts = async () => {
  try {
    const session = await getSession();

    if (!session) return [];

    const followedCommunities = await prismadb.subscription.findMany({
      where: {
        userId: session?.user?.id,
      },
      include: {
        subreddit: true,
      },
    });

    const posts = await prismadb.post.findMany({
      where: {
        subreddit: {
          name: {
            in: followedCommunities.map((sub) => sub.subreddit.name),
          },
        },
      },
      include: {
        author: true,
        votes: true,
        comments: true,
        subreddit: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });

    return posts;
  } catch (err) {
    return [];
  }
};
