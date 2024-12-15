import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/$quizId/")({
  component: Quiz,
});

function Quiz() {
  return <div>Hello "/quizzes/$quizId/"!</div>;
}
