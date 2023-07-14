"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import useDebounce from "@/hooks/use-debounce";
import { usePathname, useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Searchbar = () => {
  const router = useRouter();

  const pathname = usePathname();

  const [input, setInput] = useState("");

  const { loading, results } = useDebounce(input);

  useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command className="relative z-50 max-w-lg rounded-lg border overflow-visible">
      <CommandInput
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        value={input}
        disabled={loading}
        autoFocus
        placeholder="Search communities..."
        onValueChange={(text) => {
          setInput(text);
        }}
      />

      {input.trim().length > 0 && (
        <CommandList className="absolute inset-x-0 bg-white top-full shadow rounded-b-md">
          {results.length > 0 ? (
            <CommandGroup heading="Communities">
              {results.map((subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}
                  onSelect={(e) => {
                    router.push(`/r/${e}`);

                    router.refresh();
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />

                  <Link className="underline" href={`/r/${subreddit.name}`}>
                    r/{subreddit.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
        </CommandList>
      )}
    </Command>
  );
};

export default Searchbar;
