import { redirect } from "next/navigation";
import { getSession } from "@/actions/getSession";
import UsernameForm from "./components/UsernameForm";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};

export default async function Settings() {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>

        <UsernameForm
          user={{
            id: session.user?.id,
            username: session.user?.username || "",
          }}
        />
      </div>
    </div>
  );
}
