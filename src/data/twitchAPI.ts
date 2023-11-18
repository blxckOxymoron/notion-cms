import "server-only";
import { redirect } from "next/navigation";
import { getTokenData, setTokenData } from "./user";
import { Routes } from "./routes";

const fetchTwitchWithAuth = async (route: string, init?: RequestInit | undefined) => {
  if (!process.env.TWITCH_CLIENT_ID) throw new Error("Missing TWITCH_CLIENT_ID");
  if (!process.env.TWITCH_CLIENT_SECRET) throw new Error("Missing TWITCH_CLIENT_SECRET");

  const url = new URL(route, "https://api.twitch.tv/helix/");

  const tokenData = await getTokenData();
  if (!tokenData) redirect(Routes.auth.login);

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
    redirect(Routes.auth.login);
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

export async function getUserInfo(): Promise<TwitchUserInfoResponse> {
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

export async function getIsSubscribed(
  broadcaster_id: string,
  user_id: string
): Promise<TwitchIsSubscribedResponse | false> {
  const response = await fetchTwitchWithAuth(
    "subscriptions/user?" +
      new URLSearchParams({
        broadcaster_id,
        user_id,
      })
  );
  if (response.status === 404) return false;
  else return (await response.json()).data[0] as TwitchIsSubscribedResponse;
}
