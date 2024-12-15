import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/$quizId/edit/")({
  component: EditQuiz,
});

function EditQuiz() {
  return <div>Hello "/quizzes/$quizId/edit/"!</div>;
}
