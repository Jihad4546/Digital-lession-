"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardContent as CardBody,
  Input,
  Button,
  Label,
  Form,
} from "@heroui/react";

import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { data: signInData, error: signInError } =
        await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

      console.log("LOGIN DATA:", signInData);
      console.log("LOGIN ERROR:", signInError);

      if (signInError) {
        toast.error(signInError.message || "Login failed");
        return;
      }

      toast.success("Login successful");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto">
      <Card className="w-full max-w-md border border-white/5 bg-slate-950/70 backdrop-blur-xl shadow-2xl p-4 mt-24 mb-5">
        
        {/* HEADER */}
        <CardHeader className="flex flex-col gap-1 items-center pb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-pink-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access your account securely
          </p>
        </CardHeader>

        {/* BODY */}
        <CardBody className="gap-4">
          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">

            {/* EMAIL */}
            <Label>Email Address</Label>
            <Input
              {...register("email", { required: "Email is required" })}
              id="email"
              placeholder="john@example.com"
              type="email"
              startContent={<FaEnvelope className="text-slate-400 text-sm" />}
              className="w-full bg-slate-900/50 border-white/10"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}

            {/* PASSWORD */}
            <Label>Password</Label>
            <Input
              {...register("password", { required: "Password is required" })}
              id="password"
              placeholder="••••••••"
              type="password"
              startContent={<FaLock className="text-slate-400 text-sm" />}
              className="w-full bg-slate-900/50 border-white/10"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold h-12"
            >
              Sign In
            </Button>

          </Form>

          {/* DIVIDER */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-white/5" />
            <span className="mx-4 text-xs text-slate-500">
              OR
            </span>
            <div className="flex-grow border-t border-white/5" />
          </div>

          {/* GOOGLE */}
          <Button
            variant="bordered"
            className="w-full border-white/10 text-white"
            startContent={<FaGoogle className="text-pink-500" />}
          >
            Google Account
          </Button>

          {/* SIGNUP LINK */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link
              href="/singup"
              className="text-pink-500 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;