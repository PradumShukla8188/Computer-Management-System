"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
  };
  message?: string;
}

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    watch, // Add watch to debug
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onBlur", // Change to onChange for immediate validation
  });

  // Debug: Watch form values
  const formValues = watch();
  console.log("Form values:", formValues);
  console.log("Form errors:", errors);
  console.log("Is form valid?", isValid);

  const { mutate, isPending } = useMutation({
    mutationFn: (body: LoginFormValues) =>
      ApiHitter("POST", "LOGIN_API", body, "", {
        showSuccess: true,
        successMessage: "Logged in successfully",
        showError: true,
      }),
    onSuccess: (res: LoginResponse) => {
      if (res?.success && res?.data?.token) {
        const isProduction = process.env.NODE_ENV === "production";

        Cookies.set("token", res.data.token, {
          secure: isProduction,
          sameSite: "strict",
          expires: 7,
        });

        router.push("/");
        router.refresh();
      } else {
        setSubmitError(res?.message || "Login failed. Please try again.");
      }
    },
    onError: (error: Error) => {
      setSubmitError(error.message || "An error occurred. Please try again.");
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setSubmitError("");
    mutate(data);
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500">
              Enter your email and password to sign in!
            </p>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  placeholder="info@gmail.com"
                  type="email"
                  //   autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  error={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    // autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    error={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 w-5 h-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-5 00 w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>

                <Link
                  href="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  type="submit"
                  disabled={isPending || !isValid}
                  loading={isPending}
                >
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>

                {/* Debug info */}
                <div className="mt-2 text-xs text-gray-500">
                  <p>Form valid: {isValid ? "Yes" : "No"}</p>
                  <p>Email: {formValues.email || "(empty)"}</p>
                  <p>Password length: {formValues.password?.length || 0}</p>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-700">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-brand-500 hover:text-brand-600 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
