"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center max-w-md mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
          <p className="text-muted-foreground text-center text-sm mt-2">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button className="w-full" type="submit" disabled>
              Send Reset Link
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
