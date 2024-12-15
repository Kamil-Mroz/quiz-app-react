import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/quizzes/add/')({
  component: AddQuiz,
})

function AddQuiz() {
  return <div>Hello "/quizzes/add/"!</div>
}
