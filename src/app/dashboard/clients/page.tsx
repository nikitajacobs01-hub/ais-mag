import { redirect } from "next/navigation";

export default function ClientsPage() {
  // Redirect to the list page
  redirect("/dashboard/clients/list");
}
