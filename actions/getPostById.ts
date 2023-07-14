import prismadb from "@/libs/prismadb";

export const getPostById = async (postId: string) => {
  try {
    if (!postId) return null;

    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    return post;
  } catch (err) {
    return null;
  }
};
