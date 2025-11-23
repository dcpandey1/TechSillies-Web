import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BaseURL } from "../constants/data";

const Chat = () => {
  const { targetUserId } = useParams();
  const [targetUser, setTargetUser] = useState(null);
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const userId = user?.user?._id;

  const fetchTargetUser = async () => {
    try {
      const res = await axios.post(
        `${BaseURL}/profile/chat`,
        { targetId: targetUserId },
        { withCredentials: true }
      );

      console.log(res.data.targetUser);
      setTargetUser(res.data.targetUser);
    } catch (err) {
      console.error("Failed to fetch target user:", err.message);
    }
  };

  const fetchMessages = async () => {
    const res = await axios.get(BaseURL + "/chat/" + targetUserId, { withCredentials: true });
    const chatMessages = res?.data?.message?.map((msg) => {
      return {
        firstName: msg?.senderId?.firstName,
        lastName: msg?.senderId?.lastName,
        text: msg?.text,
        time: msg?.createdAt,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchMessages();
    fetchTargetUser();
  }, []);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", { firstName: user?.user?.firstName, userId, targetUserId, text: newMessage });
  };

  useEffect(() => {
    const socket = createSocketConnection();
    socket.emit("joinChat", { targetUserId, userId });

    socket.on("messageReceived", ({ firstName, text }) => {
      setMessages((messages) => [...messages, { firstName, text }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [targetUserId, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex justify-center mt-2 sm:mt-16 mb-16 sm:mb-1">
      <div className="w-full max-w-md bg-gray-800/25  shadow-xl shadow-gray-950 rounded-2xl neo-shadow p-4 space-y-4">
        {/* <!-- Chat header --> */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            {targetUser ? (
              <>
                <img
                  src={targetUser.imageURL}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-500"
                />
                <h1 className="text-xl font-bold text-gray-400">
                  {targetUser.firstName} {targetUser.lastName}
                </h1>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-600 animate-pulse" />
                <h1 className="text-xl font-bold text-gray-500 animate-pulse">Loading...</h1>
              </>
            )}
          </div>
        </div>

        {/* <!-- Chat messages area --> */}
        <div className="h-96 overflow-y-auto neo-inset p-4 rounded-xl space-y-4 bg-gradient-to-r from-primary   to-secondary ">
          {/* <!-- Received message --> */}

          {messages.map((msg, index) => {
            return (
              <div
                key={index}
                className={"chat " + (user.user.firstName === msg.firstName ? "chat-end" : "chat-start")}
                ref={index === messages.length - 1 ? messagesEndRef : null}
              >
                <div className="chat-image avatar"></div>
                <div className="chat-header">
                  {/* {msg.firstName} */}
                  <time className="text-xs opacity-50">
                    {msg.time && !isNaN(new Date(msg.time).getTime())
                      ? new Date(msg.time).toLocaleString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : ""}
                  </time>
                </div>
                <div
                  className={
                    "chat-bubble" +
                    " " +
                    "bg-" +
                    (user.user.firstName === msg.firstName ? "primary" : "secondary")
                  }
                >
                  <p className="text-white">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* <!-- Message input area --> */}
        <div className="flex items-center space-x-4 bg-slate-400 rounded-md">
          <div className="flex-grow">
            <input
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
              type="text"
              placeholder="Type your message..."
              className="w-full p-4 rounded-xl neo-inset bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newMessage.trim() !== "") {
                  sendMessage();
                  setNewMessage("");
                }
              }}
            />
          </div>
          <button
            onClick={() => {
              sendMessage(), setNewMessage("");
            }}
            className="p-4 rounded-xl neo-shadow neo-button focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
