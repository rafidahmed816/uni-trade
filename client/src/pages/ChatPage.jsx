import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getChatMessages, sendChatMessage } from "../api/chat"; // You'll create these

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ChatPage = ({ user }) => {
  const { sellerId } = useParams();
  const query = useQuery();
  const listingId = query.get("listing");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getChatMessages({ sellerId, listingId });
      setMessages(msgs);
    };
    fetchMessages();
  }, [sellerId, listingId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = await sendChatMessage({
      sellerId,
      listingId,
      text: input,
    });
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chat with Seller
        </Typography>
        <List sx={{ minHeight: 300, maxHeight: 400, overflowY: "auto" }}>
          {messages.map((msg, idx) => (
            <ListItem
              key={idx}
              sx={{
                justifyContent:
                  msg.senderId === user._id ? "flex-end" : "flex-start",
              }}
            >
              <ListItemText
                primary={msg.text}
                sx={{
                  bgcolor:
                    msg.senderId === user._id ? "#e3f2fd" : "#f1f8e9",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  maxWidth: "70%",
                  display: "inline-block",
                }}
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;