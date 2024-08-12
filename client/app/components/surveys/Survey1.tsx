"use client";

import React, { useEffect, useState } from "react";
import { Message, SurveyData, SurveyResult } from "../types";

interface Props {
  data: SurveyData;
  socket: any;
  visible: boolean;
}

const Survey1: React.FC<Props> = ({ data, socket, visible }) => {
  const [survey, setSurvey] = useState<SurveyData>(data);
  const [message, setMessage] = useState("");
  const [list, setList] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("survey_changed", (data: SurveyData) => {
      console.log(data);
      setSurvey(data);
    });

    socket.on("receive_message", (data: Message) => {
      setList((prevList) => [...prevList, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSendMessage = () => {
    socket.emit("send_message", { id: Date.now(), message: message });
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      {visible && (
        <>
          <div className="flex w-ful space-x-5">
            <p className="sm:text-2xl text-lg w-1/3 ">アンケート:</p>
            <div className="flex flex-col w-full">
              <p className="sm:text-3xl text-lg font-bold mb-5">
                {survey.question}
              </p>
              <p className="sm:text-2xl text-lg mb-10">{survey.description}</p>
            </div>
          </div>

          <div className="flex pt-5 w-full space-x-5 justify-between">
            <input
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="IT企業名..."
              className="border px-2 py-5 w-full sm:text-3xl text-lg"
              value={message}
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-blue-500 text-white rounded-full px-4 py-2 sm:w-52 w-28 sm:text-3xl text-lg"
            >
              回答
            </button>
          </div>
        </>
      )}
      <div className="flex flex-col space-y-1 items-center w-full mt-10">
        {list.map((chat) => (
          <p key={chat.id} className="bg-gray-200 p-2 rounded-lg w-2/3">
            {chat.message}
          </p>
        ))}
      </div>

      <div className="w-full mt-20"></div>
    </div>
  );
};

export default Survey1;
