import { QuizType } from "@/models.module";
import { Link } from "@tanstack/react-router";

const Quiz = ({
  quiz,
  isOwner = false,
  deleteQuiz
}: {
  quiz: QuizType;
  isOwner?: boolean;
  deleteQuiz?:(quizId:number)=>void
}) => {

  return (
    <div className="bg-neutral-800 shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold text-blue-400">{quiz.title}</h2>
      <p className="text-neutral-200 mt-2 line-clamp-2">{quiz.description}</p>

      <div className="flex space-x-4 mt-4">
        <Link
          to="/quizzes/$quizId"
          params={{
            quizId: `${quiz.id}`,
          }}
          className="text-blue-400 hover:underline"
        >
          View Quiz
        </Link>
        {isOwner && (
          <>
            <Link
              to="/quizzes/$quizId/edit"
              params={{ quizId: `${quiz.id}` }}
              className="text-yellow-400 hover:underline cursor-pointer"
            >
              Edit Quiz
            </Link>
            <button
              onClick={()=>deleteQuiz!(quiz.id)}
              className="text-red-400 hover:underline cursor-pointer"
            >
              Delete Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default Quiz;
