import { ZodError } from "zod";
import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getSession } from "@/actions/getSession";
import { SubredditValidator } from "@/libs/validator/subreddit";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { name } = SubredditValidator.parse(body);

    const subredditExists = await prismadb.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return new NextResponse("Subreddit already exists", { status: 409 });
    }

    const subreddit = await prismadb.subreddit.create({
      data: {
        name,
        creatorId: session.user?.id,
      },
    });

    await prismadb.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    return NextResponse.json(subreddit.name);
  } catch (err) {
    if (err instanceof ZodError) {
      return new NextResponse("Invalid subreddit name", { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
