import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "./use-toast";
import { Prisma, Subreddit } from "@prisma/client";

type ResultProps = Subreddit & {
  _count: Prisma.SubredditCountOutputType;
};

const useDebounce = (input: string) => {
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState<ResultProps[]>([]);

  const onSearchHandler = async () => {
    if (!input.trim) return [];

    setLoading(true);

    try {
      const res = await axios.get(`/api/search?q=${input}`);

      setResults(res.data);
    } catch (err) {
      return toast({
        title: "Something went wrong.",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!input.trim()) return;

    setTimeout(() => {
      onSearchHandler();
    }, 3000);
  }, [input]);

  return { loading, results };
};

export default useDebounce;
