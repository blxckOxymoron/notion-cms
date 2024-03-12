"use server";

import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/lib/crypto";
import { TwitchTokenResponse } from "./twitchAPI";
import { Routes } from "./routes";

type TokenData = TwitchTokenResponse & {
  updated_at: number;
};

export async function getTokenData(): Promise<TokenData | undefined> {
  const cookieToken = cookies().get("token")?.value;
  if (!cookieToken) return;

  const tokenData: TokenData = JSON.parse(await decrypt(cookieToken));

  return tokenData;
}

export async function setTokenData(data: TwitchTokenResponse) {
  const tokenData = {
    ...data,
    updated_at: Date.now(),
  };

  cookies().set("token", await encrypt(JSON.stringify(tokenData)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    maxAge: tokenData.expires_in,
  });
}

export async function setSavedPassword(id: string, formData: FormData) {
  const value = formData.get("password");

  if (typeof value !== "string") return;

  const passwords = JSON.parse(cookies().get("passwords")?.value ?? "{}");
  passwords[id] = value;

  cookies().set("passwords", JSON.stringify(passwords), {
    httpOnly: true,
    sameSite: "lax",
    path: Routes.vods.base,
    secure: process.env.NODE_ENV !== "development",
    // no expires so it's a session cookie
  });
}

export async function getSavedPassword(id: string) {
  const passwords = JSON.parse(cookies().get("passwords")?.value ?? "{}");
  return passwords[id] ?? null;
}
