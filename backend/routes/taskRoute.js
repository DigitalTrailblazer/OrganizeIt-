import express from "express"
import authMiddleware from "../middlewares/auth.js"
import { createTask, deleteTask, getTask, getTaskByID, updateTask } from "../controllers/taskController.js"

const taskRouter = express.Router()


// chained routes - router.route()
taskRouter.route("/taskss")
    .get(authMiddleware, getTask)
    .post(authMiddleware, createTask)
    
taskRouter.route("/:id/taskss")
    .get(authMiddleware, getTaskByID)
    .put(authMiddleware, updateTask)
    .delete(authMiddleware, deleteTask)


export default taskRouter