import { getNotionPages } from "@/data/notionPages";
import LoadMoreButton from "./LoadMoreButton";
import VODWindow from "./VODWindow";

export default async function VODPage() {
  const pages = await getNotionPages();

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <header>search</header>
      <main className="flex flex-col gap-4 items max-w-[1700px] ">
        <h1 className="text-7xl">WELCOME TO THE VODS</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {pages.results.map(page => {
            const props: any = page.properties;
            return (
              <VODWindow
                key={page.id}
                embedURL={props.url.url}
                tags={[]}
                thumbnailUrl={props.thumbnail_url.url}
                title={props.name.title.reduce((a: string, e: any) => a + e.plain_text, "")}
              />
            );
          })}
        </div>
        {pages.has_more && pages.next_cursor && <LoadMoreButton nextCursor={pages.next_cursor} />}
      </main>
    </div>
  );
}
