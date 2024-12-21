import EditQuiz from "@/components/EditQuiz";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/add/")({
  component: AddQuiz,
  beforeLoad: ({ context }) => {
    const { isLoggedIn } = context.auth;
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" });
    }
  },
  errorComponent: ({ error }) => <div>{error.message}</div>,
  pendingComponent: () => <div>Loading...</div>,
});

function AddQuiz() {
  return <EditQuiz />;
}
