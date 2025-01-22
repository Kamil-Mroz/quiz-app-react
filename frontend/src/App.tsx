import "./App.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { Link } from "@tanstack/react-router";
import { useAuth } from "./AuthProvider.tsx";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultNotFoundComponent: () => {
    return (
      <div className="grid place-content-center h-full text-3xl">
        <p>Not found!</p>
        <Link to="/" className="underline underline-offset-4">
          Go home
        </Link>
      </div>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
