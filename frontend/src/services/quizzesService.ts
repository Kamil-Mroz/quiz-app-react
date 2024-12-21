import { Quiz } from "@/types";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { QuizAttempt } from "@/routes/quizzes/$quizId/solve";

const BASE_API_URL = "http://localhost:3000";

export async function getCategories() {
  try {
    const response = await axios.get(`${BASE_API_URL}/quizzes/categories`);
    const data: string[] = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch categories");
  }
}
export async function getQuizzes(params: {
  category: string;
  search: string;
  sortBy: string;
}) {
  try {
    const response = await axios.get<Quiz[]>("http://localhost:3000/quizzes", {
      params,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch quizzes");
  }
}

export async function getQuiz(quizId: number) {
  try {
    const response = await axios.get<Quiz>(`${BASE_API_URL}/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch quizzes");
  }
}

export async function getOwnQuizzes() {
  try {
    const response = await axiosInstance.get<Quiz[]>(`/quizzes/own`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch own quizzes");
  }
}

export async function deleteQuiz(quizId: number) {
  try {
    const response = await axiosInstance.delete(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to deleteQuiz quizzes");
  }
}

export async function fetchLeaderboard() {
  try {
    const response = await axiosInstance.get<
      {
        username: string;
        totalSolvedQuizzes: number;
      }[]
    >(`/leaderboard`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to deleteQuiz quizzes");
  }
}

export async function submitAttempt(formData: QuizAttempt, quizId: number) {
  try {
    const response = await axiosInstance.post<{
      score: number;
      accuracy: number;
      achievementUnlocked: boolean;
    }>(`/quizzes/${quizId}/attempt`, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to submit attempt");
  }
}

export async function getTitles() {
  try {
    const response = await axiosInstance.get<string[]>(
      `/quizzes/all-questions`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch all titles");
  }
}

export async function updateQuiz(quizId: number, data) {
  try {
    await axiosInstance.put(`/quizzes/${quizId}`, data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to update quiz");
  }
}

export async function createQuiz(data) {
  try {
    await axiosInstance.post(`/quizzes`, data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create quiz");
  }
}
