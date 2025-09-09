import express from 'express'
import { getCurrentUser, login, registerUser, updatePassword, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from "../middlewares/auth.js";


const userRouter = express.Router();


// PUBLIC ROUTES
userRouter.post("/register", registerUser)
userRouter.post("/login", login)


// PRIVATE ROUTES
userRouter.get("/me", authMiddleware, getCurrentUser)
userRouter.put("/profile", authMiddleware, updateUserProfile)
userRouter.put("/password", authMiddleware, updatePassword)


export default userRouter