"use client";

import React from "react";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const CloseModalBtn = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}>
      <XIcon className="w-6 h-6" />
    </button>
  );
};

export default CloseModalBtn;
