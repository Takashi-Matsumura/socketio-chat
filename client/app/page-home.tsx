"use client";

import { useEffect, useState } from "react";

import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
);

interface Message {
  message: string;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [list, setList] = useState<Message[]>([]);

  useEffect(() => {
    // socket.onイベントリスナーを設定
    socket.on("receive_message", (data) => {
      setList((prevList) => [...prevList, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSendMessage = () => {
    socket.emit("send_message", { message: message });
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col h-screen items-center">
        <h1 className="text-2xl my-10">ChatApp using socket.io</h1>
        <div className="pt-5 space-x-2">
          <input
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="chat..."
            className="border p-2"
            value={message}
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-black text-white rounded-full px-4 py-2"
          >
            Send
          </button>
        </div>
        <div className="flex flex-col space-y-1 items-center w-full mt-10">
          {list.map((chat) => (
            <div className="bg-gray-200 p-2 rounded-lg w-2/3">
              {chat.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
