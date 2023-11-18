import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/lib/crypto";
import { TwitchTokenResponse } from "./twitchAPI";

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
  });
}
