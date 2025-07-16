import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js"
import taskRoute from "./routes/task.route.js"
import dotenv from "dotenv"
dotenv.config();

const app = express();
const PORT  = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
const corsOption = {
    origin : ["https://taskify-samad05imam.netlify.app"],
    credentials : true
}
app.use(cors(corsOption));

app.use("/api/user" , userRoute);
app.use("/api/task" , taskRoute);


connectDB();
app.listen(PORT, () => {
    console.log("Server running on port 3000");
});
