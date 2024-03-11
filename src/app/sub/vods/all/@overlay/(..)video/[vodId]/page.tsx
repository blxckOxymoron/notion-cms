import VideoEmbed from "@/components/VideoEmbed";
import Modal from "@/components/Modal";
import { getNotionPage } from "@/data/notionPages";
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
    <Modal>
      <VideoEmbed vod={page} hosting={searchParams.hosting} />
    </Modal>
  );
}
