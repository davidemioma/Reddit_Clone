import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getSession } from "@/actions/getSession";
import { PostValidator } from "@/libs/validator/post";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { title, content, subredditId } = PostValidator.parse(body);

    const subscriptionExist = await prismadb.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user?.id,
      },
    });

    if (!subscriptionExist) {
      return new NextResponse("You need to subscribe to post", { status: 400 });
    }

    await prismadb.post.create({
      data: {
        title,
        content,
        subredditId,
        authorId: session.user?.id,
      },
    });

    return NextResponse.json("Post created");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
