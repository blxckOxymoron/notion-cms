import { debugGetAllData } from "@/data/twitchUser";
import LinkToNextPage from "./LinkToNextPage";

export default async function TwitchAuth() {
  const data = debugGetAllData();

  return (
    <main className="flex flex-col p-12 gap-12">
      <h1>here after OAuth flow with token or error</h1>

      <pre>{data ? JSON.stringify(data, null, 2) : "undefined"}</pre>

      <LinkToNextPage />
    </main>
  );
}
