import { Routes } from "@/data/routes";
import { updateTokenFromRefreshToken } from "@/data/twitchAPI";
import { getTokenData } from "@/data/user";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

function createState(request: NextRequest) {
  let to = request.nextUrl.searchParams.get("to");
  if (to && ["null", "undefined", Routes.auth.logout, Routes.auth.login].includes(to)) to = null;
  return {
    to: request.nextUrl.searchParams.get("to"),
  };
}

export type AuthStateData = ReturnType<typeof createState>;

export async function GET(request: NextRequest) {
  if (!process.env.TWITCH_CLIENT_ID) throw new Error("Missing TWITCH_CLIENT_ID");

  const state = createState(request);
  const logout = request.nextUrl.searchParams.get("logout") === "true";

  const tokenData = await getTokenData();
  if (!logout && tokenData) {
    await updateTokenFromRefreshToken(tokenData);
    redirect(Routes.auth.info + (state.to ? `?to=${state.to}` : ""));
  }

  const twitchLoginUrl = new URL("https://id.twitch.tv/oauth2/authorize");

  twitchLoginUrl.searchParams.set("client_id", process.env.TWITCH_CLIENT_ID);
  twitchLoginUrl.searchParams.set("redirect_uri", "http://localhost:3000/auth/twitch/callback");
  twitchLoginUrl.searchParams.set("response_type", "code");
  twitchLoginUrl.searchParams.set("scope", "user:read:subscriptions");
  if (logout) twitchLoginUrl.searchParams.set("force_verify", "true");

  twitchLoginUrl.searchParams.set(
    "state",
    Buffer.from(JSON.stringify(state)).toString("base64url")
  );

  return NextResponse.redirect(twitchLoginUrl);
}
