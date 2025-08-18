"use client";
import { useDeleteUser } from "@/api/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePrompt } from "@/hooks/use-prompt/use-prompt";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DangerZone() {
  const router = useRouter();
  const prompt = usePrompt();
  const { mutateAsync: deleteUser } = useDeleteUser();

  async function handleDeleteAccount() {
    const confirmed = await prompt({
      title: "Delete Account",
      description:
        "Are you sure you want to delete your account? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      verificationText: "DELETE",
      verificationInstruction: "Please type DELETE to confirm:",
    });

    if (!confirmed) return;
    await deleteUser();
    toast("Account deleted successfully");
    router.push("/login");
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>All your shortened URLs will be permanently deleted</li>
            <li>Your analytics data will be lost</li>
            <li>This action cannot be undone</li>
          </ul>
        </div>
        <Button onClick={handleDeleteAccount} variant="destructive">
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
