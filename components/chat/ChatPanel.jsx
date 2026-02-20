import { useState, useEffect } from "react";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function ChatPanel({
  onClose,
  streak = null,
  weeklyActivities = [],
  skills = [],
}) {
 const [messages, setMessages] = useState(() => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("skillmutant_chat");
  return saved
    ? JSON.parse(saved)
    : [
        {
          role: "assistant",
          content: "Hi 👋 I’m here to help. Ask me anything.",
        },
      ];
});

useEffect(() => {
  if (messages.length) {
    localStorage.setItem(
      "skillmutant_chat",
      JSON.stringify(messages)
    );
  }
}, [messages]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [theme, setTheme] = useState("cyan"); // cyan | purple | green

  /* ---------------- SEND MESSAGE (UNCHANGED CORE) ---------------- */
  const sendMessage = async text => {
    const question = (text ?? input).trim();
    if (!question) return;

    const systemMessage = {
      role: "system",
      content: `
You are an AI assistant inside SkillMutant.

You can:
- Explain SkillMutant features
- Answer general programming and learning questions

Context:
- Page: Progress
- Streak: ${streak ?? "unknown"}
- Weekly activities: ${weeklyActivities.length}
- Skills: ${
        skills.length
          ? skills.map(s => s.skill).join(", ")
          : "none yet"
      }
`,
    };

    const newMessages = [
      systemMessage,
      ...messages.slice(-4),
      { role: "user", content: question },
    ];

    setMessages(prev => [
      ...prev,
      { role: "user", content: question },
      { role: "assistant", content: "" },
    ]);

    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        let data;
        try {
          data = JSON.parse(line);
        } catch {
          continue;
        }

        if (data.message?.content) {
          assistantText += data.message.content;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantText,
            };
            return updated;
          });
        }
      }
    }

    setLoading(false);
  };

  /* ---------------- THEMES ---------------- */
  const themes = {
    cyan: "from-cyan-400 to-indigo-500",
    purple: "from-purple-400 to-fuchsia-500",
    green: "from-emerald-400 to-lime-500",
  };

  /* ---------------- MINIMIZED PILL ---------------- */
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className={`fixed bottom-6 right-6 px-5 py-3 rounded-full
                    bg-gradient-to-br ${themes[theme]}
                    text-black font-medium shadow-xl z-50`}
      >
        💬 Chat
      </button>
    );
  }
 const clearChat = () => {
  const fresh = [
    {
      role: "assistant",
      content: "Chat cleared ✅ How can I help you now?",
    },
  ];
  setMessages(fresh);
  localStorage.removeItem("skillmutant_chat");
};

  return (
    <div
      className="fixed bottom-24 right-4 sm:right-6
                 w-[92vw] sm:w-[380px]
                 h-[70vh] sm:h-[520px]
                 bg-[#020617]/95 backdrop-blur-2xl
                 border border-white/10
                 rounded-3xl shadow-2xl
                 flex flex-col overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full
                        bg-gradient-to-br ${themes[theme]}
                        flex items-center justify-center
                        text-black font-bold`}
          >
            AI
          </div>
          <div>
            <p className="text-sm font-semibold">
              SkillMutant Assistant
            </p>
            <p className="text-xs text-slate-400">
              App help • Coding • Doubts
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Theme switch */}
          {["cyan", "purple", "green"].map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`w-4 h-4 rounded-full ${
                t === "cyan"
                  ? "bg-cyan-400"
                  : t === "purple"
                  ? "bg-purple-400"
                  : "bg-emerald-400"
              }`}
            />
          ))}

          <button
            onClick={() => setMinimized(true)}
            className="text-slate-400 hover:text-white"
          >
            X
          </button>
          <button
  onClick={clearChat}
  className="text-xs px-2 py-1 rounded-md
             border border-white/10
             text-slate-400 hover:text-white"
>
  Clear
</button>

        </div>
      </div>

      {/* Suggested prompts */}
      <div className="px-5 py-3 flex gap-2 flex-wrap border-b border-white/10">
        {[
          "Why is my streak 0?",
          "How does Skill Progress work?",
          "Why no weekly activity?",
        ].map(q => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="text-xs px-3 py-1.5 rounded-full
                       bg-white/5 border border-white/10
                       hover:bg-white/10"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[82%] px-4 py-3 text-sm rounded-3xl
              ${
                m.role === "user"
                  ? "ml-auto bg-white/10 text-right"
                  : "mr-auto bg-white/5"
              }`}
          >
            <ReactMarkdown
  components={{
    code({ inline, className, children }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      if (inline) {
        return (
          <code className="bg-black/30 px-1 rounded">
            {children}
          </code>
        );
      }

      return (
        <div className="relative">
          <button
            onClick={() =>
              navigator.clipboard.writeText(codeString)
            }
            className="absolute top-2 right-2 text-xs
                       bg-black/50 px-2 py-1 rounded
                       text-slate-300 hover:text-white"
          >
            Copy
          </button>

          <SyntaxHighlighter
            style={oneDark}
            language={match?.[1] || "text"}
            PreTag="div"
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    },
  }}
>
  {m.content}
</ReactMarkdown>

          </div>
        ))}

        {loading && (
          <div className="text-xs text-slate-400">
            Thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex gap-2 bg-white/5 rounded-2xl px-3 py-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button
            onClick={() => sendMessage()}
            className={`px-4 rounded-xl
                        bg-gradient-to-br ${themes[theme]}
                        text-black font-medium`}
          >
            Send
          </button>

        </div>
      </div>
    </div>
  );
}
