"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { DecodeError } from "next/dist/shared/lib/utils";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamResponse, setStreamResponse] = useState("");

  const handleChat = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Error:" + error.message);
    }
    setLoading(false);
  };

  const handleStreamChat = async () => {
    setStreaming(true);
    setStreamResponse("");
    try {
      const res = await fetch("api/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (value) {
        const { done, value } = await reader.read();

        if (done) break;
        const chunk= decoder.decode(value)
        const lines= chunk.split('\n')
        for(const line of lines){
          if(line.startsWith("data:")){
            const data= JSON.parse(line.slice(6))
            setStreaming((prev)=> prev+ data.content)
          }
        }
      }
    } catch (error) {
      setStreamResponse("Error:" + error.message);
    }
    setLoading(false);
  };
  return (
    <div className={styles.page}>
      <h1>Hello Ibrahim</h1>
      <h2>Get Started with chaiCode next.js and AI</h2>
      <div className="">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter Your awesome message"
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }}
        ></textarea>
      </div>
      <div>
        <button
          style={{ padding: "10px 20px", background: "orange" }}
          onClick={handleChat}
        >
          {loading ? "Loading..." : "Chat"}
        </button>
        <button
          style={{ padding: "10px 20px", background: "green", margin:"5px" }}
          onClick={handleStreamChat}
        >
          {loading ? "Loading..." : "Stream Chat"}
        </button>
      </div>
      <div
        style={{
          border: "1px solid grey",
          padding: "10px",
          whiteSpace: "pre-wrap",
          fontSize: "28px",
        }}
      >
        {" "}
        
        {response}
      </div>
      <div
        style={{
          border: "1px solid grey",
          padding: "10px",
          whiteSpace: "pre-wrap",
          fontSize: "28px",
        }}
      >
        {" "}
        
        {streamResponse}
      </div>
    </div>
  );
}
