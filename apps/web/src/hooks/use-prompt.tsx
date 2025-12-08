import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldControl, FieldLabel } from "@/components/ui/field";

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "destructive"
  | "destructive-outline";

interface PromptConfig {
  title: string;
  description: string;
  variant?: ButtonVariant;
  verificationText?: string;
  verificationPlaceholder?: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => Promise<void> | void;
}

interface PromptContextValue {
  prompt: (config: PromptConfig) => Promise<boolean>;
}

const PromptContext = React.createContext<PromptContextValue | null>(null);

interface PromptDialogProps {
  open: boolean;
  config: PromptConfig;
  onConfirm: () => void;
  onCancel: () => void;
}

const PromptDialog = React.memo(
  ({ open, config, onConfirm, onCancel }: PromptDialogProps) => {
    // We intentionally keep local input/isProcessing state here and rely on the
    // parent to remount this component on each open (via a changing `key`). That
    // avoids calling setState inside useEffect to reset state and keeps the
    // component lifecycle straightforward.
    const [input, setInput] = React.useState("");
    const [isProcessing, setIsProcessing] = React.useState(false);

    const {
      title,
      description,
      variant = "default",
      verificationText,
      verificationPlaceholder,
      cancelText = "Cancel",
      confirmText = "Confirm",
      onConfirm: asyncOnConfirm,
    } = config;

    const isValid = verificationText ? input === verificationText : true;

    const handleConfirm = async () => {
      if (!isValid || isProcessing) {
        return;
      }

      if (asyncOnConfirm) {
        try {
          setIsProcessing(true);
          await asyncOnConfirm();
          onConfirm();
        } catch (_error) {
          setIsProcessing(false);
        }
      } else {
        onConfirm();
      }
    };

    return (
      <Dialog
        onOpenChange={(openState: boolean) => !openState && onCancel()}
        open={open}
      >
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {verificationText ? (
            <DialogPanel>
              <Field>
                <FieldLabel className="gap-0">
                  Please type <strong>{verificationText}</strong> to confirm
                </FieldLabel>
                <FieldControl
                  autoComplete="off"
                  disabled={isProcessing}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInput(e.target.value)
                  }
                  placeholder={verificationPlaceholder || verificationText}
                  type="text"
                  value={input}
                />
              </Field>
            </DialogPanel>
          ) : null}

          <DialogFooter>
            <Button
              disabled={isProcessing}
              onClick={onCancel}
              size="sm"
              variant="ghost"
            >
              {cancelText}
            </Button>
            <Button
              disabled={!isValid || isProcessing}
              onClick={handleConfirm}
              size="sm"
              variant={variant}
            >
              {isProcessing ? "Processing..." : (confirmText ?? "")}
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    );
  }
);

PromptDialog.displayName = "PromptDialog";

export const PromptProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<PromptConfig | null>(null);
  const pendingResolve = React.useRef<((value: boolean) => void) | null>(null);
  // Prevent immediate unmount so exit animations can run. Duration should match
  // the dialog CSS transition (200ms in the dialog styles).
  const CLOSE_ANIMATION_MS = 220;
  const closeTimerRef = React.useRef<number | null>(null);
  const isClosingRef = React.useRef(false);

  const openIdRef = React.useRef(0);

  const prompt = React.useCallback((cfg: PromptConfig): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // If a prompt is already open or we're in the short closing window, reject
      // immediately. This preserves the single-prompt concurrency model and
      // avoids races while the dialog exit animation completes.
      if (pendingResolve.current || isClosingRef.current) {
        reject(new Error("A prompt is already open"));
        return;
      }
      pendingResolve.current = resolve;
      // Bump the open id so the dialog will be remounted and local state
      // (input/isProcessing) is reset when opening.
      openIdRef.current += 1;
      // If we were running a close timer, clear it because we're opening a new
      // prompt immediately.
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
        isClosingRef.current = false;
      }

      setConfig(cfg);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    pendingResolve.current?.(true);
    pendingResolve.current = null;
    // Start closing animation
    setIsOpen(false);
    // Mark as closing so we don't allow a new prompt during exit animation
    isClosingRef.current = true;
    // Delay unmount so exit animation can run
    closeTimerRef.current = window.setTimeout(() => {
      setConfig(null);
      isClosingRef.current = false;
      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  }, []);

  const handleCancel = React.useCallback(() => {
    pendingResolve.current?.(false);
    pendingResolve.current = null;
    // Start closing animation
    setIsOpen(false);
    isClosingRef.current = true;
    closeTimerRef.current = window.setTimeout(() => {
      setConfig(null);
      isClosingRef.current = false;
      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  }, []);

  // Cleanup on unmount: resolve pending promise as false to avoid leaks.
  React.useEffect(
    () => () => {
      pendingResolve.current?.(false);
      pendingResolve.current = null;
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    },
    []
  );

  const contextValue = React.useMemo(() => ({ prompt }), [prompt]);

  return (
    <PromptContext value={contextValue}>
      {children}
      {config ? (
        <PromptDialog
          config={config}
          key={openIdRef.current}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          open={isOpen}
        />
      ) : null}
    </PromptContext>
  );
};

PromptProvider.displayName = "PromptProvider";

export const usePrompt = (): PromptContextValue["prompt"] => {
  const context = React.use(PromptContext);

  if (!context) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }

  return context.prompt;
};
