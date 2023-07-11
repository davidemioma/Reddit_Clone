import prismadb from "@/libs/prismadb";
import { getSession } from "./getSession";

export const getSubscription = async (slug: string) => {
  try {
    const session = await getSession();

    if (!session?.user) return null;

    const subscription = await prismadb.subscription.findFirst({
      where: {
        subreddit: {
          name: slug,
        },
        userId: session.user?.id,
      },
    });

    return subscription;
  } catch (err) {
    return null;
  }
};
