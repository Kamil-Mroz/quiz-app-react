export interface QuizType {
  id: number;
  title: string;
  description: string;
  category: string;
  timeToSolve: number;
  questions: QuestionType[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  timesSolved: number;
}

export interface QuestionType {
  id: number;
  text: string;
  correctAnswer: string | number | boolean | Date;
  type: "text" | "numeric" | "boolean" | "date";
  choices?: { choiceText: string | number | boolean | Date }[];
}

export interface UserType {
  username: string;
  password: string;
  email: string;
  token: string;
  solvedQuizzes?: SolvedQuizType[];
  achievements: string[];
  correctAnswers: number;
  image: string;
}

export interface SolvedQuizType {
  quizId: number;
  accuracy: number;
}
