import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/own/")({
  component: OwnQuiz,
});

function OwnQuiz() {
  return <div>Hello "/quizzes/own/"!</div>;
}
