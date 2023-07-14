"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

const getPath = (pathname: string) => {
  const splitPath = pathname.split("/");

  if (splitPath.length === 3) {
    return "/";
  } else if (splitPath.length > 3) {
    return `/${splitPath[1]}/${splitPath[2]}`;
  } else {
    return "/";
  }
};

const ToFeedBtn = () => {
  const pathname = usePathname();

  const subredditPath = getPath(pathname);

  return (
    <Link href={subredditPath} className={buttonVariants({ variant: "ghost" })}>
      <ChevronLeft className="h-4 w-4 mr-1" />

      {subredditPath === "/" ? "Back home" : "Back to community"}
    </Link>
  );
};

export default ToFeedBtn;
