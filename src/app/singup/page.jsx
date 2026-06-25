"use client";

import Link from "next/link";

import {
  Card,
  CardHeader,
  CardContent as CardBody,
  Input,
  Button,
  Label,
  Form,
} from "@heroui/react";

import { FaUser, FaEnvelope, FaLock, FaImage, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { uploadImage } from "@/utils/uploadImage";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    const imageFile = data.image?.[0];

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      const imageUrl = await uploadImage(imageFile);

      if (!imageUrl) {
        toast.error("Image upload failed");
        return;
      }

      const { data: signUpData, error: signUpError } =
        await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
          image: imageUrl,
          role: data.role,
        });

      if (signUpError) {
        console.log(signUpError);
        toast.error(signUpError.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully");
      router.push("/");

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-10 ">

      <Card className="w-full max-w-xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8">

        {/* HEADER */}
        <CardHeader className="flex flex-col items-center text-center gap-3 pb-8">

          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-pink-500 bg-clip-text text-transparent">
            Create Account
          </h1>

          <p className="text-slate-400 text-sm">
            Digital Life Lessons
          </p>
        </CardHeader>

        {/* BODY */}
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* NAME */}
            <div>
              <Label className="text-slate-300">Full Name</Label>
              <Input
                {...register("name", { required: "Name is Required" })}
                placeholder="John Doe"
                startContent={<FaUser className="text-slate-400" />}
                className="text-white w-full rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 focus-within:border-pink-500 transition"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <Label className="text-slate-300">Email</Label>
              <Input
                {...register("email", { required: "Email is Required" })}
                placeholder="john@example.com"
                type="email"
                startContent={<FaEnvelope className="text-slate-400" />}
                className="text-white w-full rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 focus-within:border-pink-500 transition"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* IMAGE */}
            <div>
              <Label className="text-slate-300">Profile Image</Label>
              <Input
                {...register("image", { required: "Image is Required" })}
                type="file"
                accept="image/*"
                startContent={<FaImage className="text-slate-400" />}
                className="text-white w-full rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 focus-within:border-pink-500 transition"
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <Label className="text-slate-300">Password</Label>
              <Input
                {...register("password", {
                  required: "Password is required",
                })}
                type="password"
                placeholder="••••••••"
                startContent={<FaLock className="text-slate-400" />}
                className="text-white w-full rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 focus-within:border-pink-500 transition"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ROLE */}
            <div>
              <Label className="text-slate-300">Role</Label>
              <select
                {...register("role", { required: "Role is required" })}
                className="w-full mt-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-slate-200 focus:border-pink-500 outline-none transition"
              >
                <option value="user" className="bg-slate-900">
                  User
                </option>
                <option value="Admin" className="bg-slate-900">
                  Admin
                </option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-600 text-white font-bold shadow-lg hover:scale-[1.02] transition"
            >
              Create Account
            </Button>

          </Form>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/10" />
            <span className="mx-4 text-xs text-slate-500">OR</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* GOOGLE */}
          <Button
            variant="bordered"
            className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
            startContent={<FaGoogle className="text-pink-500" />}
          >
            Continue with Google
          </Button>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-pink-500 font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>

        </CardBody>
      </Card>
    </div>
  );
}