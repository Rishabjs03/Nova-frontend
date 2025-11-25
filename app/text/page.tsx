"use client";

import React, { useState, useRef, useEffect } from "react";
import { text_agent } from "../api/text_agent";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function TextAgent() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: string; text?: string; image?: string }[]
  >([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Analyze this URL and provide a comprehensive summary.",
    "Research a complex topic and explain it in simple terms.",
    "Extract key insights and data points from this webpage.",
    "Compare these products using real-time market data.",
    "Curate the latest news and developments on this subject.",
    "Analyze numerical data and perform calculations to give me accurate insights.",
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
      if (reply.response && reply.response.startsWith("IMAGE_URL::")) {
        const url = reply.response.replace("IMAGE_URL::", "");

        setMessages((prev) => [...prev, { role: "ai", image: url }]);
      }
      // TEXT
      else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: reply.response || "No response" },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error talking to server." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) {
        handleSend();
      }
    }
  };
  const handleModelChange = (value: string) => {
    if (value === "Nova Text") {
      router.push("/text");
    } else if (value === "Nova Voice") {
      router.push("/voice");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Add a toast notification here
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans text-gray-900 relative overflow-hidden">
      {/* Paper Texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
      `,
          backgroundSize: "8px 8px, 32px 32px, 32px 32px",
        }}
      />

      {/* Fixed Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-transparent backdrop-blur-sm border-b border-gray-200/50">
        <div className="flex items-center justify-between px-5 py-4">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors backdrop-blur-sm border border-gray-200/50 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700 group-hover:text-gray-900 transition-colors"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Model Selector */}
          <Select value="Nova Text" onValueChange={handleModelChange}>
            <SelectTrigger className="w-[180px] bg-white/60">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Model</SelectLabel>
                <SelectItem value="Nova Text">Nova Text</SelectItem>
                <SelectItem value="Nova Voice">Nova Voice</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content with top padding for fixed header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 w-full max-w-3xl flex flex-col p-4 z-10 md:pt-24 pt-0"
      >
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  className="p-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-left text-sm text-gray-700 transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto space-y-8 pb-32 pt-10  ">
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
                    className="relative"
                    onMouseEnter={() => setHoveredMessageIndex(idx)}
                    onMouseLeave={() => setHoveredMessageIndex(null)}
                  >
                    <div
                      className={`p-4 rounded-2xl text-base leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gray-100 text-gray-800 border rounded-tr-none"
                          : "bg-gray-50/80 text-gray-900 border rounded-2xl "
                      }`}
                    >
                      {msg.image ? (
                        <img
                          src={msg.image}
                          alt="Generated"
                          className="rounded-xl max-w-full shadow-md"
                        />
                      ) : (
                        msg.text
                      )}
                    </div>
                    {/* Copy Button */}
                    {hoveredMessageIndex === idx && msg.text && (
                      <button
                        onClick={() => copyToClipboard(msg.text!)}
                        className="absolute bottom-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm border border-gray-200 transition-all opacity-0 group-hover:opacity-100"
                        style={{ opacity: hoveredMessageIndex === idx ? 1 : 0 }}
                        title="Copy message"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-600"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    )}
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
      </motion.div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-20 flex justify-center"
      >
        <div className="w-full max-w-3xl relative">
          <InputGroup className="w-full bg-white border border-gray-200 rounded-3xl shadow-sm focus-within:ring-4 focus-within:ring-gray-200 focus-within:border-gray-400 transition-all overflow-hidden">
            <InputGroupTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything"
              className="border-0 focus:ring-0 shadow-none resize-none min-h-[56px] max-h-48 py-4 px-6 text-lg text-gray-700 placeholder-gray-400 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100"
            />
            <InputGroupAddon
              align="block-end"
              className="pb-3 pr-6 justify-end"
            >
              <InputGroupButton
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2 text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-12 h-12"
                variant="ghost"
                size="icon-sm"
              >
                {loading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12"
                  >
                    <line x1="22" x2="11" y1="2" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </motion.div>
    </div>
  );
}
