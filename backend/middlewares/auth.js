import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'


export default async function authMiddleware(req, res, next){

    try {
        // GRAB THE TOKEN
        
        // extract token : req ki body se
        // const token = req.body.token
        // console.log("body", token);

        // extract token : cookies se 
        // const token = req.cookies.token
        // console.log("cookies", token);

        // extract token : header se 
        // const token = req.header('Authorization')?.replace('Bearer ', '')
        //  req.headers.authorization?.split(" ")[1]

        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success : false,
                message : "Not authorized, token missing !"
            })
        }

        const token = authHeader.split(" ")[1]
        if(!token){
            return res.status(401).json({
                success : false,
                message : "Could not fetch the token !"
            })
        }


        // VERIFY THE TOKEN & ATTATCH THE USER OBJECT
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const user = await User.findById(decoded.id).select("-password")

            if(!user){
                return res.status(401).json({
                    success : false,
                    message : "user not found !"
                })
            }

            req.user = user
        }
        catch(error){
            return res.status(401).json({
                success : false,
                message : "Could not verify the token !"
            })
        }
        next()
    }
    catch (error) {
        res.status(401).json({
            success : false,
            message : "Authorization failed while verifying the token !"
        })
    }
}