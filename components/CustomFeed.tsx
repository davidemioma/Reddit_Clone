import React from "react";
import Feed from "./Feed";
import { ExtendedPost } from "@/types/db";

interface Props {
  posts: ExtendedPost[];
}

const CustomFeed = ({ posts }: Props) => {
  return <Feed initialPosts={posts} />;
};

export default CustomFeed;
