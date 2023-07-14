import prismadb from "@/libs/prismadb";

export const getTopComments = async (postId: string) => {
  try {
    if (!postId) return [];

    const comments = await prismadb.comment.findMany({
      where: {
        postId,
        replyTo: null,
      },
      include: {
        author: true,
        votes: true,
        replies: {
          include: {
            author: true,
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (err) {
    return [];
  }
};
