"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
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

type Session = {
  id: string;
  name: string;
  messages: { role: "user" | "assistant"; content: string }[];
  mode: string;
  theme: string;
  createdAt: number;
  updatedAt: number;
};

type ChatSidebarProps = {
  currentMode: string;
  currentSessionId: string | null;
  sessions: Session[];
  isTyping: boolean;
  loading: boolean;
  createNewSession: () => void;
  handleChangeMode: (m: string) => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string, e: React.MouseEvent) => void;
  formatDate: (timestamp: number) => string;
};

export function ChatSidebar({
  currentMode,
  currentSessionId,
  sessions,
  isTyping,
  loading,
  createNewSession,
  handleChangeMode,
  loadSession,
  deleteSession,
  formatDate,
}: ChatSidebarProps) {
  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <Button
        variant="default"
        size="sm"
        onClick={createNewSession}
        disabled={isTyping || loading}
        className="text-sm border border-primary/30 h-9 gap-2 bg-secondary shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        <Plus size="16" />
        New Chat
      </Button>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Interview Modes
        </p>
        {[
          "DSA",
          "Backend",
          "Frontend",
          "System Design",
          "Database",
          "Other",
        ].map((m) => {
          const Icon = modeIcons[m as keyof typeof modeIcons] || CirclePlus;

          return (
            <Button
              key={m}
              variant={currentMode === m ? "default" : "ghost"}
              disabled={isTyping || loading}
              className={`w-full justify-start gap-2 ${
                currentMode === m
                  ? "shadow-lg bg-primary/90 hover:bg-primary/80"
                  : "hover:bg-muted/50 backdrop-blur-sm"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => handleChangeMode(m)}
              type="button"
            >
              <Icon size="14" />
              {m}
            </Button>
          );
        })}
      </div>

      <div className="border-t border-border/50 pt-4 flex-1 overflow-y-auto">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Chat History
        </p>
        <div className="space-y-1">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No chats yet
            </p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentSessionId === session.id
                    ? "bg-primary/20 border border-primary/30 shadow-lg backdrop-blur-sm"
                    : "hover:bg-muted/50 backdrop-blur-sm"
                }`}
                onClick={() => {
                  if (isTyping || loading) return;
                  loadSession(session.id);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-xs bg-background/50"
                      >
                        {session.mode}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(session.updatedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {session.messages.length} messages
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      if (isTyping || loading) return;
                      deleteSession(session.id, e);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    aria-label="Delete session"
                    disabled={isTyping || loading}
                  >
                    <Trash2 size="14" className="text-destructive" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
