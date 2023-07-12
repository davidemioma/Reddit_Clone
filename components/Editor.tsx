"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { uploadFiles } from "@/libs/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";

import { PostCreationRequest, PostValidator } from "@/libs/validator/post";

type FormData = z.infer<typeof PostValidator>;

interface Props {
  slug: string;
  subredditId: string;
}

const Editor = ({ slug, subredditId }: Props) => {
  const router = useRouter();

  const ref = useRef<EditorJS>();

  const [loading, setLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const _titleRef = useRef<HTMLTextAreaElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });

  const { ref: titleRef, ...rest } = register("title");

  //Editor js setup
  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor", //div Id where the editor is mounted.
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] }, //This means the data is empty by default.
        //This is basically all the tools you need in the editor.
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // upload to uploadthing
                  const [res] = await uploadFiles({
                    endpoint: "imageUploader",
                    files: [file],
                  });

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const blocks = await ref.current?.save();

      const payload: PostCreationRequest = {
        title: data.title,
        content: blocks,
        subredditId,
      };

      await axios.post("/api/subreddit/post/create", payload);

      router.push(`/r/${slug}`);

      router.refresh();

      toast({
        description: "Your post has been published.",
      });
    } catch (err) {
      toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-zinc-50 w-full p-4 rounded-lg border border-zinc-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="subreddit-post-form"
        className="w-fit"
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            className="bg-transparent w-full resize-none appearance-none text-5xl font-bold focus:outline-none overflow-hidden"
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            placeholder="Title"
            disabled={loading}
            {...rest}
          />

          <div id="editor" className="w-full min-h-[500px]" />

          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Editor;
