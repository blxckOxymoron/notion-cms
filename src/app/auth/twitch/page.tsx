import { getAuthUserInfo, getIsSubscribed } from "@/data/twitchAPI";
import LinkToNextPage from "./LinkToNextPage";
import Image from "next/image";
import Link from "next/link";
import ErrorPage from "./ErrorPage";
import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { createHash } from "crypto";
import { Routes } from "@/data/routes";

export default async function TwitchAuth({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (searchParams["error"]) return <ErrorPage searchParams={searchParams} />;

  const { profile_image_url, id: user_id, display_name } = await getAuthUserInfo();
  const isSubscribed = await getIsSubscribed(user_id);

  return (
    <main className="flex flex-col gap-8 p-12 h-screen items-center justify-center overflow-x-hidden">
      <h1 className="text-4xl font-semibold">Who&apos;s watching?</h1>
      <div className="flex gap-10 pb-12 select-none max-w-full justify-center">
        <FakeProfile seed={user_id + "_1"} />
        <FakeProfile seed={user_id + "_2"} />
        <a
          href={isSubscribed ? Routes.vods.all : "#"}
          className="w-52 h-52 hover:border-white border-2 border-transparent rounded-md hover:scale-110 transition-all cursor-pointer group relative shrink-0"
        >
          <Image
            src={profile_image_url}
            alt={`${display_name}'s profile picture`}
            width={320}
            height={320}
            className="rounded-md overflow-hidden"
          />
          <p className="-bottom-10 absolute block w-full text-center pointer-events-none text-lg">
            {display_name}
          </p>
        </a>
        <FakeProfile seed={user_id + "_3"} />
        <FakeProfile seed={user_id + "_4"} />
      </div>
      {!isSubscribed && (
        <p className="text-red-600">
          <span className="scale-125 inline-block mx-2">❌</span>Du bist leider kein Subscriber von{" "}
          {process.env.TWITCH_CHANNEL_NAME}, die Seite ist nur für Subscriber zugänglich.
        </p>
      )}
      <div className="flex gap-4">
        {isSubscribed ? (
          <LinkToNextPage />
        ) : (
          <Link
            href={`https://twitch.tv/` + process.env.TWITCH_CHANNEL_NAME + "/subscribe"}
            className="hover:text-red-600 px-4 py-2 bg-red-600 hover:bg-transparent border border-red-600 rounded-md transition-colors"
          >
            Subscriber werden
          </Link>
        )}
        <Link
          href={Routes.auth.logout}
          className="border rounded-md px-4 py-2 border-zinc-300 hover:border-white text-zinc-300 hover:text-white transition-colors"
        >
          abmelden
        </Link>
      </div>
    </main>
  );
}

function FakeProfile({ seed }: { seed: string }) {
  const md5Seed = createHash("md5").update(seed).digest("hex");

  const avatar = createAvatar(notionists, {
    seed: md5Seed,
    backgroundColor: ["b6e3f4", "c0aede", "ffd5dc", "ffdfbf", "d1d4f9"],
  });

  return (
    <div
      className="w-52 h-52 overflow-hidden border-2 border-transparent shrink-0"
      dangerouslySetInnerHTML={{ __html: avatar.toString() }}
    ></div>
  );
}
