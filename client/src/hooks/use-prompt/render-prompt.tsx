"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export interface RenderPromptProps {
  open: boolean;
  title: string;
  description: string;
  variant?: "danger" | "confirmation";
  verificationText?: string;
  verificationInstruction?: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RenderPrompt = ({
  open,
  variant = "danger",
  title,
  description,
  verificationText,
  verificationInstruction = "Please type {val} to confirm:",
  cancelText = "Cancel",
  confirmText = "Confirm",
  onConfirm,
  onCancel,
}: RenderPromptProps) => {
  const [userInput, setUserInput] = React.useState("");

  // Reset input when dialog opens
  React.useEffect(() => {
    if (open) {
      setUserInput("");
    }
  }, [open]);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const validInput = React.useMemo(() => {
    if (!verificationText) {
      return true;
    }
    return userInput === verificationText;
  }, [userInput, verificationText]);

  let instructionParts = verificationInstruction.includes("{val}")
    ? verificationInstruction.split("{val}")
    : ["Please type", "to confirm:"];

  if (instructionParts.length !== 2) {
    instructionParts = ["Please type", "to confirm:"];
  }

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {verificationText && (
          <div>
            <Label htmlFor="verificationText" className="mb-2">
              {instructionParts[0]} {verificationText} {instructionParts[1]}
            </Label>
            <Input
              autoFocus
              autoComplete="off"
              id="verificationText"
              placeholder={verificationText}
              onChange={handleUserInput}
            />
          </div>
        )}
        <AlertDialogFooter>
          <Button variant="outline" onClick={onCancel} size="sm">
            {cancelText}
          </Button>
          <Button
            disabled={!validInput}
            onClick={validInput ? onConfirm : undefined}
            size="sm"
            variant={variant === "danger" ? "destructive" : "default"}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

RenderPrompt.displayName = "RenderPrompt";
