import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import Navigation from "@/components/navigation";
import { AuthContext } from "@/AuthProvider";

interface MyRouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="bg-neutral-900 h-full text-white">
      <div className="container mx-auto h-full flex flex-col">
        <Navigation />
        <div className="grow">
          <Outlet />
        </div>
      </div>
    </div>
  ),
});
