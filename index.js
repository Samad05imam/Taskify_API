import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import taskRoute from "./routes/task.route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);

// Connect to DB and start server
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
