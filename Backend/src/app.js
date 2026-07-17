import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

const app = express();
app.use(morgan('dev'));
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use('/api/chats', chatRouter);
app.use('/api/auth', authRouter);

export default app;