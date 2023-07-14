import { ZodError } from "zod";
import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getSession } from "@/actions/getSession";
import { UsernameValidator } from "@/libs/validator/username";

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { name } = UsernameValidator.parse(body);

    const usernameExists = await prismadb.user.findFirst({
      where: {
        username: name,
      },
    });

    if (usernameExists) {
      return new NextResponse("Username already exists", { status: 409 });
    }

    await prismadb.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        username: name,
      },
    });

    return NextResponse.json("Username updated");
  } catch (err) {
    if (err instanceof ZodError) {
      return new NextResponse("Invalid name", { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
