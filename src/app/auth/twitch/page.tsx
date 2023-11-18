import { getAuthUserInfo, getIsSubscribed } from "@/data/twitchAPI";
import LinkToNextPage from "./LinkToNextPage";
import { getBroadcasterInfo } from "@/data/broadcaster";
import Image from "next/image";
import Link from "next/link";

export default async function TwitchAuth() {
  const data = await getAuthUserInfo();
  const broadcaster = await getBroadcasterInfo();
  const isSubscribed = await getIsSubscribed(broadcaster.id, data.id);

  return (
    <main className="flex p-12 h-screen items-center justify-center">
      <div className="p-6 rounded-lg border border-white flex flex-col items-center gap-3 max-w-sm">
        <h1 className="text-xl text-center font-bold">
          Logged in as <br />{" "}
          <Image
            src={data.profile_image_url}
            alt={data.display_name + "'s profile picture"}
            width={32}
            height={32}
            className="inline-block m-2 rounded-md"
          />
          {data.display_name}
        </h1>
        <hr className="h-[1px] bg-slate-50 w-full" />
        {isSubscribed ? (
          <>
            <p className="text-lg">
              <span className="scale-125 inline-block">✅</span> You are subscribed to{" "}
              {broadcaster.display_name}
            </p>
            <p className="text-center">You can now access the subscriber-only content</p>
          </>
        ) : (
          <>
            <p className="text-center">
              <span className="scale-125 inline-block">❌</span> You are not subscribed to{" "}
              {broadcaster.display_name}
            </p>
            <p className="text-center">Unfortunately this page is subscriber-only</p>
          </>
        )}
        <div className="flex gap-2">
          {isSubscribed ? <LinkToNextPage /> : null}
          <Link
            href="/auth/twitch/logout"
            className="border rounded-md px-3 py-1 hover:underline hover:border-zinc-300 hover:text-zinc-300 transition-colors"
          >
            logout
          </Link>
        </div>
      </div>
    </main>
  );
}
