import { redirect } from "next/navigation";

export function GET() {
  redirect("/sub/vods/all");
}
