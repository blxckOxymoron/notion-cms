import { Routes } from "@/data/routes";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  request.cookies.delete("token");
  redirect(Routes.auth.login);
}
