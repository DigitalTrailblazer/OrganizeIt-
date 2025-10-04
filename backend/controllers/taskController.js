import Task from '../models/taskModel.js'


// NEW TASK CREATION
export const createTask = async (req, res) => {
    try {
        const{
             title,
             description,
             priority,
             dueDate,
             completed
            } = req.body

        // console.log("Creating task with data:", req.body); 
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            })
        }  

        const newTask = new Task({
            title, 
            description,
            priority,
            dueDate,
            completed : completed === "Yes" || completed === true,
            owner : req.user.id
        })

        const saved = await newTask.save()
        
        res.status(201).json({
            success : true,
            message : "newTask saved !",
            newTask
        })
    } 
    catch (error) {
        console.log(error)
        res.status(400).json({
            success : "false",
            message : error.message || "newTask creation failed !"
        })    
    }
}


// GET ALL TASK FOR LOGGED-IN USER
export const getTask = async (req, res)=>{
    try{
        const tasks = await Task.find({owner : req.user.id}).sort({createdAt : -1})

        res.status(200).json({
        success: true,
        message: "Fetched all tasks for the User!",
        tasks
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


// GET SINGLE TASK BY ID MUST BELONG TO THAT USER
export const getTaskByID = async (req, res) => {
    try{
        const task = await Task.findOne({_id : req.params.id, owner : req.user.id})

        if(!task){
            return res.status(404).json({
                success : false, 
                message : "No Tasks found !"
            })
        }

        res.json({
            succes : true, 
            tasks : task
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


// UPDATE TASK BY ID
export const updateTask = async (req, res) => {
    try{
        const data = {...req.body}

        if(data.completed != undefined){
            data.completed = data.completed === "Yes" || data.completed === true
        }

        const updated = await Task.findOneAndUpdate(
            {
                _id : req.params.id,
                owner : req.user.id    
            },
            data,
            {
                new : true,
                runValidators : true
            }
        )

        if(!updated){
            return res.status(404).json({
                succes : false,
                message : "Task not found OR not yours bcz owner id does not matches"
            })
        }

        res.status(200).json({
            success : true,
            message : "Task Updated !"
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


// DELETE A TASK
export const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete(
            {
                _id : req.params.id,
                owner : req.user.id
            }
        )

        if(!deleted){
            return res.status(404).json({
                success : false,
                message : "Task not found OR not yours bcz owner id doesn't matches"
            })
        }

        res.status(200).json({
            succes : true,
            message : "Task Deleted Successfully"
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