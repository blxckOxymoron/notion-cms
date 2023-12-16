import VideoEmbed from "@/app/components/VideoEmbed";
import Modal from "@/app/components/Modal";
import { getNotionPage } from "@/data/notionPages";
import { notFound } from "next/navigation";

export default async function VODVideoPage({ params }: { params: { vodId: string } }) {
  const page = await getNotionPage(params.vodId);
  if (!page) notFound();

  const properties: any = page.properties;

  return (
    <Modal>
      <VideoEmbed
        embedURL={properties.url.url}
        title={properties.name.title.reduce(
          (txt: string, { plain_text }: { plain_text: string }) => txt + plain_text,
          ""
        )}
      />
    </Modal>
  );
}
