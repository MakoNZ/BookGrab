import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/mam-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 },
    );
  }

  try {
    const result = await searchBooks(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search books" },
      { status: 500 },
    );
  }
}
