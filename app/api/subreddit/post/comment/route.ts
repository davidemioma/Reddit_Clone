import { ZodError } from "zod";
import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getSession } from "@/actions/getSession";
import { CommentValidator } from "@/libs/validator/comment";

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    await prismadb.comment.create({
      data: {
        postId,
        text,
        replyToId,
        authorId: session.user?.id,
      },
    });

    return NextResponse.json("Comment created");
  } catch (err) {
    if (err instanceof ZodError) {
      return new NextResponse("Invalid data", { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
