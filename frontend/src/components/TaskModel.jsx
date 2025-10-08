import { AlignLeft, Calendar, CheckCircle, Flag, Plus, PlusCircle, Save, SaveIcon, X } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'




const API_URL = "https://organizeit-backend-ifkw.onrender.com/api/tasks"

const default_task = {
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    completed: "No",
    id: null,
}

const priorityStyles = {
    Low: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-purple-100 text-purple-700 border-purple-200",
    High: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
}


const TaskModel = ({isOpen, onClose, taskToEdit, onSave, onLogout}) => {


    const [taskData, setTaskData] = useState(default_task)
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState(null)

    const today = new Date().toISOString().split('T')[0]

    useEffect(() => {
        
        if(!isOpen){
            return;
        }

        if(taskToEdit){
            const normalized = taskToEdit.completed === "Yes" || taskToEdit.completed === true ? "Yes" : "No"

            setTaskData({
                ...default_task,
                title : taskToEdit.title || '',
                description : taskToEdit.description || '',
                priority : taskToEdit.priority || "Low",
                dueDate : taskToEdit.dueDate?.split('T')[0] || '',
                completed : normalized,
                id : taskToEdit._id,
            })
        }
        else{
            setTaskData(default_task)  
        }
        setError(null)
    }, [isOpen, taskToEdit])


    const handleChange = useCallback((e) =>{
        const {name, value} = e.target;
        setTaskData(prev => ({...prev, [name] : value}))
    }, [])


    const getHeaders = useCallback(() => {
        const token = localStorage.getItem('token')
        if(!token){
            throw new Error("No auth token found !")
        }

        return {
            'Content-Type' : 'application/json',
            Authorization : `Bearer ${token}`
        }
    }, [])


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()

        if (!taskData.title || taskData.title.trim() === "") {
            setError("Task title is required!");
            setLoading(false);
            return;
        }

        if(taskData.dueDate < today){
            setError("Due date cannot be in past.")
            return
        }
        setLoading(true)
        setError(null)

        try {
            
            const isEdit = Boolean(taskData.id)
            const url = isEdit ? `${API_URL}/${taskData.id}/taskss` : `${API_URL}/taskss`

            const response = await fetch(url, {
                method : isEdit ? "PUT" : "POST",
                headers : getHeaders(),
                body : JSON.stringify(taskData)
            })

            if(!response.ok){
                if(response.status === 401){
                    return onLogout?.()
                }
                const err = await response.json()
                throw new Error(err.message || "Failed to Save task")
            }
            const saved = await response.json()
            onSave?.(saved)
            onClose()
        } 
        catch (error) {
            console.log(error)
            setError(error.message || "An unexpected error occured !"  )
        }
        finally{
            setLoading(false)
        }
    }, [taskData, today, getHeaders, onLogout, onSave, onClose])   

    if(!isOpen){
        return null
    }
 
    return (
    <div className='p-4 fixed inset-0 backdrop:blur-sm bg-black/20 z-50 flex items-center justify-center'>
        <div className='p-6 border bg-white border-purple-100 rounded-xl max-w-md shadow-lg relative '>
            <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
                    {
                        taskData.id ? <Save className='w-5 h-5 text-purple-500' /> :
                        <Plus className='w-5 h-5 text-purple-500' />
                    }
                    {taskData.id ? "Edit Task" : "Create New Task"}
                </h2>

                <button
                    onClick={onClose}
                    className='p-2 text-gray-500 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors'
                >
                    <X className='w-5 h-5'/>
                </button>
            </div>

            {/* form for task creation */}
            <form 
                action="" 
                onSubmit={handleSubmit}
                className='space-y-4'
            >
                {error && <div className='text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100'>{error}</div>}
                
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Task Title 
                    </label>

                    <div className='px-3 py-2.5 rounded-lg flex items-center border border-purple-100 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200 '>
                        <input 
                            type="text" 
                            name="title" 
                            required 
                            value={taskData.title} 
                            onChange={handleChange}
                            placeholder='Enter task title'
                            className='w-full text-sm focus:outline-none'
                        />
                    </div>
                </div>
                
                <div>
                    <label className='flex items-center gap-1 text-sm font-medium text-gray-700 mb-1'>
                        <AlignLeft className='w-4 h-4 text-purple-500' /> Description
                    </label>

                    <textarea 
                        name="description" 
                        rows="3"
                        onChange={handleChange}
                        value={taskData.description}
                        placeholder='Add details about your task'
                        className='w-full px-4 py-2.5 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm'
                    />

                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='flex items-center gap-1 text-sm font-medium text-gray-700 mb-1'>
                            <Flag className='w-4 h-4 text-purple-500' /> Priority 
                        </label>

                        <select 
                            name="priority"
                            value={taskData.priority}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm ${priorityStyles[taskData.priority]}`}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>

                    <div >
                        <label className='flex items-center gap-1 text-sm font-medium text-gray-700 mb-1'>
                            <Calendar className='w-4 h-4 text-purple-500' /> Due Date  
                        </label>

                        <input 
                            type="date" 
                            name="dueDate" 
                            required 
                            min={today} 
                            value={taskData.dueDate} 
                            onChange={handleChange}
                            className='w-full px-4 py-2.5 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm'
                        />
                    </div>
                </div>

                <div>
                    <label className='flex items-center gap-1 text-sm font-medium text-gray-700 mb-2'>
                        <CheckCircle className='w-4 h-4 text-purple-500' /> Status   
                    </label>

                    <div className='flex gap-4'>
                        {
                            [
                                {val : "Yes", label : "Completed"},
                                {val : "No" , label : "In Progres"}
                            ].map(({val, label}) => (
                                <label
                                    key={val}
                                    className='flex items-center'
                                >
                                    <input type="radio" name='completed' value={val} checked={taskData.completed === val} onChange={handleChange} className='h-4 w-4 text-purple-600' />
                                    <span className='ml-2 text-sm text-gray-700'>{label}</span>
                                </label>
                            ))
                        }
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={loading} 
                    className='w-full px-4 py-2.5 flex items-center justify-center gap-2 text-white font-medium bg-gradient-to-r from-fuchsia-500 to-purple-600 disabled:opacity-50 hover:shadow-md transition-all duration-200'      
                >
                    {loading ? "Saving" : (taskData.id ? <>
                        <SaveIcon className='w-4 h-4' /> Update Task 
                    </> : <>
                        <PlusCircle className='w-4 h-4 '/> Create Task
                    </>)}
                </button>
            </form>
        </div>
    </div>
    )
}

export default TaskModel
  