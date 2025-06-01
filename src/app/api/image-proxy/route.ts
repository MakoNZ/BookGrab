import { NextRequest, NextResponse } from "next/server";
import { getServerEnvVariables } from "@/lib/env";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 },
    );
  }

  try {
    const { MAM_TOKEN } = getServerEnvVariables();

    // Log the URL we're trying to fetch for debugging
    console.log("Fetching image from:", url);

    // Create a new URL object to ensure we're working with a valid URL
    const imageUrl = new URL(url);

    // Prepare headers that mimic a browser request
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Referer: "https://www.myanonamouse.net/",
      "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      Accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    };

    // Add the MAM token as a cookie if the URL is from myanonamouse.net
    if (
      imageUrl.hostname.includes("myanonamouse.net") ||
      imageUrl.hostname.includes("cdn.myanonamouse.net")
    ) {
      headers["Cookie"] = `mam_id=${MAM_TOKEN}`;
    }

    const response = await fetch(imageUrl.toString(), {
      headers,
      next: { revalidate: 0 }, // Don't cache this request
    });

    if (!response.ok) {
      console.error(
        `Image fetch failed: ${response.status} ${response.statusText}`,
      );
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
      );
    }

    // Get the image data as an array buffer
    const imageData = await response.arrayBuffer();

    // Get the content type from the response
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image with the correct content type
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);

    // Return a placeholder image instead of an error
    return NextResponse.redirect(
      new URL("/placeholder-book.png", request.nextUrl.origin),
    );
  }
}
