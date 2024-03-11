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
          {searchParams["error_description"] ?? "Ein unbekannter Fehler ist aufgetreten"}
        </h1>
        <p>
          code: <code>{searchParams["error"]}</code>
        </p>
        <hr className="h-[1px] bg-slate-50 w-full" />
        <em className="text-center">
          Diese Seite wird meistens angezeigt, wenn du die Authentifizierung mit Twitch abgebrochen
          hast
        </em>
        <div className="flex gap-2">
          <Link
            href="/auth/twitch/login"
            className="border rounded-md px-3 py-1 hover:border-primary hover:text-primary transition-colors"
          >
            login erneut versuchen
          </Link>
        </div>
      </div>
    </main>
  );
}
