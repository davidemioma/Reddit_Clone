import { ZodError } from "zod";
import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getSession } from "@/actions/getSession";
import { CommentVoteValidator } from "@/libs/validator/vote";

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const comment = await prismadb.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return new NextResponse("Comment does not exists.", { status: 404 });
    }

    const existingVote = await prismadb.commentVote.findFirst({
      where: {
        commentId,
        userId: session.user?.id,
      },
    });

    if (existingVote) {
      if (voteType === existingVote.type) {
        await prismadb.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user?.id,
              commentId,
            },
          },
        });

        return NextResponse.json("Vote deleted");
      } else {
        await prismadb.commentVote.update({
          where: {
            userId_commentId: {
              userId: session.user?.id,
              commentId,
            },
          },
          data: {
            type: voteType,
          },
        });

        return NextResponse.json("Vote changed");
      }
    } else {
      await prismadb.commentVote.create({
        data: {
          commentId,
          userId: session.user?.id,
          type: voteType,
        },
      });

      return NextResponse.json("Vote created");
    }
  } catch (err) {
    if (err instanceof ZodError) {
      return new NextResponse("Invalid data", { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
