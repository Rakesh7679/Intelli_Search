import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);

export default app;