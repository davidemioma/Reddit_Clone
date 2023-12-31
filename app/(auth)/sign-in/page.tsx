import Link from "next/link";
import { cn } from "@/libs/utils";
import SignIn from "@/components/SignIn";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function SignInPage() {
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

        <SignIn />
      </div>
    </div>
  );
}
