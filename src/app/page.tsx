import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("workhub_token")?.value ||
    cookieStore.get("session_token")?.value ||
    cookieStore.get("auth_token")?.value ||
    cookieStore.get("token")?.value ||
    cookieStore.get("employee_token")?.value;

  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
