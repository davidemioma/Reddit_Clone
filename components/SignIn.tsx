import React from "react";
import Link from "next/link";
import Image from "next/image";
import AuthForm from "./AuthForm";

const SignIn = () => {
  return (
    <div className="container w-full flex flex-col items-center justify-center gap-6 sm:w-[400px]">
      <div className="flex flex-col gap-2 text-center">
        <div className="relative w-8 h-8 mx-auto overflow-hidden">
          <Image className="object-cover" src="/assets/icon.png" fill alt="" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>

        <p className="text-sm max-w-sm mx-auto">
          By continuing, you are setting up a reddit account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>

      <AuthForm className="w-full" />

      <p className="text-sm text-zinc-700 text-center px-8">
        New to Reddit?{" "}
        <Link
          href="/sign-up"
          className="text-sm underline underline-offset-4 hover:text-zinc-800 transition"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
