import { NextRequest, NextResponse } from "next/server";

function createState(request: NextRequest) {
  return {
    to: request.nextUrl.searchParams.get("to"),
  };
}

export type AuthStateData = ReturnType<typeof createState>;

export function GET(request: NextRequest) {
  if (!process.env.TWITCH_CLIENT_ID) throw new Error("Missing TWITCH_CLIENT_ID");

  const twitchLoginUrl = new URL("https://id.twitch.tv/oauth2/authorize");

  twitchLoginUrl.searchParams.set("client_id", process.env.TWITCH_CLIENT_ID);
  twitchLoginUrl.searchParams.set("redirect_uri", "http://localhost:3000/auth/twitch/callback");
  twitchLoginUrl.searchParams.set("response_type", "code");
  twitchLoginUrl.searchParams.set("scope", "user:read:subscriptions");

  twitchLoginUrl.searchParams.set(
    "state",
    Buffer.from(JSON.stringify(createState(request))).toString("base64url")
  );

  return NextResponse.redirect(twitchLoginUrl);
}
