const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(require("cors")());

 app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
