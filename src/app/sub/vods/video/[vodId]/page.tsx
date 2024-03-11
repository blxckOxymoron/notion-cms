import VideoEmbed from "@/components/VideoEmbed";
import { getNotionPage } from "@/data/notionPages";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VODVideoPage({
  params,
  searchParams,
}: {
  params: { vodId: string };
  searchParams: { hosting: string | undefined; password: string | undefined };
}) {
  const page = await getNotionPage(params.vodId, searchParams.password);
  if (!page) notFound();

  return (
    <div className="flex flex-col items-center my-4 gap-4 w-full">
      <VideoEmbed vod={page} hosting={searchParams.hosting} />
      <div className="flex gap-2">
        <Link href="/sub/vods/all" className="hover:underline">
          &larr; Alle VODs
        </Link>
      </div>
    </div>
  );
}
