import { redirect } from "next/navigation";

export function GET() {
  redirect("/api/test/stop");
}
