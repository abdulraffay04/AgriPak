const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const priceRoutes = require("./routes/priceRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/blogs", blogRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend
    methods: ["GET", "POST"],
  },
});

// { socketId: { socketId, name, unread: { [otherUserName]: count } } }
let onlineFarmers = {};

io.on("connection", (socket) => {
  console.log("⚡ Farmer connected:", socket.id);

  // ✅ Farmer joins with name
  socket.on("join", ({ name }) => {
    // Remove duplicate entries
    for (const id in onlineFarmers) {
      if (onlineFarmers[id].name === name) {
        delete onlineFarmers[id];
      }
    }

    onlineFarmers[socket.id] = {
      socketId: socket.id,
      name,
      unread: {},
    };

    sendFarmersList();
    console.log("✅ JOIN:", socket.id, name);
  });

  // ✅ Handle private messages
  socket.on("privateMessage", ({ toUserId, message }) => {
    const sender = onlineFarmers[socket.id];
    const recipient = onlineFarmers[toUserId];

    if (recipient) {
      io.to(recipient.socketId).emit("privateMessage", {
        fromUserId: socket.id,
        message,
        fromName: sender?.name || "Unknown",
      });

      // track unread count
      if (!recipient.unread[sender.name]) {
        recipient.unread[sender.name] = 0;
      }
      recipient.unread[sender.name] += 1;
    }

    sendFarmersList();
  });

  // ✅ Reset unread count when opening chat
  socket.on("resetUnread", ({ chatWith }) => {
    if (onlineFarmers[socket.id]) {
      onlineFarmers[socket.id].unread[chatWith] = 0;
    }
    sendFarmersList();
  });

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ Farmer disconnected:", socket.id);
    delete onlineFarmers[socket.id];
    sendFarmersList();
  });

  // ✅ Send updated farmers list
  function sendFarmersList() {
    const uniqueFarmers = Object.values(onlineFarmers).filter(
      (v, i, self) => i === self.findIndex((f) => f.name === v.name)
    );

    io.emit(
      "onlineFarmers",
      uniqueFarmers.map((farmer) => ({
        userId: farmer.socketId,
        name: farmer.name,
        unread: farmer.unread,
      }))
    );
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
