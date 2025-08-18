"use client";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Background } from "@/components/background";
import { useLogout } from "@/api/auth";

export default function LogoutPage() {
  const router = useRouter();
  const { mutateAsync: logout } = useLogout();

  useEffect(() => {
    (async () => {
      try {
        await logout();
      } catch {
      } finally {
        router.push("/login");
      }
    })();
  }, [logout, router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Background />
      <div className="text-center space-y-6">
        <Loader2 className="h-12 w-12 animate-spin mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Logging you out...</h1>
          <p className="">Please wait while we securely sign you out</p>
        </div>
      </div>
    </div>
  );
}
