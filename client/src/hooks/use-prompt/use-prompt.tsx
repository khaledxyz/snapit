"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { RenderPrompt, RenderPromptProps } from "./render-prompt";

type UsePromptProps = Omit<
  RenderPromptProps,
  "onConfirm" | "onCancel" | "open"
>;

const usePrompt = () => {
  const prompt = async (props: UsePromptProps): Promise<boolean> => {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);
      const root = createRoot(container);

      const cleanup = () => {
        root.unmount();
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      };

      const onCancel = () => {
        cleanup();
        resolve(false);
      };

      const onConfirm = () => {
        cleanup();
        resolve(true);
      };

      root.render(
        <RenderPrompt
          open={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
          {...props}
        />,
      );
    });
  };

  return prompt;
};

export { usePrompt };
