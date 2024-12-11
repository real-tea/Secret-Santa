'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  name: string;
}

export function CodeModal({ isOpen, onClose, code, name }: CodeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Secret Code for {name}</DialogTitle>
          <DialogDescription>
            Keep this code safe! You'll need it to log in and see your Secret Santa assignment.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="bg-secondary p-4 rounded-lg flex-1 font-mono text-center">
            {code}
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={handleCopy}
            className="flex-shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {copied && (
          <p className="text-sm text-muted-foreground text-center">
            Code copied to clipboard!
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}