"use client";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="container max-w-3xl py-12 text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              404
            </div>
            <div className="absolute -top-4 -right-4">
              <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center animate-bounce">
                <AlertCircle className="text-accent" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Oops! The page you&apos;re looking for seems to have vanished into
            thin air. Maybe it was shortened a bit too much?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              className={buttonVariants({ variant: "default", size: "lg" })}
              href="/"
            >
              <Home size={16} />
              Go Home
            </Link>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
          </div>
        </div>

        {/* Fun Stats - maybe add in the future */}
        {/* <div className="mt-8 text-center">
                        <p className="text-xs text-muted-foreground">
                            Fun fact: This 404 page has been viewed <span className="font-mono">1,337</span> times by curious visitors like you!
                        </p>
                    </div> */}
      </div>
    </div>
  );
}
