import { useAuth } from "@/AuthProvider";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const Route = createFileRoute("/login/")({
  component: Login,
  beforeLoad: ({ context }) => {
    const { isLoggedIn } = context.auth;
    if (isLoggedIn()) {
      throw redirect({
        to: "/profile",
      });
    }
  },
});

type LoginType = {
  username: string;
  password: string;
};

function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>();

  const onSubmit: SubmitHandler<LoginType> = async (data) => {
    setError(null);

    try {
      await handleLogin(data);
      navigate({ to: "/" });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="mx-auto mt-4 card">
      <h2 className="text-2xl font-semibold mb-2">Login</h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-neutral-300"
          >
            Username
          </label>
          <input
            className="input"
            {...register("username", { required: true })}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-300"
          >
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: true })}
          />
        </div>

        {(errors.password || errors.username) && (
          <div className="error">login and username are required</div>
        )}

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      {error && <p className="error mt-4">{error}</p>}
    </div>
  );
}
