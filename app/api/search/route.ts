import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const q = url.searchParams.get("q");

    if (!q) return new NextResponse("Invalid query", { status: 400 });

    const results = await prismadb.subreddit.findMany({
      where: {
        name: {
          startsWith: q,
        },
      },
      include: {
        _count: true,
      },
      take: 5,
    });

    return NextResponse.json(results);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
