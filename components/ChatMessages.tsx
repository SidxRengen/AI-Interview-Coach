"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import {
  Zap,
  Server,
  Monitor,
  LayoutGrid,
  Database,
  CirclePlus,
} from "lucide-react";

const modeIcons = {
  DSA: Zap,
  Backend: Server,
  Frontend: Monitor,
  "System Design": LayoutGrid,
  Database: Database,
  Other: CirclePlus,
};

type Message = { role: "user" | "assistant"; content: string };

type ChatMessagesProps = {
  messages: Message[];
  currentMode: string;
  isTyping: boolean;
  typingMessage: string;
  loading: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
};

export function ChatMessages({
  messages,
  currentMode,
  isTyping,
  typingMessage,
  loading,
  scrollRef,
}: ChatMessagesProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const IconComponent =
    modeIcons[currentMode as keyof typeof modeIcons] || CirclePlus;

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden relative">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
      >
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4 max-w-md">
                <div
                  suppressHydrationWarning
                  className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-xl flex items-center justify-center"
                >
                  {isHydrated && (
                    <IconComponent size={48} className="text-primary" />
                  )}
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Welcome to SDE Interview Coach
                </h2>
                <p className="text-muted-foreground">
                  Choose a mode from the sidebar and start practicing your
                  interview skills.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] ${msg.role === "user" ? "order-2" : "order-1"}`}
              >
                <Card
                  className={`p-4 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-card to-card/80 border-primary/20 backdrop-blur-sm shadow-lg"
                      : "bg-primary/10 border-primary/20 backdrop-blur-sm"
                  } border shadow-md`}
                >
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </Card>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="max-w-[80%]">
                <Badge variant="default" className="mb-2 backdrop-blur-sm">
                  {currentMode}
                </Badge>
                <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-primary/20 backdrop-blur-sm shadow-lg">
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap text-foreground leading-relaxed">
                    <ReactMarkdown>{typingMessage}</ReactMarkdown>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="max-w-[80%]">
                <Badge variant="default" className="mb-2 backdrop-blur-sm">
                  {currentMode}
                </Badge>
                <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-primary/20 backdrop-blur-sm shadow-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Thinking</span>
                    <span className="flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
