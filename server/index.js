import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(
    cors({
        origin: "http://localhost:5173",  // Direct string instead of array
        methods: ["GET","POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());    
app.use(express.json());
app.use(`/api/auth`, authRoutes);

const server = app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});

mongoose
    .connect("mongodb://127.0.0.1:27017/conversa", {  // Direct connection string instead of env variable
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        family: 4,  // Force IPv4
        directConnection: true  // Add this
    })
    .then(() => {
        console.log("DB Connection Successful");
        console.log("Connected to MongoDB at: mongodb://127.0.0.1:27017/conversa");
    })
    .catch(err => {
        console.error("MongoDB Connection Error Details:", err);
        process.exit(1);
    });