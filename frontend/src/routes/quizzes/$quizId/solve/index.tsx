import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/$quizId/solve/")({
  component: SolveQuiz,
});

function SolveQuiz() {
  return <div>Hello "/quizzes/$quizId/solve/"!</div>;
}
