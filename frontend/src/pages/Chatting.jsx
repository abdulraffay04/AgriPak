import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./Chatting.css";

const socket = io(process.env.REACT_APP_API_URL || "/");

function Chatting() {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [search, setSearch] = useState(""); // ✅ search state
  const chatEndRef = useRef(null);

  const userName = localStorage.getItem("userName") || "Farmer";

  useEffect(() => {
    socket.emit("join", { name: userName });

    socket.on("onlineFarmers", (list) => {
      const filtered = list.filter((f) => f.userId !== socket.id);
      setFarmers(filtered);
    });

    socket.on("privateMessage", ({ fromUserId, message, fromName }) => {
      setChats((prev) => {
        const prevChat = prev[fromUserId] || [];
        return {
          ...prev,
          [fromUserId]: [...prevChat, { fromId: fromUserId, from: fromName, message }],
        };
      });

      if (!selectedFarmer || selectedFarmer.userId !== fromUserId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [fromUserId]: (prev[fromUserId] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off("onlineFarmers");
      socket.off("privateMessage");
    };
  }, [userName, selectedFarmer]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, selectedFarmer]);

  const sendMessage = () => {
    if (selectedFarmer && message.trim()) {
      socket.emit("privateMessage", {
        toUserId: selectedFarmer.userId,
        message,
      });

      setChats((prev) => {
        const prevChat = prev[selectedFarmer.userId] || [];
        return {
          ...prev,
          [selectedFarmer.userId]: [
            ...prevChat,
            { fromId: socket.id, from: "Me", message },
          ],
        };
      });

      setMessage("");
    }
  };

  const handleSelectFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setUnreadCounts((prev) => ({
      ...prev,
      [farmer.userId]: 0,
    }));
  };

  const currentChat = selectedFarmer ? chats[selectedFarmer.userId] || [] : [];

  // ✅ Filter farmers by search text
  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chat-container d-flex border" style={{ height: "80vh" }}>
      {/* Left: Farmers list */}
      <div
        className="farmers-list border-end p-2"
        style={{ width: "250px", overflowY: "auto" }}
      >
        <h5>Live Farmers</h5>

        {/* ✅ Search Bar */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search farmer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredFarmers.length === 0 ? (
          <p>No farmer found</p>
        ) : (
          <ul className="list-group">
            {filteredFarmers.map((farmer) => (
              <li
                key={farmer.userId}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  selectedFarmer?.userId === farmer.userId ? "active" : ""
                }`}
                onClick={() => handleSelectFarmer(farmer)}
                style={{ cursor: "pointer" }}
              >
                {farmer.name}
                {unreadCounts[farmer.userId] > 0 && (
                  <span className="badge bg-danger rounded-pill">
                    {unreadCounts[farmer.userId]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right: Chat window */}
      <div className="chat-window d-flex flex-column flex-grow-1">
        {selectedFarmer ? (
          <>
            <div className="chat-header border-bottom p-2 bg-light">
              <h6 className="mb-0">{selectedFarmer.name}</h6>
            </div>

            <div
              className="chat-messages flex-grow-1 p-2"
              style={{ overflowY: "auto" }}
            >
              {currentChat.map((msg, i) => (
                <div
                  key={i}
                  className={`message mb-2 d-flex ${
                    msg.fromId === socket.id
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      msg.fromId === socket.id
                        ? "bg-primary text-white"
                        : "bg-light"
                    }`}
                    style={{ maxWidth: "70%" }}
                  >
                    <small>
                      <b>{msg.from}</b>
                    </small>
                    <p className="mb-0">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input border-top p-2 d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button className="btn btn-primary" onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <p>Select a farmer to start chat</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatting;
