import Link from "next/link";
import { cn } from "@/libs/utils";
import Signup from "@/components/Signup";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="absolute inset-0">
      <div className="h-full w-full max-w-2xl mx-auto flex flex-col justify-center items-center gap-20">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            `self-start -mt-20`
          )}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Home
        </Link>

        <Signup />
      </div>
    </div>
  );
}
