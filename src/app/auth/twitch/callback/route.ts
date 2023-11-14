import { NextRequest, NextResponse } from "next/server";
import { AuthStateData } from "../login/route";
import { updateTokenFromCode } from "@/data/twitchAPI";

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

  const tokenResponse = await updateTokenFromCode(paramCode);

  return NextResponse.redirect(redirectURL);
}
