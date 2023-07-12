"use client";

import Image from "next/image";

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image className="object-contain" src={src} fill alt="image" />
    </div>
  );
};

export default CustomImageRenderer;
