import EditQuizComponent from "@/components/EditQuiz";
import { getQuiz } from "@/services/quizzesService";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/$quizId/edit/")({
  component: EditQuiz,
  beforeLoad: ({ context }) => {
    const { isLoggedIn } = context.auth;
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" });
    }
  },
  loader: async ({ params }) => {
    const quizId = parseInt(params.quizId);

    if (isNaN(quizId)) {
      throw redirect({ to: "/" });
    }
    const quiz = await getQuiz(quizId);

    return {
      quiz,
    };
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error }) => <div>{error.message}</div>,
});

function EditQuiz() {
  const { quiz } = Route.useLoaderData();
  return <EditQuizComponent quiz={quiz} />;
}
