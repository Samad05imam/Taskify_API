import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                msg: "User not authenticated!",
                success: false,
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decode.userId);

        if (!user) {
            return res.status(401).json({
                msg: "User not found!",
                success: false,
            });
        }

        req.user = user; // ✅ only set if user exists
        next();
    } catch (error) {
        console.log("Auth error:", error);
        return res.status(500).json({
            msg: "Authentication failed",
            success: false,
            error: error.message,
        });
    }
};

export default isAuthenticated;
