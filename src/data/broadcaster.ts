import { getUserInfo } from "./twitchAPI";

export async function getBroadcasterInfo() {
  if (!process.env.TWITCH_CHANNEL_ID) throw new Error("Missing TWITCH_CHANNEL_ID");

  return getUserInfo(process.env.TWITCH_CHANNEL_ID);
}
