import { Routes } from "@/data/routes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function GET() {
  cookies().delete("token");
  redirect(Routes.auth.login + "?logout=true");
}
