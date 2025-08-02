import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(404).json({
                message: "Input missing!",
                success: false,
            })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                message: "User already registered ! Do login",
                success: false,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        })

        return res.status(201).json({
            message: `Account created successfully`,
            success: true
        });

    } catch (error) {
        console.error("Registration Error: ", error);
        res.status(400).json({
            message: "Something went wrong",
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required!"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!"
            });
        }

        // Validate password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        // Prepare public user data
        const safeUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            pno: user.pno,
        };

        // Send cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // true in deployment
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,
            user: safeUser
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login. Try again later."
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to log out. Please try again later."
        });
    }
};
