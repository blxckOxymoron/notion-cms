import { getNotionPages } from "@/data/notionPages";
import PageVideos from "./PageVideos";

export default async function VODPage({ searchParams }: { searchParams: { q?: string } }) {
  const initialPages = await getNotionPages({
    query: searchParams.q,
  });

  return (
    <main className="flex flex-col gap-4 items max-w-[1700px]">
      <h1 className="text-4xl mb-4">VODs:{searchParams.q ? ` "${searchParams.q}"` : ""}</h1>
      {initialPages.results.length > 0 ? (
        <PageVideos initialPages={initialPages} query={searchParams.q} />
      ) : (
        <p>Keine VODs gefunden</p>
      )}
    </main>
  );
}
