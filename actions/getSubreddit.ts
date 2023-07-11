import prismadb from "@/libs/prismadb";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

export const getSubreddit = async (slug: string) => {
  try {
    if (!slug) return null;

    const subreddit = await prismadb.subreddit.findFirst({
      where: {
        name: slug,
      },
      include: {
        posts: {
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
        },
      },
    });

    return subreddit;
  } catch (err) {
    return null;
  }
};
