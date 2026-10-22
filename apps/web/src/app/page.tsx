import { redirect } from "next/navigation";

// This route only redirects, so there is no instant navigation to validate.
export const instant = false;

export default function Home() {
  redirect("/dashboard");
}
