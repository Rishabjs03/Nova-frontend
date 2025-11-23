"use client";

import React, { useState, useRef, useEffect } from "react";
import { text_agent } from "../api/text_agent";

export default function TextAgent() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What can I ask you to do?",
    "Which one of my projects is performing the best?",
    "What projects should I be concerned about right now?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", text: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await text_agent(text);
      const aiText = reply.response || reply.error || "No response";
      const aiMessage = { role: "ai", text: aiText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error talking to server." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans text-gray-900 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-white pointer-events-none" />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-3xl flex flex-col p-4 z-10">

        {/* Empty State / Header */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center mt-20 mb-10">
            <div className="mb-6">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-800"
              >
                <path
                  d="M12 4L14.4 9.6L20 12L14.4 14.4L12 20L9.6 14.4L4 12L9.6 9.6L12 4Z"
                  fill="currentColor"
                />
                <path
                  d="M18 4L19.2 6.8L22 8L19.2 9.2L18 12L16.8 9.2L14 8L16.8 6.8L18 4Z"
                  fill="currentColor"
                  opacity="0.7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-medium text-gray-800 mb-12">
              Ask Nova anything
            </h1>

            {/* Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="p-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-left text-sm text-gray-700 transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto space-y-8 pb-32 pt-10">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex w-full ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`flex max-w-[80%] flex-col gap-1`}>
                  <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider ml-1">
                    {msg.role === "user" ? "Me" : "Nova"}
                  </span>
                  <div
                    className={`p-4 rounded-2xl text-base leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gray-100 text-gray-800 rounded-tr-none"
                        : "bg-transparent text-gray-800 pl-0"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex w-full justify-start">
               <div className="flex max-w-[80%] flex-col gap-1">
                 <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider ml-1">
                   Nova
                 </span>
                 <div className="flex items-center gap-2 pl-1 mt-2">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                 </div>
               </div>
             </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-20 flex justify-center">
        <div className="w-full max-w-3xl relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything"
            className="w-full bg-white border border-gray-200 rounded-full px-6 py-4 pr-12 shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-gray-400 text-gray-700 placeholder-gray-400 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <line x1="22" x2="11" y1="2" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
