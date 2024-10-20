import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

// ----------------------------------------------------REGISTER---------------------------------------------------------
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "something went wrong, please check you have missed something",
                success: false,
            })
        };
        // cloudinary
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "user already exist in this email id",
                success: false,
            })
        };
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "account created successfully",
            success: true,
        })
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
}

// ----------------------------------------------------LOGIN---------------------------------------------------------

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "something went wrong, please check you have missed something",
                success: false,
            })
        };
        // user is valid or not
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "enter valid email or password",
                success: false,
            })
        };
        // password match or not
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "incorrect password",
                success: false,
            })
        };
        // role is correct or not
        if (role != user.role) {
            return res.status(400).json({
                message: "that account does not exist with this role",
                success: false,
            })
        };
        const tokenData = {
            userId: user._id,
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname} `,
            user,
            success: true,
        })

    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
}

// ----------------------------------------------------LOGOUT---------------------------------------------------------

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logout successfully",
            success: true,
        })
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
}

// -----------------------------------------------------UPDATE---------------------------------------------------------

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        // cloudinary
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id // middleware authentication 
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        };

        // updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        // resume
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname //save the original name
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).json({
            message: "profile updated successfully",
            user,
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}



