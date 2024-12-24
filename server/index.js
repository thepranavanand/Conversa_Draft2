import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = "mongodb://0.0.0.0:27017/conversa";

app.use(
    cors({
        origin: [process.env.ORIGIN],
        methods: ["GET","POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());    
app.use(express.json());

const server = app.listen(port,()=>{
    console.log(`Server is running at https://localhost:${port}`);
});

mongoose
    .connect(databaseURL)
    .then(()=>console.log("DB Connection Successful"))
    .catch(err=>console.log(err.message));