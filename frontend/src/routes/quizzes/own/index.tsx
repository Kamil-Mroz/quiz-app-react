import Quiz from "@/components/quiz";
import { deleteQuiz, getOwnQuizzes } from "@/services/quizzesService";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/own/")({
  component: OwnQuiz,
  errorComponent: ({ error }) => <div>{error.message}</div>,
  beforeLoad: ({ context }) => {
    const { isLoggedIn } = context.auth;
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
  loader: async () => await getOwnQuizzes(),
  pendingComponent: () => <div>Loading ...</div>,
});

function OwnQuiz() {
  const quizzes = Route.useLoaderData();
  const navigate = useNavigate();

  async function deleteQ(quizId: number) {
    if (confirm("Aare you sure you want delete this quiz?")) {
      await deleteQuiz(quizId);
      navigate({ from: Route.fullPath });
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-7 mb-4">
        <h1 className="text-2xl font-bold">My Quizzes</h1>
        <Link
          to="/quizzes/add"
          className="bg-green-600 hover:bg-green-500 rounded-md p-2 cursor-pointer text-white"
        >
          + add quiz
        </Link>
      </div>
      <div>
        {quizzes?.map((quiz) => (
          <Quiz quiz={quiz} key={quiz.id} isOwner={true} deleteQuiz={deleteQ} />
        ))}
        {!quizzes ||
          (quizzes.length <= 0 && (
            <div className="text-center text-neutral-400">
              No quiz available.
            </div>
          ))}
      </div>
    </div>
  );
}
