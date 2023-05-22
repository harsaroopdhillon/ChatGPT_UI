import React, { useState, useRef } from "react";
import "./Chat.css";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import SendIcon from "@material-ui/icons/Send";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import { Avatar } from "@material-ui/core";
import { Configuration, OpenAIApi } from "openai";

const electron = window.require("electron");
const os = electron.remote.require("os");

const openaiConfig = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(openaiConfig);

const TypingIndicator = () => (
  <div className="typing-indicator">
    <div className="typing-indicator__dot"></div>
    <div className="typing-indicator__dot"></div>
    <div className="typing-indicator__dot"></div>
  </div>
);

function ChatMessage({ timestamp, message, user, isWaitingResponse = false }) {
  return (
    <div className="chat-message">
      <Avatar src={user.photo} />
      <div className="chat-message__info">
        <h4>
          {user.displayName}
          <span className="chat-message__timestamp">
            {new Date(timestamp).toUTCString()}
          </span>
        </h4>
        {isWaitingResponse ? (
          <TypingIndicator />
        ) : (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
}

function ChatComponent() {
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [messages, setMessages] = useState([]);
  const pcName = os.hostname();

  const displayName = (pcName);
  const [isSending, setIsSending] = useState(false);

  const inputRef = useRef(null);
  const searchRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "") {
      return; // Ignore empty messages
    }

    setIsSending(true); // Disable textarea while sending
    try {
      const newMessage = {
        timestamp: new Date().toISOString(),
        message: inputText,
        user: {
          displayName: displayName,
          photo: "path_to_your_photo.jpg",
        },
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText("");

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: inputText }],
      });
      console.log("response ", response);

      const newMessageGPT = {
        timestamp: new Date().toISOString(),
        message: response.data.choices[0].message.content,
        user: {
          displayName: "ChatBot",
          photo: "path_to_your_photo.jpg",
        },
      };

      setMessages((prevMessages) => [...prevMessages, newMessageGPT]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsSending(false); // Enable textarea after sending
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      alert(e);
    }
  };
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header__left"></div>

        <div className="chat-header__right">
          <div className="chat-header__search">
			<input
			  ref={searchRef}
			  value={searchText}
			  onChange={(e) => setSearchText(e.target.value)}
			  onKeyDown={handleSearch}
			  placeholder="Search"
			/>

            <SearchRoundedIcon />
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <ChatMessage
            key={message.timestamp}
            timestamp={message.timestamp}
            message={message.message}
            user={message.user}
            isWaitingResponse={false}
          />
        ))}

        {isSending && (
          <ChatMessage
            timestamp={"2023-05-17T10:31:00"}
            message={"I'm good, thanks!"}
            user={{
              displayName: "ChatBot",
              photo: "path_to_john_photo.jpg",
            }}
            isWaitingResponse={true}
          />
        )}
      </div>

      <div className="chat-input">
        <AddCircleIcon fontSize="large" />
        <form>
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter query"
            disabled={isSending}
          />
        </form>

        <div className="chat-input-icons">
          <button
            className="chat-input-button"
            type="submit"
            onClick={sendMessage}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
