import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/lib/crypto";
import { TwitchTokenResponse } from "./twitchAPI";
import { redirect } from "next/navigation";
import { Routes } from "./routes";

type TokenData = TwitchTokenResponse;

export function getTokenData(): TokenData {
  const cookieToken = cookies().get("token")?.value;
  if (!cookieToken) redirect(Routes.auth.login);

  const tokenData: TokenData = JSON.parse(decrypt(cookieToken));
  return tokenData;
}

export function setTokenData(data: TokenData) {
  cookies().set("token", encrypt(JSON.stringify(data)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV !== "development",
  });
}
