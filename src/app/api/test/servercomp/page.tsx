import { redirect } from "next/navigation";
import { exitWithRedirect } from "./exit";

export default function ServerRedirectPage() {
  exitWithRedirect();
}
