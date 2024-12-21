import { useAuth } from "@/AuthProvider";
import Achievements from "@/components/Achievements";
import { createProfilePictureUrl } from "@/lib/utils";
import { getProfile, uploadProfileImage } from "@/services/authService";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export const Route = createFileRoute("/profile/")({
  component: Profile,
  beforeLoad: ({ context }) => {
    const { isLoggedIn } = context.auth;
    if (!isLoggedIn) {
      throw redirect({ to: "/login" });
    }
  },
});

type FormData = {
  profileImage: FileList;
};

function Profile() {
  const { currentUser } = useAuth();

  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();
  const [stats, setStats] = useState<{
    totalQuizzesSolved: number;
    accuracy: number;
  }>();
  const [achievements, setAchievements] = useState<
    {
      name: string;
      description: string;
      url: string;
    }[]
  >();

  useEffect(() => {
    async function getUserProfile() {
      try {
        const { stats, achievements } = await getProfile();
        setStats(stats);
        setAchievements(achievements);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    }

    async function fetchProfilePicture() {
      try {
        if (currentUser?.image) {
          const objectUrl = await createProfilePictureUrl(currentUser.image);
          setProfilePictureUrl(objectUrl);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    }

    (async () => {
      try {
        await Promise.all([getUserProfile(), fetchProfilePicture()]);
      } catch (error) {
        console.error("Error during initial data fetch:", error);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (profilePictureUrl) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [currentUser?.image, profilePictureUrl]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError(null);
    if (data.profileImage?.[0]) {
      const formData = new FormData();
      formData.append("file", data.profileImage[0]);
      try {
        const response = await uploadProfileImage(formData);
        alert(response.message);
        if (response.profilePicture) {
          const objectUrl = await createProfilePictureUrl(
            response.profilePicture
          );
          setProfilePictureUrl(objectUrl);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold text-center text-white mb-6">
        Profile
      </h1>
      {error && <div className="text-red-600 mb-6 text-center">{error}</div>}
      {loading && (
        <div className="text-center text-neutral-500 mt-8">
          <p className="text-lg">Loading profile...</p>
        </div>
      )}

      <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-600 gird items-center mb-6">
        {profilePictureUrl && (
          <img
            src={profilePictureUrl}
            alt="Profile Picture"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        )}
        {(!currentUser?.image || !profilePictureUrl) && (
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor="profileImage">Upload Profile Image:</label>
            <Controller
              name="profileImage"
              control={control}
              rules={{ required: "Profile image is required" }}
              render={({ field }) => (
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              )}
            />
            {errors.profileImage && (
              <span className="error">{errors.profileImage.message}</span>
            )}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 rounded-md p-2 cursor-pointer text-white disabled:bg-gray-500"
            >
              Upload
            </button>
          </form>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {currentUser && (
          <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-600">
            <>
              <h2 className="text-xl font-semibold text-neutral-100 mb-4">
                User Information
              </h2>
              <div className="space-y-3">
                <p>
                  <span className="font-medium text-neutral-500">
                    Username:
                  </span>
                  <span className="text-neutral-100">
                    {currentUser.username}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-neutral-500">Email:</span>
                  <span className="text-neutral-100">{currentUser.email}</span>
                </p>
              </div>
            </>
          </div>
        )}

        {stats && (
          <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-600">
            <h2 className="text-xl font-semibold text-neutral-100 mb-4">
              Statistics
            </h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium text-neutral-500">
                  Total Quizzes Solved:
                </span>
                <span className="text-neutral-100">
                  {stats.totalQuizzesSolved}
                </span>
              </p>
              <p>
                <span className="font-medium text-neutral-500">Accuracy:</span>
                <span className="text-neutral-100">
                  {new Intl.NumberFormat("en-US", {
                    style: "percent",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(stats.accuracy / 100)}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
      {achievements && achievements.length > 0 && (
        <Achievements achievements={achievements} />
      )}
    </div>
  );
}
