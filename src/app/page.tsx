import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col p-12 gap-4 items-center justify-center">
      <h1 className="text-3xl font-bold">
        Willkommen auf {process.env.TWITCH_CHANNEL_NAME}&rsquo;s Seite
      </h1>
      <p>Hier hast du die möglichkeit als subscriber dir die VODs anzuschauen.</p>
      <Link
        href="/sub"
        className="hover:text-primary px-3 py-1 bg-primary hover:bg-transparent border border-primary rounded-md transition-colors"
      >
        Zum Subscriber Content
      </Link>
    </main>
  );
}

export const revalidate = 3600; // 1 hour
