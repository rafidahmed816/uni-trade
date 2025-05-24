const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Increase payload size limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(require("cors")());

app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use("/api/chat", require("./routes/chatRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
