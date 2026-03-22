"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatComposerProps = {
  currentMode: string;
  input: string;
  onInputChange: (value: string) => void;
  sendMessage: () => void;
  loading: boolean;
};

export function ChatComposer({
  currentMode,
  input,
  onInputChange,
  sendMessage,
  loading,
}: ChatComposerProps) {
  return (
    <div className="sticky bottom-3 p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 p-2">
              <Input
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/60 text-base"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={`Ask your ${currentMode} interview question...`}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
                disabled={loading}
              />
              <Button
                variant="default"
                size="icon"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                type="button"
                className="rounded-xl h-10 w-10 shadow-lg hover:shadow-xl transition-all"
              >
                <span>➤</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
