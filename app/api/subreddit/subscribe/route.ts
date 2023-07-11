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

    if (subscriptionExists) {
      return new NextResponse("You are already subscribed", { status: 400 });
    }

    await prismadb.subscription.create({
      data: {
        subredditId,
        userId: session.user?.id,
      },
    });

    return NextResponse.json("Subscribed Successfully");
  } catch (err) {
    if (err instanceof ZodError) {
      return new NextResponse("Invalid subreddit id", { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
