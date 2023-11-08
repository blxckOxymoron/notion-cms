import { NextRequest, NextResponse } from "next/server";
import { AuthStateData } from "../login/route";
import { encrypt } from "@/lib/crypto";
import { TwitchTokenData } from "@/data/twitchUser";

export async function GET(request: NextRequest) {
  if (!process.env.TWITCH_CLIENT_ID) throw new Error("Missing TWITCH_CLIENT_ID");
  if (!process.env.TWITCH_CLIENT_SECRET) throw new Error("Missing TWITCH_CLIENT_SECRET");

  const paramState = request.nextUrl.searchParams.get("state");
  if (!paramState) return new NextResponse("Missing state", { status: 400 });

  const state: AuthStateData = JSON.parse(Buffer.from(paramState, "base64url").toString());

  const redirectURL = new URL("/auth/twitch", request.nextUrl.origin);
  if (state.to) redirectURL.searchParams.set("to", state.to);

  // success: code, scope, state
  const paramCode = request.nextUrl.searchParams.get("code");

  if (!paramCode) {
    // error: error, error_description, state
    const paramError = request.nextUrl.searchParams.get("error");
    const paramErrorDescription = request.nextUrl.searchParams.get("error_description");

    redirectURL.searchParams.set("error", paramError || "");
    redirectURL.searchParams.set("error_description", paramErrorDescription || "");

    return NextResponse.redirect(redirectURL);
  }

  const tokenResponse: TwitchTokenData = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code: paramCode,
      grant_type: "authorization_code",
      redirect_uri: request.nextUrl.origin + "/auth/twitch/callback",
    }),
  }).then(res => res.json());

  const response = NextResponse.redirect(redirectURL);

  let cookieString = `token=${encrypt(
    JSON.stringify(tokenResponse)
  )}; HttpOnly; SameSite=Lax; Path=/`;
  if (process.env.NODE_ENV !== "development") cookieString += "; Secure";

  response.headers.append("Set-Cookie", cookieString);

  console.log("callback", tokenResponse, cookieString);

  return response;
}
