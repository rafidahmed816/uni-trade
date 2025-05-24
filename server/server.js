const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Increase payload size limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/userRoutes")); // <-- add this line
app.use('/api/listings', require('./routes/listingRoutes'));
app.use("/api/chat", require("./routes/chatRoutes"));

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a specific chat room
  socket.on("joinRoom", ({ sellerId, listingId }) => {
    const room = `${listingId}_${sellerId}`;
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle sending messages
  socket.on("sendMessage", async (message) => {
    const { sellerId, listingId, text, senderId } = message;

    // Save the message to the database
    const msg = await ChatMessage.create({
      sellerId,
      buyerId: senderId === sellerId ? message.buyerId : senderId,
      listingId,
      senderId,
      text,
    });

    const room = `${listingId}_${sellerId}`;
    io.to(room).emit("receiveMessage", msg); // Broadcast the message to the room
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
