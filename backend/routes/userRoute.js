import express from 'express'
import { getCurrentUser, login, registerUser, updatePassword, updateUserProfile } from '../controllers/userController';
import { useReducer } from 'react';

const userRouter = express.Router();


// PUBLIC ROUTES
userRouter.post("/register", registerUser)
userRouter.post("/login", login)


// PRIVATE ROUTES
userRouter.get("/me", getCurrentUser)
userRouter.put("/profile", updateUserProfile)
userRouter.put("/password", updatePassword)