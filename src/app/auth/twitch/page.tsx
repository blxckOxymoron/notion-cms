import { getAuthUserInfo, getIsSubscribed } from "@/data/twitchAPI";
import LinkToNextPage from "./LinkToNextPage";
import { getBroadcasterInfo } from "@/data/broadcaster";
import Image from "next/image";
import Link from "next/link";
import ErrorPage from "./ErrorPage";

export default async function TwitchAuth({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (searchParams["error"]) return <ErrorPage searchParams={searchParams} />;

  const { profile_image_url, id: user_id, display_name } = await getAuthUserInfo();
  const { display_name: broadcaster_display_name, id: broadcaster_id } = await getBroadcasterInfo();
  const isSubscribed = await getIsSubscribed(broadcaster_id, user_id);

  return (
    <main className="flex p-12 h-screen items-center justify-center">
      <div className="p-6 rounded-lg border border-white flex flex-col items-center gap-3 max-w-md">
        <h1 className="text-xl text-center font-bold">
          Logged in as <br />
          <Image
            src={profile_image_url}
            alt={display_name + "'s profile picture"}
            width={32}
            height={32}
            className="inline-block m-2 rounded-full"
          />
          {display_name}
        </h1>
        <hr className="h-[1px] bg-slate-50 w-full" />
        {isSubscribed ? (
          <>
            <p className="text-lg">
              <span className="scale-125 inline-block">✅</span> Du bist Subscriber bei{" "}
              {broadcaster_display_name}
            </p>
            <p className="text-center">Du kannst dir jetzt die extra Inhalte anschauen</p>
          </>
        ) : (
          <>
            <p className="text-center">
              <span className="scale-125 inline-block">❌</span> Du bist kein Subscriber von{" "}
              {broadcaster_display_name}
            </p>
            <p className="text-center">Diese Seite ist nur für Subscriber zugänglich</p>
          </>
        )}
        <div className="flex gap-2">
          {isSubscribed ? <LinkToNextPage /> : null}
          <Link
            href="/auth/twitch/logout"
            className="border rounded-md px-3 py-1 hover:border-zinc-300 hover:text-zinc-300 transition-colors"
          >
            abmelden
          </Link>
        </div>
      </div>
    </main>
  );
}
