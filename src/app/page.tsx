import { getBroadcasterInfo } from "@/data/broadcaster";
import Link from "next/link";

export default async function Home() {
  const { display_name } = await getBroadcasterInfo();
  return (
    <main className="flex min-h-screen flex-col p-12 gap-12">
      <h1>Willkommen auf {display_name}&rsquo;s Seite</h1>
      <Link href="/sub">Zum Subscriber Content</Link>
    </main>
  );
}

export const revalidate = 3600; // 1 hour
