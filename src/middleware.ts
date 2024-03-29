import { getIsSubscribed, getAuthUserInfo } from "@/data/twitchAPI";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { Routes } from "./data/routes";
import { getURLFromRedirectError, isRedirectError } from "next/dist/client/components/redirect";

export const config = {
  matcher: "/sub/:path*",
};

export async function middleware(request: NextRequest) {
  try {
    // require user to be logged in
    const user = await getAuthUserInfo();

    // require user to be a subscriber
    if (!process.env.TWITCH_CHANNEL_ID) throw new Error("Missing TWITCH_CHANNEL_ID");

    const subscribed = await getIsSubscribed(user.id);

    if (!subscribed) redirect(Routes.auth.info);

    return NextResponse.next();
  } catch (e) {
    // handle redirect manually because next doesn't do it automatically
    if (!isRedirectError(e)) throw e;

    const redirectURL = new URL(getURLFromRedirectError(e), request.url);

    redirectURL.searchParams.set("to", request.nextUrl.pathname + request.nextUrl.search);

    return NextResponse.redirect(redirectURL, {
      headers: {
        "Set-Cookie": e.mutableCookies.toString(),
      },
    });
  }
}
