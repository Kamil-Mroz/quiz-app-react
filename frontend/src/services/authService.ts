import { User } from "@/types";
import axios from "axios";
import axiosInstance from "./axiosInstance";

const BASE_API_URL = "http://localhost:3000";

export async function login(userData: { username: string; password: string }) {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/login`,
      {
        ...userData,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data: { user: User; authToken: string } = response.data;
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const errorMessage = err.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to login user");
  }
}

export async function register(userData: {
  username: string;
  password: string;
  email: string;
}) {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/register`,
      {
        ...userData,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data: { message: string } = response.data;
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const errorMessage = err.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to register user");
  }
}

export async function getUserApi(token: string) {
  try {
    const response = await axios.get(`${BASE_API_URL}/user`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch {
    /* empty */
  }
}

export async function getProfile() {
  try {
    const response = await axiosInstance.get(`/profile`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch profile");
  }
}

export async function getProfilePicture(profilePicture: string): Promise<Blob> {
  try {
    const response = await axiosInstance.get(
      `/profilePicture/${profilePicture}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to load profile picture");
  }
}

export async function uploadProfileImage(
  formData: FormData
): Promise<{ message: string; profilePicture: string }> {
  try {
    const response = await axiosInstance.post("/uploadImage", formData, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "An error occurred";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to load profile picture");
  }
}
