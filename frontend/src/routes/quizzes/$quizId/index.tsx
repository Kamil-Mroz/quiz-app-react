import { getQuiz } from "@/services/quizzesService";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/AuthProvider";
import QuizErrorBoundary from "../../../components/quizError";

export const Route = createFileRoute("/quizzes/$quizId/")({
  component: Quiz,
  errorComponent: QuizErrorBoundary,
  loader: async ({ params }) => {
    const quizId = parseInt(params.quizId);
    if (isNaN(quizId)) {
      throw new Error("Invalid quiz ID");
    }
    try {
      const quiz = await getQuiz(quizId);

      if (!quiz) {
        throw new Error("Quiz not found");
      }

      return {
        quiz,
        quizId,
      };
    } catch {
      throw new Response("Failed to load quiz data", { status: 500 });
    }
  },
  pendingComponent: () => <div>Loading...</div>,
});

function Quiz() {
  const { quizId, quiz } = Route.useLoaderData();
  const { authToken } = useAuth();
  return (
    <div className="max-w-4xl mx-auto p-6 bg-neutral-800 rounded-lg shadow-l">
      <Link
        to="/"
        className="mb-4 text-blue-500 hover:text-blue-700 font-semibold underline"
      >
        ← Go Back
      </Link>
      <h1 className="text-3xl font-extrabold text-neutral-100 mb-4">
        {quiz.title}
      </h1>
      <div className="space-y-4">
        <p className="text-lg font-medium text-neutral-200">
          <strong>Description:</strong> {quiz.description}
        </p>
        <p className="text-lg text-neutral-300">
          <strong>Category:</strong> {quiz.category}
        </p>
        <p className="text-lg text-neutral-300">
          <strong>Time to solve:</strong> {quiz.timeToSolve} minutes.
        </p>
        <p className="text-lg text-neutral-300">
          <strong>Times solved:</strong> {quiz.timesSolved}
        </p>
        <p className="text-lg text-neutral-300">
          <strong>Created By:</strong> {quiz.createdBy}
        </p>
        <p className="text-lg text-neutral-300">
          <strong>Created At:</strong>{" "}
          {new Date(quiz.createdAt).toLocaleDateString("pl-PL")}
        </p>
        <p className="text-lg text-neutral-300">
          <strong>Updated At:</strong>{" "}
          {new Date(quiz.updatedAt).toLocaleDateString("pl-PL")}
        </p>
        <p className="text-lg text-neutral-300">
          <strong>Number of Questions:</strong> {quiz.questions.length}
        </p>

        {authToken && (
          <Link
            from={Route.fullPath}
            to="../$quizId/solve"
            params={{
              quizId: quizId + "",
            }}
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 block text-center"
          >
            Start quiz
          </Link>
        )}
      </div>
    </div>
  );
}
