import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

export const quizSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  category: z.string().nonempty("Category is required"),
  timeToSolve: z.number().min(1, "Time must be at least 1 minute"),
  questions: z
    .array(
      z
        .object({
          text: z.string().nonempty("Question text is required"),
          correctAnswer: z.string().nonempty("Correct answer is required"),
          type: z.enum(["text", "numeric", "boolean", "date"]),
          choices: z
            .array(
              z.object({
                choiceText: z.string().nonempty("This field is required"),
              })
            )
            .min(2, "Each question must have at least two choices"),
        })
        .refine(
          (val) => {
            if (val.type === "date") {
              const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

              const isValidDate = (dateStr: string) => {
                if (!dateRegex.test(dateStr)) return false;

                const [day, month, year] = dateStr.split("-").map(Number);
                const date = new Date(year, month - 1, day);
                return (
                  date.getFullYear() === year &&
                  date.getMonth() === month - 1 &&
                  date.getDate() === day
                );
              };

              return (
                isValidDate(val.correctAnswer) &&
                val.choices.every((choice) => isValidDate(choice.choiceText))
              );
            } else return true;
          },
          {
            message:
              "Correct answer and choices must be a valid date of format dd-mm-yyyy",
          }
        )
        .refine(
          (val) => {
            if (val.type !== "boolean")
              return val.choices.some(
                (choice) => choice.choiceText === val.correctAnswer
              );
            else return true;
          },
          { message: "Correct answer must be in choice" }
        )
        .refine(
          (val) => {
            if (val.type === "boolean") {
              return val.correctAnswer.toLowerCase() === "true"
                ? true
                : val.correctAnswer.toLowerCase() === "false"
                  ? true
                  : false;
            } else return true;
          },
          { message: "Correct answer should be true or false" }
        )
        .refine(
          (val) => {
            if (val.type === "numeric") {
              if (isNaN(Number(val.correctAnswer))) return false;

              return val.choices.every(
                (choice) => !isNaN(Number(choice.choiceText))
              );
            } else return true;
          },
          { message: "Correct answer and choices must be a valid number" }
        )
    )
    .min(1, "At least one question is required"),
});

export type QuizFormData = z.infer<typeof quizSchema>;

const useQuizForm = () =>
  useForm<QuizFormData>({
    defaultValues: {
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
    },
    resolver: zodResolver(quizSchema),
  });

export const useFormContextQuiz = () => useFormContext<QuizFormData>();

export const FormProviderQuiz = ({ children }: PropsWithChildren) => {
  const methods = useQuizForm();

  return <FormProvider {...methods}>{children}</FormProvider>;
};
