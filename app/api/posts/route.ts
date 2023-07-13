import { z } from "zod";
import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getSession } from "@/actions/getSession";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const session = await getSession();

    let followedCommunitiesIds: string[] = [];

    if (session?.user) {
      const followedCommunities = await prismadb.subscription.findMany({
        where: {
          userId: session.user?.id,
        },
        include: {
          subreddit: true,
        },
      });

      followedCommunitiesIds = followedCommunities.map(
        (community) => community.subreddit.id
      );
    }

    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        subredditName: url.searchParams.get("subredditName"),
      });

    let query = {};

    if (subredditName) {
      query = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (session) {
      query = {
        subreddit: {
          id: {
            in: [...followedCommunitiesIds],
          },
        },
      };
    }

    const posts = await prismadb.post.findMany({
      where: query,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
    });

    return NextResponse.json(posts);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
