import User from "../models/userModel.js";
import validator from "validator"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import { use } from "react";


// REGISTER
export async function registerUser(req, res) {
    const {name, email, password} = req.body

    // validation
    if(!name || !email || !password){
        return res.status(400).json({
            success : false,
            message : "All fields are required !"
        })
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({
            success : false,
            message : "Invalid Email !"
        })
    }

    if(password.length < 8){
        return res.status(400).json({
            success : false,
            message : "Password must be of at least 8 characters !"
        })
    }

    try {
        // check if user already exists
        if(await User.findOne({email})){
            return res.status(409).json({
                success : false,
                message : "User Already Exist !"
            })
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email, 
            password : hashed
        })

        // const token = createToken(user._id)
        const payload = {
            id : user._id,
            email : user.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn : "24h"})
        
        res.cookie("token", token)

        res.status(201).json({
            success : true,
            message : "new user registered !",
            token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email
            }
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error!",
        })
    }
}


// LOGIN
export async function login(req, res){

    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : "Email & password both are required !"
        })
    }

    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success : false,
                message : "User does not exist, Invalid Credentials !"
            })
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).json({
                success : false,
                message : "Invalid Password !"
            })
        }

        const payload = {
            id : user._id,
            email : user.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn : "24h"})

        const options = {
            expires : new Date(Date.now() + 1 * 60 * 60 * 1000),
            httpOnly : true
        }
        res.cookie("token", token, options)

        res.status(201).json({
            success : true,
            message : "user logged in successfully !",
            token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email
            }
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            success : false,
            message : "Internal Server Error !"
        })
    }

}


// GET CURRENT USER
export async function getCurrentUser(req, res){
    try {
        
        const user = await User.findById(req.user.id).select("name email")
        if(!user){
            return res.status(404).json({
                success : false, 
                message : "User not found !"
            })
        }

        res.json({
            success : true,
            user : user 
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false, 
            message : "Internal Server Error !"
        })
    }
}


// UPDTE USER 
export async function updateUserProfile(req, res){

    const {name, email} = req.body

    if(!name || !email || !validator.isEmail(email)){
        return res.status(400).json({
            success : false,
            message : "Enter Valid Credentials !"
        })
    }

    try {
        // Check for duplicate email
        const exist = await User.findOne({email, _id : {$ne : req.user.id}})

        if(exist){
            return res.status(409).json({
                success : false, 
                message : "Email is Used by another account !"
            })
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                name, 
                email
            },
            {
                new : true,
                runValidators : true,
                select : "name email"
            }
        )

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully !",
            user: updatedUser
        })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error !"
        })
    }
}


// CHANGE PASSWORD FUNCTION
export async function updatePassword(req, res){

    const {currentPassword, newPassword} = req.body;

    if(!currentPassword || !newPassword || newPassword.length < 8){
        return res.status(400).json({
            success : false,
            message : "Invalid password or too short !"
        })
    }

    try{

        const user = await User.findById(req.user.id).select("password")
        if(!user){
            return res.status(400).json({
                success : false,
                message : "user not found !"
            })
        }

        // if user is found, match password
        const match = await bcrypt.compare(currentPassword, user.password)
        if(!match){
            return res.status(401).json({
                success : false,
                message : "Incorrect Passwrod !"
            })
        }

        // password matched, now hash new password and update
        user.password = bcrypt.hash(newPassword, 10)
        await user.save()

        res.status(200).json({
            success : true,
            message : "password updated successfully !"
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error !"
        })
    }
}