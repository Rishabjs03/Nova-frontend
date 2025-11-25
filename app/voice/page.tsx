"use client";

import React, { useRef, useState } from "react";
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

export default function VoiceAgent() {
  const [isRecording, setisRecording] = useState(false);
  const [messages, setMessages] = useState<
    { role: "Me" | "nova"; text: string }[]
  >([]);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const MediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleModelChange = (value: string) => {
    if (value === "Nova Text") {
      router.push("/text");
    } else if (value === "Nova Voice") {
      router.push("/voice");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      recorder.onstop = handlestopRecording;
      audioChunksRef.current = [];
      MediaRecorderRef.current = recorder;
      recorder.start();
      setisRecording(true);
    } catch (error) {
      console.log("Mic error:", error);
      alert("Mic error");
    }
  };

  const stopRecording = () => {
    if (MediaRecorderRef.current) {
      MediaRecorderRef.current.stop();
      setisRecording(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Add a toast notification here
    });
  };
  const handlestopRecording = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "input.wav");

    setMessages((prev) => [
      ...prev,
      { role: "Me", text: "Recognizing speech..." },
    ]);

    setIsProcessing(true);

    try {
      const res = await fetch(
        "https://nova-backend-production-de0d.up.railway.app/voice",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log(data);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "Me", text: data.user_text };
        return updated;
      });

      setMessages((prev) => [...prev, { role: "nova", text: "" }]);

      let index = 0;
      const reply = data.agent_text;

      const interval = setInterval(() => {
        index++;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = reply.slice(0, index);
          return updated;
        });

        if (index >= reply.length) clearInterval(interval);
      }, 20);

      const audio = new Audio("data:audio/mp3;base64," + data.agent_audio);
      audio.play();
    } catch (error) {
      console.error("Error sending audio:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "Me",
          text: "Error sending audio.",
        };
        return updated;
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans text-gray-900 relative overflow-hidden ">
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-gray-200/50">
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
          <Select value="Nova Voice" onValueChange={handleModelChange}>
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
        className="flex-1 w-full max-w-3xl flex flex-col p-4 z-10 pt-24"
      >
        {/* Header */}
        {messages.length === 0 && (
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
              Voice Chat with Nova
            </h1>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-8 pb-32 pt-10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${
                msg.role === "Me" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`flex max-w-[80%] flex-col gap-1`}>
                <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider ml-1">
                  {msg.role === "Me" ? "Me" : "Nova"}
                </span>
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredMessageIndex(idx)}
                  onMouseLeave={() => setHoveredMessageIndex(null)}
                >
                  <div
                    className={`p-4 rounded-2xl text-base leading-relaxed ${
                      msg.role === "Me"
                        ? msg.text === "Recognizing speech..."
                          ? "bg-gray-100 text-gray-800 border rounded-tr-none animate-pulse"
                          : "bg-gray-100 text-gray-800 border rounded-tr-none"
                        : "bg-gray-50/80 text-gray-900 border rounded-2xl"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {/* Copy Button */}
                  {hoveredMessageIndex === idx &&
                    msg.text !== "Recognizing speech..." && (
                      <button
                        onClick={() => copyToClipboard(msg.text)}
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
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      {/* Recording Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-20 flex justify-center"
      >
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-800"
          }`}
        >
          {isRecording ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-8 h-8"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
          )}
        </button>
      </motion.div>
    </div>
  );
}
