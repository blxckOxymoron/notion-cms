"use server";

export async function getBroadcasterInfo() {
  if (!process.env.TWITCH_CHANNEL_ID) throw new Error("Missing TWITCH_CHANNEL_ID");

  return {
    id: process.env.TWITCH_CHANNEL_ID,
    display_name: process.env.TWITCH_CHANNEL_NAME,
  };
}
