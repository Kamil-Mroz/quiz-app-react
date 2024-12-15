import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navigation from "@/components/navigation";

export const Route = createRootRoute({
  component: () => (
    <div className="bg-neutral-900">
      <div className="container mx-auto">
        <Navigation />
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </div>
  ),
});
