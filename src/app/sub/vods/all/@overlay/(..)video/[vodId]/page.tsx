import VideoEmbed from "@/components/VideoEmbed";
import Modal from "@/components/Modal";
import { getNotionPage } from "@/data/notionPages";
import { notFound } from "next/navigation";
import extractEmbedURLs from "@/lib/extractEmbedURLs";

export default async function VODVideoPage({
  params,
  searchParams,
}: {
  params: { vodId: string };
  searchParams: { hosting: string | undefined };
}) {
  const page = await getNotionPage(params.vodId);
  if (!page) notFound();

  const properties: any = page.properties;

  const urls = extractEmbedURLs(page.properties);

  return (
    <Modal>
      <VideoEmbed
        urls={urls}
        hosting={searchParams.hosting}
        title={properties.name.title.reduce(
          (txt: string, { plain_text }: { plain_text: string }) => txt + plain_text,
          ""
        )}
      />
    </Modal>
  );
}
