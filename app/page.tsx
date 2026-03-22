"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatComposer } from "@/components/ChatComposer";
import { PanelRight } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatSession = {
  id: string;
  name: string;
  messages: Message[];
  mode: string;
  theme: string;
  createdAt: number;
  updatedAt: number;
};

const modes = {
  DSA: "blue-theme",
  Backend: "green-theme",
  Frontend: "pink-theme",
  "System Design": "violet-theme",
  Database: "orange-theme",
  Other: "red-theme",
};

// Helper function to generate unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function Page() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState("DSA");
  const [theme, setTheme] = useState("blue-theme");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [typingMessage, setTypingMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isInitialLoad = useRef(true);
  const isUpdating = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const loadSessions = () => {
      try {
        const savedSessions = localStorage.getItem("chatSessions");
        if (savedSessions) {
          const parsedSessions: ChatSession[] = JSON.parse(savedSessions);
          setSessions(parsedSessions);

          if (parsedSessions.length > 0) {
            // Load the most recently updated session
            const mostRecent = [...parsedSessions].sort(
              (a, b) => b.updatedAt - a.updatedAt,
            )[0];
            setCurrentSessionId(mostRecent.id);
            setMessages(mostRecent.messages);
            setMode(mostRecent.mode);
            setTheme(mostRecent.theme);
          } else {
            createNewSession(true);
          }
        } else {
          createNewSession(true);
        }
      } catch (error) {
        console.error("Error loading sessions:", error);
        createNewSession(true);
      }
    };

    loadSessions();
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (sessions.length > 0) {
      localStorage.setItem("chatSessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (!currentSessionId || isUpdating.current) return;

    isUpdating.current = true;

    setSessions((prevSessions) => {
      const updatedSessions = prevSessions.map((session) => {
        if (session.id === currentSessionId) {
          const updatedSession = {
            ...session,
            messages: messages,
            mode: mode,
            theme: theme,
            updatedAt: Date.now(),
            name:
              messages.length > 0 && session.name === "New Chat"
                ? messages[0].content.slice(0, 30) +
                  (messages[0].content.length > 30 ? "..." : "")
                : session.name,
          };
          return updatedSession;
        }
        return session;
      });
      return updatedSessions;
    });

    setTimeout(() => {
      isUpdating.current = false;
    }, 100);
  }, [messages, mode, theme, currentSessionId]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const htmlElement = document.documentElement;

      if (!htmlElement.classList.contains("dark")) {
        htmlElement.classList.add("dark");
      }

      const themeClasses = [
        "blue-theme",
        "violet-theme",
        "orange-theme",
        "green-theme",
        "pink-theme",
        "red-theme",
      ];

      htmlElement.classList.remove(...themeClasses);

      if (theme && themeClasses.includes(theme)) {
        htmlElement.classList.add(theme);
      } else {
        htmlElement.classList.add("blue-theme");
      }
    }
  }, [theme]);

  const createNewSession = useCallback(
    (force = false) => {
      if (!force && messages.length === 0) {
        return;
      }
      const now = Date.now();
      const newSession: ChatSession = {
        id: generateId(),
        name: "New Chat",
        messages: [],
        mode: "DSA",
        theme: "blue-theme",
        createdAt: now,
        updatedAt: now,
      };

      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      setMode("DSA");
      setTheme("blue-theme");
    },
    [messages],
  );

  const loadSession = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setCurrentSessionId(session.id);
        setMessages(session.messages);
        setMode(session.mode);
        setTheme(session.theme);
      }
    },
    [sessions],
  );

  const deleteSession = useCallback(
    (sessionId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));

      if (sessionId === currentSessionId) {
        const remainingSessions = sessions.filter((s) => s.id !== sessionId);
        if (remainingSessions.length > 0) {
          loadSession(remainingSessions[0].id);
        } else {
          createNewSession(true);
        }
      }
    },
    [currentSessionId, sessions, loadSession, createNewSession],
  );

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const historyForContext = newMessages.slice(-10);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          mode,
          history: historyForContext,
        }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setIsTyping(true);
      setTypingMessage("");

      const fullText = data.reply;
      let index = 0;

      const interval = setInterval(() => {
        index++;
        setTypingMessage(fullText.slice(0, index));

        if (index >= fullText.length) {
          clearInterval(interval);
          setIsTyping(false);

          const assistantMessage: Message = {
            role: "assistant",
            content: fullText,
          };

          setMessages([...newMessages, assistantMessage]);
          setTypingMessage("");
        }
      }, 20);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, mode]);

  const handleChangeMode = useCallback((m: string) => {
    const selectedTheme = modes[m as keyof typeof modes] || "blue-theme";
    setMode(m);
    setTheme(selectedTheme);
  }, []);

  const formatDate = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const currentMode = currentSession?.mode || mode;

  const sidebarClasses = showSidebar
    ? "fixed inset-y-0 left-0 w-full md:relative md:w-80 z-40"
    : "fixed inset-y-0 left-0 w-0 md:relative md:w-0 overflow-hidden z-40";

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5 text-foreground relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="p-4 flex gap-4 items-center text-xl font-bold">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            disabled={isTyping || loading}
            className="hover:bg-muted/50 rounded-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PanelRight size="18" />
          </Button>
          <span className=" text-white bg-clip-text text-transparent">
            Interview Coach
          </span>
          <div className="flex-1" />
          <Badge
            variant="outline"
            className="backdrop-blur-sm bg-background/50"
          >
            {currentMode} Mode
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div
          className={`fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity duration-300 ${
            showSidebar
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowSidebar(false)}
        />

        <div
          className={`${sidebarClasses} border-r border-border/50 backdrop-blur-xl bg-background/40 transition-all duration-300 overflow-hidden`}
        >
          <ChatSidebar
            currentMode={currentMode}
            currentSessionId={currentSessionId}
            sessions={sessions}
            isTyping={isTyping}
            loading={loading}
            createNewSession={createNewSession}
            handleChangeMode={handleChangeMode}
            loadSession={loadSession}
            deleteSession={deleteSession}
            formatDate={formatDate}
          />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden mx-auto">
          <ChatMessages
            messages={messages}
            currentMode={currentMode}
            isTyping={isTyping}
            typingMessage={typingMessage}
            loading={loading}
            scrollRef={scrollRef}
          />
          <ChatComposer
            currentMode={currentMode}
            input={input}
            onInputChange={setInput}
            sendMessage={sendMessage}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
