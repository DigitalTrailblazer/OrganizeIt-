import { Calendar, CheckCircle2, Clock, Edit2, MoreVertical, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from 'axios'
import {format, isToday} from 'date-fns'
import TaskModel from "./TaskModel";



const API_URL = "http://localhost:1111/api/tasks";

const menu_options = [
  { action: "edit", label: "Edit Task", icon: <Edit2 size={14} className="text-purple-600" /> },
  { action: "delete", label: "Delete Task", icon: <Trash2 size={14} className="text-red-600" /> },
]

const getPriorityColor = (priority) => {
  const colors = {
    low: "border-green-500 bg-green-50/50 text-green-700",
    medium: "border-purple-500 bg-purple-50/50 text-purple-600",
    high: "border-fuchsia-800 bg-fuchsia-50/50 text-fuchsia-800",
  }
  return (
    colors[priority?.toLowerCase()] ||
    "border-gray-500 bg-gray-50/50 text-gray-700"
  )
}

const getPriorityBadgeColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-900",
      medium: "bg-purple-100 text-purple-900",
      high: "bg-fuchsia-300 text-fuchsia-900",
    }
  return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-700"
}






const TaskItem = ({ task, onRefresh, showCompleteCheckBox, onEdit }) => {
  
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof task.completed === "string"
        ? task.completed.toLowerCase()
        : task.completed
    )
  )
  const [showEditModel, setShwoEditModel] = useState(false);
  const [subTasks, setSubTasks] = useState(task.subTasks || []);

  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof task.completed === "string"
          ? task.completed.toLowerCase()
          : task.completed
      )
    )
  }, [task.completed])

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No auth token found");
    }
    return { Authorization: `Bearer ${token}` };
  }

  const borderColor = isCompleted
    ? "border-green-500"
    : getPriorityColor(task.priority).split(" ")[0];

  const progress = subTasks.length
    ? (subTasks.filter((st) => st.completed).length / subTasks.length) * 100
    : 0;


  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes"

    try {
      
      await axios.put(`${API_URL}/${task._id}/taskss`, {completed : newStatus}, {headers : getAuthHeader()})
      
      // setIsCompleted()
      setIsCompleted(!isCompleted)
      onRefresh?.()
    } 
    catch (error) {
      console.error(error)
      if(error.response?.status === 401){
        onLogout?.()
      }
    }
  }

  const handleAction = (action) =>{
    setShowMenu(false)

    if(action === "edit") setShwoEditModel(true)
    if(action === "delete") handleDelete()
  }

  const handleDelete = async () => {
    
    try{

      await axios.delete(`${API_URL}/${task._id}/taskss`, {headers : getAuthHeader()})
      onRefresh?.()
    }
    catch (error) {
      console.error(error)
      if(error.response?.status === 401){
        onLogout?.()
      }
    }
  }

  const handleSave = async (updatedTask) => {
    try{

      const payload = (({title, description, priority, dueDate, completed}) => ({title, description, priority, dueDate, completed}))(updatedTask)

      await axios.put(`${API_URL}/${task._id}/taskss`, payload, {headers : getAuthHeader()})

      setShwoEditModel(false)
      onRefresh?.()
    }
    catch (error) {
      console.error(error)
      if(error.response?.status === 401){
        onLogout?.()
      }
    }
  }


  return (
    <>
      <div className={`group p-4 sm:p-5 rounded-xl shadow-sm bg-white border-l-4 hover:shadow-md transition-all duration-300 border border-purple-100 ${borderColor}`}>
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          {showCompleteCheckBox && (
            <button
              onClick={handleComplete}
              className={`${isCompleted ? "text-green-500" : "text-gray-300"} mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-full hover:bg-purple-100 transition-colors duration-300`}
            >
              <CheckCircle2 size={18} className={`${isCompleted ? "fill-green-400" : ""} w-4 h-4 sm:w-5 sm:h-5`} /> 
            </button>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h3 
                className={`${isCompleted ? "text-gray-400 line-through" : "text-gray-800"} text-base sm:text-lg font-medium truncate`}
              >
                {task.title}
              </h3>
              <span 
                className={`${getPriorityBadgeColor(task.priority)} text-xs px-2 py-0.5 rounded-full shrink-0`}
              >
                {task.priority}
              </span>
            </div>

            {task.description && <p className="text-sm text-gray-500 mt-1 truncate">{task.description}</p>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 sm:gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowMenu(prev => !prev)}
              className="p-1 sm:p-1.5 hover:bg-purple-100 rounded-lg text-gray-500 hover:text-purple-700 transition-colors duration-200"
            > 
              <MoreVertical size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 sm:w-48 bg-white border border-purple-100 rounded-xl shadow-lg z-10 overflow-hidden animate-fadeIn">
                {menu_options.map(opt => (
                  <button 
                    key={opt.action} 
                    onClick={() => handleAction(opt.action)}
                    className="px-3 py-2 flex items-center gap-2 w-full sm:px-4 text-left text-xs sm:text-sm hover:bg-purple-50 transition-colors duration-200"
                  >
                    {opt.icon}{opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
   
          <div>
            <div className={`flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${task.dueDate && isToday(new Date(task.dueDate)) ? "text-fuchsia-600" : "text-gray-500"}`}>
              <Calendar className="w-3.5 h-3.5 mr" /> 
              <span className="mr-0.2">Deadline -</span>
              {task.dueDate 
                ? (isToday(new Date(task.dueDate)) 
                    ? "Today" 
                    : format(new Date(task.dueDate), 'MMM dd')) 
                : '-'}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {task.createdAt ? `Created at ${format(new Date(task.createdAt), 'MMM dd')}` : "No Date"}
          </div>
        </div>

        </div>
      </div>

      <TaskModel 
        isOpen={showEditModel}  
        onClose={setShowMenu}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  );
};

export default TaskItem;
