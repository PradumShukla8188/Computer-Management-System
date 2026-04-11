// "use client";

// import Checkbox from "@/components/form/input/Checkbox";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
// import { ApiHitter } from "@/lib/axiosApi/apiHitter";
// import { useMutation } from "@tanstack/react-query";
// import Cookies from "js-cookie";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";

// interface LoginFormValues {
//   email: string;
//   password: string;
//   remember: boolean;
// }

// interface LoginResponse {
//   data?: {
//     success: boolean;
//     token: string;
//     message?: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     role: string;
//   };
// }

// export default function SignInForm() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [submitError, setSubmitError] = useState<string>("");

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors, isValid, isDirty },
//     watch, // Add watch to debug
//   } = useForm<LoginFormValues>({
//     defaultValues: {
//       email: "",
//       password: "",
//       remember: false,
//     },
//     mode: "onBlur", // Change to onChange for immediate validation
//   });

//   // Debug: Watch form values
//   const formValues = watch();

//   const { mutate, isPending } = useMutation({
//     mutationFn: (body: LoginFormValues) =>
//       ApiHitter("POST", "LOGIN_API", body, "", {
//         showSuccess: true,
//         successMessage: "Logged in successfully",
//         showError: true,
//       }),
//     onSuccess: (res: LoginResponse) => {
//       console.log("login success res ==>", res);
//       if (res?.data?.token) {
//         const isProduction = process.env.NODE_ENV === "production";

//         Cookies.set("token", res.data.token, {
//           secure: isProduction,
//           sameSite: "strict",
//           expires: 7,
//         });

//         router.push("/");
//         router.refresh();
//       }
//     },
//     onError: (error: Error) => {
//       setSubmitError(error.message || "An error occurred. Please try again.");
//     },
//   });

//   const onSubmit = (data: LoginFormValues) => {
//     setSubmitError("");
//     mutate(data);
//   };

//   return (
//     <div className="flex w-full flex-1 flex-col lg:w-1/2">
//       <div className="mx-auto mb-5 w-full max-w-md sm:pt-10">
//         <Link
//           href="/"
//           className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
//         >
//           <ChevronLeftIcon />
//           Back to dashboard
//         </Link>
//       </div>

//       <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
//         <div>
//           <div className="mb-5 sm:mb-8">
//             <h1 className="sm:text-title-md mb-2 font-semibold text-gray-800">
//               Sign In
//             </h1>
//             <p className="text-sm text-gray-500">
//               Enter your email and password to sign in!
//             </p>
//           </div>

//           {submitError && (
//             <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
//               <p className="text-sm text-red-600">{submitError}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} noValidate>
//             <div className="space-y-6">
//               {/* Email */}
//               <div>
//                 <Label htmlFor="email">Email *</Label>
//                 <Input
//                   id="email"
//                   placeholder="info@gmail.com"
//                   type="email"
//                   //   autoComplete="email"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: "Invalid email address",
//                     },
//                   })}
//                   error={!!errors.email}
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <Label htmlFor="password">Password *</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     // autoComplete="current-password"
//                     {...register("password", {
//                       required: "Password is required",
//                       minLength: {
//                         value: 6,
//                         message: "Password must be at least 6 characters",
//                       },
//                     })}
//                     error={!!errors.password}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer p-1"
//                     aria-label={
//                       showPassword ? "Hide password" : "Show password"
//                     }
//                   >
//                     {showPassword ? (
//                       <EyeIcon className="h-5 w-5 fill-gray-500" />
//                     ) : (
//                       <EyeCloseIcon className="fill-gray-5 00 h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>

//               {/* Remember Me */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <Controller
//                     name="remember"
//                     control={control}
//                     render={({ field }) => (
//                       <Checkbox
//                         checked={field.value}
//                         onChange={(val) => field.onChange(val)}
//                       />
//                     )}
//                   />
//                   <span className="text-sm text-gray-700 dark:text-gray-400">
//                     Keep me logged in
//                   </span>
//                 </div>

//                 <Link
//                   href="/reset-password"
//                   className="text-brand-500 hover:text-brand-600 text-sm transition-colors"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               {/* Submit */}
//               <div>
//                 <Button
//                   className="w-full"
//                   size="sm"
//                   type="submit"
//                   disabled={isPending || !isValid}
//                   loading={isPending}
//                 >
//                   {isPending ? "Signing in..." : "Sign in"}
//                 </Button>
//               </div>
//             </div>
//           </form>

//           <div className="mt-5 text-center">
//             <p className="text-sm text-gray-700">
//               Don&apos;t have an account?{" "}
//               <Link
//                 href="/signup"
//                 className="text-brand-500 hover:text-brand-600 font-medium transition-colors"
//               >
//                 Sign Up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { ApiHitter } from "@/lib/axiosApi/apiHitter";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  data?: {
    success: boolean;
    token: string;
    message?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: LoginFormValues) =>
      ApiHitter("POST", "LOGIN_API", body, "", {
        showSuccess: true,
        successMessage: "Logged in successfully",
        showError: true,
      }),
    onSuccess: (res: LoginResponse) => {
      console.log("login success res ==>", res);
      if (res?.data?.token) {
        const isProduction = process.env.NODE_ENV === "production";

        Cookies.set("token", res.data.token, {
          secure: isProduction,
          sameSite: "strict",
          expires: 7,
        });

        router.push("/");
        router.refresh();
      }
    },
    onError: (error: Error) => {
      setGeneralError(error.message || "An error occurred. Please try again.");
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setGeneralError("");
    mutate(data);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative flex h-screen w-full">
        {/* Left Side - Login Form */}
        <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="mb-8 md:mb-12">

              <h1 className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                Welcome Back
              </h1>
              <p className="mt-3 text-base text-slate-300">
                Sign in to your account to continue learning
              </p>
            </div>

            {/* Error Alert */}
            {generalError && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4 backdrop-blur-sm">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-200">{generalError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`mt-2 w-full rounded-lg border bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${errors.email
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-slate-600/50 focus:border-blue-500/50 focus:ring-blue-500/50"
                    }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border bg-slate-800/50 px-4 py-3 pr-12 text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${errors.password
                      ? "border-red-500/50 focus:ring-red-500/50"
                      : "border-slate-600/50 focus:border-blue-500/50 focus:ring-blue-500/50"
                      }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 18a8.949 8.949 0 01-4.951-1.488A3.987 3.987 0 0110 13c1.946 0 3.6.99 4.951 2.512A8.949 8.949 0 0110 18zm9.364-5.504a9.047 9.047 0 01-2.255 2.285 10 10 0 01-19.218 0 9.047 9.047 0 012.255-2.285 10 10 0 0119.218 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-blue-500 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                    Keep me signed in
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending || isSubmitting}
                className="mt-8 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {isPending || isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-white">Sign In</span>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="hidden w-1/2 items-center justify-center bg-gradient-to-tl from-blue-600/20 via-indigo-600/10 to-slate-900 p-12 lg:flex">
          <div className="relative h-full w-full max-w-lg">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full border border-blue-400/20"></div>
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full border border-indigo-400/20"></div>

            {/* Image Container */}
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=90"
                alt="Student learning with laptop"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={90}
                priority
              />


              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="text-2xl font-bold text-white">
                  Join Our Learning Community
                </h2>
                <p className="mt-2 text-sm text-blue-100">
                  Access thousands of courses and start your learning journey today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}