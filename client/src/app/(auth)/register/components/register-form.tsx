"use client"

import { SocialLogin } from "@/components/social-login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateUser } from "@/api/user";
import { createUserDefaultValues, CreateUserInput, createUserSchema } from "@/api/user/constants";
import { useLogin } from "@/api/auth";

export function RegisterForm() {
    const router = useRouter();
    const { mutateAsync: createUser } = useCreateUser()
    const { mutateAsync: login } = useLogin();

    const form = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema),
        defaultValues: createUserDefaultValues
    });

    async function onSubmit(data: CreateUserInput) {
        try {
            await createUser(data);
            await login(data)
            router.push("/dashboard");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card>
            <CardHeader className="text-center sm:text-left">
                <CardTitle className="text-xl sm:text-2xl">Create Account</CardTitle>
                <CardDescription>
                    Fill in your details to create your account
                </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                                            type='password'
                                            placeholder="Create a strong password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="text-xs text-muted-foreground text-center sm:text-left">
                            By creating an account, you agree to our{" "}
                            <Link href="/privacy" className="underline" >
                                Privacy Policy
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            loading={form.formState.isSubmitting}
                        >
                            Create Account
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-foreground hover:underline font-medium">
                        Sign in
                    </Link>
                </div>

                <Separator className="my-4 sm:my-6" >
                    OR
                </Separator>
                <SocialLogin />
            </CardContent>
        </Card>
    );
}
