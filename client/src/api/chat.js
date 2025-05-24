import axios from "axios";
const baseURL = "http://localhost:5000/api/chat";

// Get chat messages for a conversation
export const getChatMessages = async ({ sellerId, listingId }) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    `${baseURL}?sellerId=${sellerId}&listingId=${listingId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Send a chat message
export const sendChatMessage = async ({ sellerId, listingId, text }) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    baseURL,
    { sellerId, listingId, text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

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