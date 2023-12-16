import VideoEmbed from "@/app/components/VideoEmbed";
import { getNotionPage } from "@/data/notionPages";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VODVideoPage({ params }: { params: { vodId: string } }) {
  const page = await getNotionPage(params.vodId);
  if (!page) notFound();

  const properties: any = page.properties;

  return (
    <div className="flex flex-col items-center my-4 gap-4">
      <VideoEmbed
        embedURL={properties.url.url}
        title={properties.name.title.reduce(
          (txt: string, { plain_text }: { plain_text: string }) => txt + plain_text,
          ""
        )}
      />
      <div className="flex gap-2">
        <Link href="/sub/vods" className="hover:underline">
          &larr; All VODs
        </Link>
      </div>
    </div>
  );
}
