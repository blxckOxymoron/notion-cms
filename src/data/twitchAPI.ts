"use server";

import { redirect } from "next/navigation";
import { getTokenData, setTokenData } from "./user";
import { Routes } from "./routes";
import { headers } from "next/headers";

const fetchTwitchWithAuth = async (route: string, init?: RequestInit | undefined) => {
  if (!process.env.TWITCH_CLIENT_ID) throw new Error("Missing TWITCH_CLIENT_ID");
  if (!process.env.TWITCH_CLIENT_SECRET) throw new Error("Missing TWITCH_CLIENT_SECRET");

  const url = new URL(route, "https://api.twitch.tv/helix/");

  // TODO next-url is not a good or reliable way to get the current url

  const tokenData = await getTokenData();
  if (!tokenData) redirect(Routes.auth.login + `?to=${headers().get("next-url")}`);

  const result = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${tokenData.access_token}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID,
    },
  });

  if (result.status === 401) {
    console.error("not authorized", tokenData);
    redirect(Routes.auth.refresh + `?to=${headers().get("next-url")}`);
  }

  return result;
};

export type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: "bearer";
};

export async function updateTokenFromCode(code: string): Promise<TwitchTokenResponse> {
  if (!process.env.TWITCH_CLIENT_ID) throw new Error("Missing TWITCH_CLIENT_ID");
  if (!process.env.TWITCH_CLIENT_SECRET) throw new Error("Missing TWITCH_CLIENT_SECRET");
  if (!process.env.HTTP_ORIGIN) throw new Error("Missing HTTP_ORIGIN");

  const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.HTTP_ORIGIN + "/auth/twitch/callback",
    }),
  });

  if (!tokenResponse.ok) {
    console.error("failed to get token from code", tokenResponse);
    redirect(Routes.auth.logout);
  }

  const respJson = await tokenResponse.json();

  await setTokenData(respJson);

  return respJson;
}

export async function updateTokenFromRefreshToken(tokenData: TwitchTokenResponse) {
  if (!process.env.TWITCH_CLIENT_ID) throw new Error("Missing TWITCH_CLIENT_ID");
  if (!process.env.TWITCH_CLIENT_SECRET) throw new Error("Missing TWITCH_CLIENT_SECRET");

  // refresh token
  const refreshedResult = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: tokenData.refresh_token,
    }),
  });

  // couldn't refresh token
  if (!refreshedResult.ok) redirect(Routes.auth.logout);

  // save new token
  const newTokenData: TwitchTokenResponse = await refreshedResult.json();
  await setTokenData(newTokenData);
}

export type TwitchAppTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: "bearer";
};

export async function getAppToken(): Promise<TwitchAppTokenResponse> {
  if (!process.env.TWITCH_CLIENT_ID) throw new Error("Missing TWITCH_CLIENT_ID");
  if (!process.env.TWITCH_CLIENT_SECRET) throw new Error("Missing TWITCH_CLIENT_SECRET");

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) throw new Error("Failed to get app token");
  return await response.json();
}

export type TwitchUserInfoResponse = {
  id: string;
  login: string;
  display_name: string;
  type: "staff" | "admin" | "global_mod" | "";
  broadcaster_type: "partner" | "affiliate" | "";
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  email: string;
  created_at: string;
};

export async function getAuthUserInfo(): Promise<TwitchUserInfoResponse> {
  const response = await fetchTwitchWithAuth("users");
  const resJson = await response.json();
  return resJson.data[0];
}

type TwitchIsSubscribedBaseResponse = {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  is_gift: boolean;
  tier: "1000" | "2000" | "3000" | "";
};

export type TwitchIsSubscribedResponse = TwitchIsSubscribedBaseResponse & {
  is_gift: true;
  gifter_id: string;
  gifter_login: string;
  gifter_name: string;
};

const overrideUserIds: string[] = process.env.USER_OVERRIDE_IDS?.split(",") ?? [];

export async function getIsSubscribed(user_id: string): Promise<boolean> {
  if (!process.env.TWITCH_CHANNEL_ID) throw new Error("Missing TWITCH_CHANNEL_ID");

  if (process.env.TWITCH_CHANNEL_ID === user_id || overrideUserIds.includes(user_id)) return true;

  const response = await fetchTwitchWithAuth(
    "subscriptions/user?" +
      new URLSearchParams({
        broadcaster_id: process.env.TWITCH_CHANNEL_ID,
        user_id,
      })
  );

  return response.ok;
  // if (response.status === 404) return false;
  // else return (await response.json()).data[0] as TwitchIsSubscribedResponse;
}
