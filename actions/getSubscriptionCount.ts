import prismadb from "@/libs/prismadb";

export const getSubscriptionCount = async (slug: string) => {
  try {
    const memberCount = await prismadb.subscription.count({
      where: {
        subreddit: {
          name: slug,
        },
      },
    });

    return memberCount;
  } catch (err) {
    return 0;
  }
};
