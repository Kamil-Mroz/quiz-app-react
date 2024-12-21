import { getProfilePicture } from "@/services/authService";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function createProfilePictureUrl(image: string): Promise<string> {
  try {
    const blob = await getProfilePicture(image);
    return URL.createObjectURL(blob);
  } catch {
    throw new Error("Failed to load profile picture");
  }
}
