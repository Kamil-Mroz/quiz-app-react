import { QuizFormData, useFormContextQuiz } from "@/hooks/forms";
import { createQuiz, updateQuiz } from "@/services/quizzesService";
import { Quiz } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";

import { useFieldArray } from "react-hook-form";
import Choices from "./Choices";
import { useEffect } from "react";

type EditQuizProps = {
  quiz?: Quiz;
};

const EditQuiz = ({ quiz }: EditQuizProps) => {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormContextQuiz();

  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" });

  useEffect(() => {
    if (quiz) {
      reset({
        title: quiz.title || "",
        description: quiz.description || "",
        category: quiz.category || "",
        timeToSolve: quiz.timeToSolve || 1,
        questions: formatQuestions(quiz) || [
          {
            text: "",
            correctAnswer: "",
            type: "text",
            choices: [{ choiceText: "" }, { choiceText: "" }],
          },
        ],
      });
    } else {
      reset({
        title: "",
        description: "",
        category: "",
        timeToSolve: 1,
        questions: [
          {
            text: "",
            correctAnswer: "",
            type: "text",
            choices: [{ choiceText: "" }, { choiceText: "" }],
          },
        ],
      });
    }
    return () => {
      reset();
    };
  }, [quiz, reset]);

  function formatQuestions(quiz: Quiz) {
    return quiz?.questions.map((question) => {
      if (question.type === "date") {
        const date = new Date(question.correctAnswer as string);
        const formattedDate = `${date.getUTCDate().toString().padStart(2, "0")}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCFullYear()}`;

        return {
          ...question,
          correctAnswer: formattedDate,
          choices: question.choices?.map((choice) => {
            const choiceDate = new Date(choice.choiceText as string);
            const formattedChoiceDate = `${choiceDate.getUTCDate().toString().padStart(2, "0")}-${(choiceDate.getUTCMonth() + 1).toString().padStart(2, "0")}-${choiceDate.getUTCFullYear()}`;

            return { choiceText: formattedChoiceDate };
          }),
        };
      } else
        return {
          ...question,
          correctAnswer: question.correctAnswer.toString(),
          choices: question.choices?.map((choice) => ({
            choiceText: choice.choiceText.toString(),
          })),
        };
    });
  }

  function formatQuiz(quiz: QuizFormData) {
    const formattedQuiz = {
      ...quiz,
      questions: quiz.questions.map((question) => {
        if (question.type === "boolean") {
          return {
            ...question,
            correctAnswer:
              question.correctAnswer.toLowerCase() === "true" ? true : false,
            choices: [{ choiceText: true }, { choiceText: false }],
          };
        } else if (question.type === "numeric") {
          return {
            ...question,
            correctAnswer: Number(question.correctAnswer),
            choices: question.choices.map((choice) => ({
              choiceText: Number(choice.choiceText),
            })),
          };
        } else if (question.type === "date") {
          const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split("-");
            return new Date(`${year}-${month}-${day}`);
          };

          return {
            ...question,
            correctAnswer: parseDate(question.correctAnswer),
            choices: question.choices.map((choice) => ({
              choiceText: parseDate(choice.choiceText),
            })),
          };
        } else {
          return { ...question };
        }
      }),
    };

    return formattedQuiz;
  }

  async function onSubmit(data: QuizFormData) {
    const formattedData = formatQuiz(data);

    try {
      if (quiz) {
        await updateQuiz(quiz.id, formattedData);
      } else {
        await createQuiz(formattedData);
      }
      navigate({ to: "/quizzes/own" });
    } catch (error) {
      alert("Error: " + error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-neutral-900 shadow-lg rounded-lg">
      <Link to="/" className="mb-4 text-blue-500 underline">
        ← Go Back
      </Link>
      <h2 className="text-2xl font-semibold  mb-6">
        {quiz ? "Edit" : "Create"} Quiz
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-medium text-neutral-300"
          >
            Title
          </label>
          <input
            id="title"
            {...register("title")}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the quiz title"
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-lg font-medium text-neutral-300"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Describe the quiz"
          />
          {errors.description && (
            <p className="error">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-lg font-medium text-neutral-300"
          >
            Category
          </label>
          <input
            {...register("category")}
            id="category"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the category"
          />
          {errors.category && (
            <p className="error">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="timeToSolve"
            className="block text-lg font-medium text-neutral-300"
          >
            Time to solve quiz (minutes)
          </label>
          <input
            id="timeToSolve"
            type="number"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={1}
            step={0.1}
            {...register("timeToSolve", { valueAsNumber: true })}
          />
          {errors.timeToSolve && (
            <p className="error">{errors.timeToSolve.message}</p>
          )}
        </div>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="p-4 bg-neutral-800 rounded-lg shadow-sm space-y-4"
            >
              <h3 className="text-xl font-semibold text-white">
                Question {index + 1}
              </h3>
              <div>
                <label
                  htmlFor={`questions.${index}.type`}
                  className="block text-lg font-medium text-neutral-300"
                >
                  Question Type
                </label>
                <select
                  id={`questions.${index}.type`}
                  {...register(`questions.${index}.type`)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="numeric">Numeric</option>
                  <option value="boolean">Boolean</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor={`questions.${index}.text`}
                  className="block text-lg font-medium text-neutral-300"
                >
                  Question Text
                </label>
                <input
                  id={`questions.${index}.text`}
                  {...register(`questions.${index}.text`)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the question"
                />
                {errors.questions?.[index]?.text && (
                  <p className="error">
                    {errors.questions[index].text.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`questions.${index}.correctAnswer`}
                  className="block text-lg font-medium text-neutral-300"
                >
                  Correct Answer
                </label>
                <input
                  id={`questions.${index}.correctAnswer`}
                  {...register(`questions.${index}.correctAnswer`)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the correct answer"
                />
                {errors.questions?.[index]?.correctAnswer && (
                  <p className="error">
                    {errors.questions[index].correctAnswer.message}
                  </p>
                )}
              </div>
              {errors.questions?.[index]?.root && (
                <p className="error">{errors.questions[index].root.message}</p>
              )}

              <Choices questionIndex={index} questionType={question.type} />

              {/* Remove this question */}
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add more questions */}
        <button
          type="button"
          onClick={() =>
            addQuestion({
              text: "",
              correctAnswer: "",
              type: "text",
              choices: [{ choiceText: "" }, { choiceText: "" }],
            })
          }
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
export default EditQuiz;
