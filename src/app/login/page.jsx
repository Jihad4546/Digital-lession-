"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa6";
import {
  Card,
  CardHeader,
  CardContent as CardBody,
  Input,
  Button,
  Label,
} from "@heroui/react";

import { FaEnvelope, FaLock } from "react-icons/fa";
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

  const handleGoogleSignup = async () => {
    await authClient.signIn.social({ provider: "google" });
  };

  return (
    <div className="mx-auto">
      <Card className="w-full max-w-md border border-white/5 bg-slate-950/70 backdrop-blur-xl shadow-2xl p-4 mt-24 mb-5">

        <CardHeader className="flex flex-col gap-1 items-center pb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-pink-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access your account securely
          </p>
        </CardHeader>

        <CardBody className="gap-4">
          {/* ✅ plain <form> ব্যবহার করো, HeroUI Form নয় */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">

            <div className="flex flex-col gap-1">
              <Label>Email Address</Label>
              <Input
                {...register("email", { required: "Email is required" })}
                placeholder="john@example.com"
                type="email"
                startContent={<FaEnvelope className="text-slate-400 text-sm" />}
                className="w-full bg-slate-900/50 border-white/10"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Password</Label>
              <Input
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                type="password"
                startContent={<FaLock className="text-slate-400 text-sm" />}
                className="w-full bg-slate-900/50 border-white/10"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold h-12"
            >
              Sign In
            </Button>

          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-white/5" />
            <span className="mx-4 text-xs text-slate-500">OR</span>
            <div className="flex-grow border-t border-white/5" />
          </div>

          <Button
            onClick={handleGoogleSignup}
            variant="bordered"
            className="w-full border-white/10 text-white bg-white/5 transition-all duration-300 ease-in-out hover:border-pink-500/40 hover:bg-pink-500/10 hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]"
            startContent={
              <span className="flex items-center justify-center min-w-[20px] min-h-[20px]">
                <FaGoogle size={18} className="text-pink-500 block" />
              </span>
            }
          >
            Login With Google Account
          </Button>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link href="/singup" className="text-pink-500 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;