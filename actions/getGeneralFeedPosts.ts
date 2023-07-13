import prismadb from "@/libs/prismadb";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

export const getGeneralFeedPosts = async () => {
  try {
    const posts = await prismadb.post.findMany({
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
