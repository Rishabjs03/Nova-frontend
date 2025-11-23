"use client";

import React, { useRef, useState } from "react";

export default function VoiceAgent() {
  const [isRecording, setisRecording] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "nova"; text: string }[]
  >([]);
  const MediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  return <div>page</div>;
}
