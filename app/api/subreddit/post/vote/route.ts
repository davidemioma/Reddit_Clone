import { ZodError } from "zod";
import { redis } from "@/libs/redis";
import prismadb from "@/libs/prismadb";
import { CachedPost } from "@/types/redis";
import { NextResponse } from "next/server";
import { getSession } from "@/actions/getSession";
import { PostVoteValidator } from "@/libs/validator/vote";
import { Post, User, Vote, VoteType } from "@prisma/client";

const CACHE_AFTER_UPVOTE = 1;

const cachePost = async (
  postId: string,
  post: Post & {
    author: User;
    votes: Vote[];
  },
  voteType: VoteType
) => {
  const voteCount = post.votes.reduce((acc, vote) => {
    if (vote.type === "UP") return acc + 1;

    if (vote.type === "DOWN") return acc - 1;

    return acc;
  }, 0);

  if (voteCount >= CACHE_AFTER_UPVOTE) {
    const cachedPost: CachedPost = {
      id: post.id,
      title: post.title,
      authorUsername: post.author.username || "",
      content: JSON.stringify(post.content),
      currentVote: voteType,
      createdAt: post.createdAt,
    };

    await redis.hset(`post:${postId}`, cachedPost);
  }
};

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { postId, voteType } = PostVoteValidator.parse(body);

    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new NextResponse("Post does not exists.", { status: 404 });
    }

    const existingVote = await prismadb.vote.findFirst({
      where: {
        postId,
        userId: session.user?.id,
      },
    });

    if (existingVote) {
      if (voteType === existingVote.type) {
        await prismadb.vote.delete({
          where: {
            userId_postId: {
              userId: session.user?.id,
              postId,
            },
          },
        });

        cachePost(postId, post, voteType);

        return NextResponse.json("Vote deleted");
      } else {
        await prismadb.vote.update({
          where: {
            userId_postId: {
              userId: session.user?.id,
              postId,
            },
          },
          data: {
            type: voteType,
          },
        });

        cachePost(postId, post, voteType);

        return NextResponse.json("Vote changed");
      }
    } else {
      await prismadb.vote.create({
        data: {
          postId,
          userId: session.user?.id,
          type: voteType,
        },
      });

      cachePost(postId, post, voteType);

      return NextResponse.json("Vote created");
    }
  } catch (err) {
    if (err instanceof ZodError) {
      return new NextResponse("Invalid data", { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
