import { ZodError } from "zod";
import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getSession } from "@/actions/getSession";
import { SubredditSubscriptionValidator } from "@/libs/validator/subreddit";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExists = await prismadb.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user?.id,
      },
    });

    if (!subscriptionExists) {
      return new NextResponse("You are not subscribed to this subreddit", {
        status: 400,
      });
    }

    //Check if current user created the subreddit
    const subreddit = await prismadb.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (subreddit) {
      return new NextResponse(
        "You can not unsubscribed from your own subreddit",
        {
          status: 400,
        }
      );
    }

    await prismadb.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user?.id,
        },
      },
    });

    return NextResponse.json("Unsubscribed Successfully");
  } catch (err) {
    if (err instanceof ZodError) {
      return new NextResponse("Invalid subreddit id", { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
