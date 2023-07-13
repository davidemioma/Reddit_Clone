import React from "react";
import Feed from "./Feed";
import { ExtendedPost } from "@/types/db";

interface Props {
  posts: ExtendedPost[];
}

const GeneralFeed = ({ posts }: Props) => {
  return <Feed initialPosts={posts} />;
};

export default GeneralFeed;
