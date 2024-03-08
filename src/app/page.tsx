import Link from "next/link";
import backgorundImage from "./background.jpg";

export default async function Home() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgorundImage.src})` }}
    >
      <div className="flex flex-col items-start p-12 gap-4 bg-black/70 rounded-xl max-w-lg">
        <h1 className="text-5xl font-bold">{process.env.TWITCH_CHANNEL_NAME}&rsquo;s VODs</h1>
        <p className="text-lg">
          Hier hast du die Möglichkeit, dir als Subscriber die VODs anzuschauen.
        </p>
        <Link
          href="/sub"
          className="hover:text-red-600 px-3 py-4 bg-red-600 hover:bg-black/70 border border-red-600 rounded-md transition-colors self-stretch text-lg font-semibold text-center"
        >
          Zum Subscriber Content
        </Link>
      </div>
    </main>
  );
}

export const revalidate = 3600; // 1 hour
