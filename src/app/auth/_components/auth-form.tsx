"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

export function AuhtForm() {
  const form = useForm();

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log(data);
    await signIn("email", { email: data.email });
  });

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Magic Link Login</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email below and ll send you a magic link to log in
            instantly, no password required.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              {...form.register("email")}
            />
          </div>
          <Button type="submit" className="w-full">
            Send Magic Link
          </Button>
        </form>
      </div>
    </div>
  );
}
