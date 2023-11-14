import "server-only";
import { redirect } from "next/navigation";

export function exitWithRedirect(): never {
  redirect("/api/test/stop");
}
