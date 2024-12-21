import { useFormContextQuiz } from "@/hooks/froms";
import { useFieldArray } from "react-hook-form";

interface ChoicesProps {
  questionIndex: number;
  questionType: "text" | "numeric" | "boolean" | "date";
}

const Choices = ({ questionIndex, questionType }: ChoicesProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContextQuiz();

  const {
    fields: choices,
    append: addChoice,
    remove: removeChoice,
  } = useFieldArray({ control, name: `questions.${questionIndex}.choices` });

  return (
    questionType !== "boolean" && (
      <>
        <div className="space-y-4">
          {choices.map((_, choiceIndex) => (
            <div key={choiceIndex}>
              <div className="flex items-center space-x-4">
                <label
                  className="block text-lg font-medium text-neutral-300 min-w-fit"
                  htmlFor={`questions.${questionIndex}.choices.${choiceIndex}.choiceText`}
                >
                  Choice {choiceIndex + 1}
                </label>
                <input
                  id={`questions.${questionIndex}.choices.${choiceIndex}.choiceText`}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter choice"
                  {...register(
                    `questions.${questionIndex}.choices.${choiceIndex}.choiceText`
                  )}
                />
                {choices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeChoice(choiceIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              {errors.questions?.[questionIndex]?.choices?.[choiceIndex]
                ?.choiceText && (
                <p className="error">
                  {
                    errors.questions[questionIndex].choices[choiceIndex]
                      .choiceText.message
                  }
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add more choices */}
        <button
          type="button"
          onClick={() => addChoice({ choiceText: "" })}
          className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Choice
        </button>
      </>
    )
  );
};
export default Choices;
