import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Divider,
} from "@mui/material";
import { getChatMessages, sendChatMessage } from "../api/chat";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ChatPage = ({ user }) => {
  const { sellerId } = useParams();
  const query = useQuery();
  const listingId = query.get("listing");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sellerName, setSellerName] = useState("Seller");
  const messagesEndRef = useRef(null);

  // Fetch seller name from backend
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/user/${sellerId}`
        );
        setSellerName(res.data.name || "Seller");
      } catch {
        setSellerName("Seller");
      }
    };
    if (sellerId) fetchSeller();
  }, [sellerId]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getChatMessages({ sellerId, listingId });
      setMessages(msgs);
    };
    fetchMessages();
  }, [sellerId, listingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    console.log("Message being sent by:", {
      userId: user._id,
      userName: user.name,
      userRole: user._id === sellerId ? "Seller" : "Buyer",
    });
    const msg = await sendChatMessage({
      sellerId,
      listingId,
      text: input,
    });
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        boxShadow: 3,
        borderRadius: 4,
        bgcolor: "#f4f6fb",
        minHeight: 600,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          px: 3,
          py: 2,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Avatar sx={{ bgcolor: "#fff", color: "#764ba2", mr: 2 }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#232526" }}>
          Chat with {sellerName}
        </Typography>
      </Box>
      <Divider />
      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          bgcolor: "#f4f6fb",
        }}
      >
        <List sx={{ p: 0 }}>
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === user._id;
            console.log("Message:", {
              text: msg.text,
              sender: isMe ? "Me" : sellerName,
              senderId: msg.senderId,
              isSeller: msg.senderId === sellerId,
            });
            return (
              <ListItem
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  px: 0,
                  mb: 1.5,
                }}
                disableGutters
              >
                {!isMe && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#fff",
                      color: "#764ba2",
                      mr: 1,
                      border: "1px solid #eee",
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: "70%",
                    bgcolor: isMe
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#ffffff",
                    color: isMe ? "#fff" : "#232526",
                    px: 2,
                    py: 1,
                    borderRadius: isMe
                      ? "20px 20px 4px 20px"
                      : "20px 20px 20px 4px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                  }}
                >
                  {msg.text}
                </Box>
                {isMe && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      ml: 1,
                      bgcolor: "#667eea",
                      color: "#fff",
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
              </ListItem>
            );
          })}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      {/* Input */}
      <Divider />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 2,
          bgcolor: "#fff",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          sx={{
            bgcolor: "#f4f6fb",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            boxShadow: 2,
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPage;