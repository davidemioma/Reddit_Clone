"use client";

import React from "react";
import dynamic from "next/dynamic";
import CustomCodeRenderer from "./renderers/CustomCodeRenderer";
import CustomImageRenderer from "./renderers/CustomImageRenderer";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

interface Props {
  content: any;
}

const EditorOutput = ({ content }: Props) => {
  return (
    <Output
      className="text-sm"
      data={content}
      style={{
        paragraph: {
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        },
      }}
      renderers={{
        image: CustomImageRenderer,
        code: CustomCodeRenderer,
      }}
    />
  );
};

export default EditorOutput;
