import express from "express"
const app = express()

import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import userRouter from './routes/userRoute.js'
import taskRouter from "./routes/taskRoute.js"

import bodyParser from "body-parser";
const { urlencoded } = bodyParser



// MW's
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:true}))

// Connect Database
connectDB()


// Routes
app.get('/', (req, res) => {
    res.send("on / route")
})

app.use("/api/user", userRouter)
app.use("/api/tasks", taskRouter)




const port = process.env.PORT || 1111
app.listen(port, () => console.log(`server is running at ${port}`));
