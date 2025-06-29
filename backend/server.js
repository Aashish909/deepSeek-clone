const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectToMongoDb = require("./config/dbConnect");
const passport = require("passport");
require("./controllers/strategy/google.strategy");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Updated CORS configuration for production
app.use(
  cors({
    origin: process.env.FRONTNED_URL || "https://deep-seek-clone-rosy.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

app.use(passport.initialize());

// Test endpoint to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', cookies: req.cookies });
});

//Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/chats", require("./routes/chatRoute"));
app.use("/api/conversation", require("./routes/conversationRoute"));

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

app.listen(PORT, () => {
  connectToMongoDb();
  console.log(`server running on port ${PORT}`);
});
