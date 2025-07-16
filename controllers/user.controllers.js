import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email ||  !password) {
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
        if (!email || !password) {
            return res.status(404).json({
                message: "Somethig is missing !",
                success: false
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Email or Password is incorrect !",
                success: false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Email or Password is incorrect !",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            pno: user.pno,
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })
    } catch (error) {
        console.error("Login Error: ", error)
        return res.status(501).json({
            message:"Can't loging in you ... try again later",
            success:false
        })
    }
}

export const logout =  async (req , res)=>{
    try {
        return res.status(200).cookie("token" , "" , {maxage:"0"}).json({
            message:"Successfully logout! ",
            success:true
        })
    } catch (error) {
        console.error("Logout Error:" ,error);
        return res.status(501).json({
            message:"Can't loging out you ... try again later",
            success:false
        })
    }
}

