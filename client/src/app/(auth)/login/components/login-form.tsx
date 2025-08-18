"use client";

import { SocialLogin } from "@/components/social-login";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLogin } from "@/api/auth";
import {
  loginDefaultValues,
  LoginInput,
  loginSchema,
} from "@/api/auth/constants";

export function LoginForm() {
  const router = useRouter();
  const { mutateAsync: login } = useLogin();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  async function onSubmit(data: LoginInput) {
    try {
      await login(data);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center sm:text-left">
        <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Eye size={16} />
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm">
              <Link
                href="/register"
                className="text-muted-foreground hover:text-foreground underline text-center sm:text-left"
              >
                Need an account?
              </Link>
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-foreground underline text-center sm:text-left"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={form.formState.isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </Form>

        <Separator className="my-4 sm:my-6">OR</Separator>
        <SocialLogin />
      </CardContent>
    </Card>
  );
}
