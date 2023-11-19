import Link from "next/link";

export default function ErrorPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <main className="flex p-12 h-screen items-center justify-center">
      <div className="p-6 rounded-lg border border-white flex flex-col items-center gap-3 max-w-sm">
        <h1 className="text-xl text-center font-bold">
          {searchParams["error_description"] ?? "An unknown error occurred"}
        </h1>
        <p>
          code: <code>{searchParams["error"]}</code>
        </p>
        <hr className="h-[1px] bg-slate-50 w-full" />
        <em className="text-center">
          this usually happens when you have denied the application access
        </em>
        <div className="flex gap-2">
          <Link
            href="/auth/twitch/login"
            className="border rounded-md px-3 py-1 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            retry login
          </Link>
        </div>
      </div>
    </main>
  );
}
