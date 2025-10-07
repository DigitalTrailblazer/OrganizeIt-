import React from 'react'
import { Award, Clock, Filter, ListChecks, Plus, SortAsc, SortDesc } from "lucide-react";
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useMemo } from 'react';
import TaskItem from '../components/TaskItem';
import TaskModel from '../components/TaskModel';


const sort_options = [
  { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
  { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
  { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
]

const tailwindClass = {
  tabButton: (active) =>
  `px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${active
    ? "bg-white text-purple-700 shadow-sm border border-purple-100"
    : "text-gray-600 hover:text-purple-700 hover:bg-purple-100/50"
  }`
}


const Pendingpage = () => {

  const {tasks = [], refreshTasks} = useOutletContext()
  const [sortBy, setSortBy] = useState('newest')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModel, setShowModel] = useState(false)


  const sortedPendingTask = useMemo(() => {
    
    const filtered = tasks.filter(
      (t) => !t.completed || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'no')
    )

    return filtered.sort((a, b) => {
      if(sortBy === 'newest'){
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      if(sortBy === 'oldest'){
        return new Date(a.createdAt) - new Date(b.createdAt)
      }

      const order = {high : 3, medium : 2, low : 1}

      return order[b.priority.toLowerCase()] - order[a.priority.toLowerCase()]
    })
  }, [tasks, sortBy])

  return (
    <div className='p-6 min-h-screen overflow-hidden'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <ListChecks className='text-purple-500' /> Pending Task 
          </h1>

          <p className='mt-1 ml-7 text-sm text-gray-500'>
            {sortedPendingTask.length} task {sortedPendingTask.length !== 1 && 's'} needs your attention
          </p>
        </div>

        <div className='flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-purple-100 w-full md:w-auto'>
          <div className='font-medium flex items-center gap-2 text-gray-700'>
            <Filter className='w-4 h-4 text-purple-500' />
            <span className='text-sm'>Sort by : </span>
          </div>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className='px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 md:hidden text-sm'
          >
              <option value="newest">Newest First</option>
              <option value="newest">Oldest First</option>
              <option value="priority">By Priority</option>
          </select>

          <div className='hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg ml-3'>
            {sort_options.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={tailwindClass.tabButton(sortBy === opt.id)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        onClick={() => setShowModel(true)}
        className='hidden md:block p-5 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 transition-colors cursor-pointer mb-6 bg-purple-50/50 group'
      >
        <div className='flex items-center justify-center gap-3 text-gray-500 group-hover:text-purple-600 transition-colors'>
          <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm transition-all duration-200'>
            <Plus size={18} className='text-purple-500' />
          </div>
          <span className='font-medium'>
            Add New Task
          </span>
        </div>
      </div>

      <div className='space-y-4'>
        {sortedPendingTask.length === 0 ? (
          <div className='p-8 bg-white rounded-xl shadow-sm border border-purple-100 text-center'>
            <div className='max-x-xs mx-auto py-6'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Clock className='w-8 h-8 text-purple-500'/>
              </div>

              <h3 className='text-lg font-semibold mb-2 text-gray-800'>
                All Caught Up !
              </h3>

              <p className='text-lg font-semibold mb-4 text-gray-500'>
                No pending tasks - great work 
              </p>

              <button
                onClick={() => setShowModel(true)}
                className='px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors'
              >
                Create New Task
              </button>
            </div>
          </div>
        ) : (
            sortedPendingTask.map(task => (

              <TaskItem 
                key={task._id || task.id}
                task={task}
                showCompleteCheckBox
                onDelete = {() => handleDelete(task._id || task.id)}
                onToggleComplete = {() => handleToggleComplete(
                  task._id || task.id,
                  task.completed
                )}
                onEdit={() => {selectedTask(task); setShowModel(true);}}
                onRefresh={refreshTasks}
              />
            ))
        )}
      </div>

      <TaskModel 
        isOpen={!!selectedTask || showModel}
        onClose={() => { setShowModel(false); setSelectedTask(null); refreshTasks(); }}
        taskToEdit={selectedTask}
      />

    </div>
  )
}

export default Pendingpage
