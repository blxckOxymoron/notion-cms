import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/crypto";

export type TwitchTokenData = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: "bearer";
};

export function debugGetAllData(): TwitchTokenData | undefined {
  const cookieToken = cookies().get("token")?.value;
  if (!cookieToken) return undefined;

  const tokenData = JSON.parse(decrypt(cookieToken));
  return tokenData;
}
