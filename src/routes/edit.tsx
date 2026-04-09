import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAuthFn } from "#/lib/server-fns";
import Header from "#/components/Header";

export const Route = createFileRoute("/edit")({
  beforeLoad: async () => {
    const { isLoggedIn } = await getAuthFn();
    if (!isLoggedIn) {
      throw redirect({ to: "/login" });
    }
  },
  component: EditLayout,
});

function EditLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
}
