import { useState } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useCopyToClipboard, useTimeout } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";

export function CopyButton({
  content,
  helperText,
}: {
  content: string;
  helperText: string;
}) {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const COPY_RESET_DELAY_MS = 1500;
  useTimeout(() => setCopied(false), copied ? COPY_RESET_DELAY_MS : null);

  const handleCopy = () => {
    copy(content);
    setCopied(true);
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button onClick={handleCopy} size="icon" variant="outline" />}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </TooltipTrigger>
      <TooltipPopup>{helperText}</TooltipPopup>
    </Tooltip>
  );
}
