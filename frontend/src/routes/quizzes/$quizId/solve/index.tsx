import Countdown from "@/components/Countdown";
import { getQuiz, submitAttempt } from "@/services/quizzesService";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/quizzes/$quizId/solve/")({
  component: SolveQuiz,
  beforeLoad: ({ context }) => {
    const { isLoggedIn } = context.auth;
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" });
    }
  },
  loader: ({ params }) => {
    const quizId = parseInt(params.quizId);
    if (isNaN(quizId)) {
      throw redirect({ to: "/" });
    }
    return getQuiz(quizId);
  },
  errorComponent: ({ error }) => <div className="error">{error.message}</div>,
  pendingComponent: () => <div>Loading...</div>,
});

export interface QuizAttempt {
  answers: (string | number | boolean | Date | undefined)[];
}

function SolveQuiz() {
  const quiz = Route.useLoaderData();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<QuizAttempt>();
  const answers = watch();

  const [result, setResult] = useState<{
    score: number;
    accuracy: number;
    achievementUnlocked: boolean;
  }>();
  const [error, setError] = useState<string>();

  function goBack() {
    navigate({ to: "/quizzes/$quizId", params: { quizId: `${quiz.id}` } });
  }
  async function onSubmit(data: QuizAttempt) {
    try {
      const formattedData = data.answers.map((answer) =>
        answer === "true" ? true : answer === "false" ? false : answer
      );
      const response = await submitAttempt({ answers: formattedData }, quiz.id);
      setResult(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="container mx-auto p-6 bg-neutral-800 shadow-lg rounded-lg">
      <button
        onClick={goBack}
        className="mb-4 text-blue-500 hover:text-blue-700 font-semibold underline"
      >
        ← Go Back
      </button>
      {error && <div className="error">{error}</div>}

      {result && (
        <div className="mt-6 p-4">
          <h3 className="text-xl font-semibold text-white mb-2">Quiz Result</h3>
          <p className="text-neutral-300">Score: {result.score}</p>
          <p className="text-neutral-300">
            Accuracy:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "percent",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(result.accuracy / 100)}
          </p>

          {result.achievementUnlocked && (
            <div>
              <p className="text-green-500 text-xl">New achievement unlocked</p>
              <Link to="/profile" className="text-blue-400 hover:underline">
                Go to profile
              </Link>
            </div>
          )}

          <Link href="/" className="text-blue-400 hover:underline">
            View Quizzes
          </Link>
        </div>
      )}

      {!result && (
        <div>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">
            {quiz.title}
          </h2>
          <p className="text-neutral-300 mb-6">{quiz.description}</p>

          <Countdown
            initialTime={quiz.timeToSolve}
            onTimeUp={() => {
              onSubmit(getValues());
            }}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {quiz.questions.map((question, i) => (
              <div className="mb-6" key={i}>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Question {i + 1}
                </h3>
                <p className="text-neutral-400 mb-4">{question.text}</p>

                {question.choices && question.choices.length > 0 && (
                  <div className="space-y-2">
                    {question.choices.map((choice, j) => (
                      <div className="flex items-center" key={j}>
                        <label className="flex items-center space-x-3 text-neutral-300">
                          <input
                            type="radio"
                            value={choice.choiceText as string}
                            {...register(`answers.${i}`, {
                              required: "Please select an answer",
                            })}
                            className="text-blue-500"
                          />
                          <span>
                            {question.type === "date"
                              ? new Date(
                                  choice.choiceText as string
                                ).toLocaleDateString("pl-PL", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                              : typeof choice.choiceText === "boolean"
                                ? choice.choiceText
                                  ? "True"
                                  : "False"
                                : choice.choiceText.toString()}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {errors?.answers?.[i] && (
                  <p className="text-red-500 text-sm">
                    {errors.answers[i]?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={Object.values(answers).some(
                (answer) => answer === undefined
              )}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Submit Quiz
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
