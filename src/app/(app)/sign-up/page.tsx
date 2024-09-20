"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schema/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/signup", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/login");
    } catch (error) {
      console.error("Error in signin", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Unsuccessful",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
    // Handle form submission here, data will be the validated form data

    console.log("Form submitted:", data);
  };

  // Function to toggle the visibility of the password
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Plain Slate Color */}

      <div className="hidden md:flex items-center justify-center bg-slate-800 h-screen">
        <h2 className="text-center text-white text-7xl font-bold">TaskFlow</h2>
      </div>

      {/* Right side - Signup form */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        {/* Heading at the top */}
        <h2 className="text-3xl font-bold text-black">Create an account</h2>
        <p className="text-gray-500 text-sm mb-6">
          Keep track of all your tasks here
        </p>

        {/* Form container */}
        <div className="w-full max-w-sm p-8 space-y-6 bg-gray-100 rounded-lg shadow-md">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="username" className="block text-slate-800">
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register("username")}
                className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-slate-800">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-800">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message?.toString()}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-5 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
