import { useAuth } from "@/AuthProvider";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const Route = createFileRoute("/register/")({
  component: Register,
  beforeLoad: ({ context }) => {
    const { isLoggedIn } = context.auth;
    if (isLoggedIn()) {
      throw redirect({
        to: "/profile",
      });
    }
  },
});

type RegisterType = {
  username: string;
  email: string;
  password: string;
};

function Register() {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>();

  const onSubmit: SubmitHandler<RegisterType> = async (data) => {
    setError(null);
    try {
      await handleRegister(data);
      navigate({ to: "/login" });
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
      <h2 className="text-2xl font-semibold mb-2">Register</h2>

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
            {...register("username", {
              required: { value: true, message: "This field is required" },
              minLength: {
                value: 3,
                message: "Must contain at least 3 characters",
              },
            })}
          />
          {errors.username && (
            <div className="error">{errors.username?.message}</div>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-300"
          >
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: { value: true, message: "This field is required" },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Must be a valid email",
              },
            })}
          />
          {errors.email && <div className="error">{errors.email.message}</div>}
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
            {...register("password", {
              required: { value: true, message: "This field is required" },
              pattern: {
                value:
                  /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{6,}$/,
                message: "Must contain at least one special character",
              },
              minLength: {
                value: 6,
                message: "Must contain at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <div className="error">{errors.password.message}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      {error && <p className="error mt-4">{error}</p>}
    </div>
  );
}
