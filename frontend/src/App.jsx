import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './pages/Dashboard'
import Pendingpage from './pages/Pendingpage'
import CompletePage from './pages/CompletePage'
import Profile from './components/Profile'

const API_URL = "https://organizeit-backend-ifkw.onrender.com/api/tasks" 

function App() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  const handleAuthSubmit = data => {
    const user = {
      email: data.email,
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    }

    setCurrentUser(user)
    navigate('/', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  // ProtectedLayout with tasks & refreshTasks
  const ProtectedLayout = () => {
    const [tasks, setTasks] = useState([])

    const refreshTasks = async () => { 
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch(`${API_URL}/taskss`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setTasks(data.tasks)
        } else {
          setTasks([])
          console.error("Failed to fetch tasks:", data.message)
        }
      } catch (err) {
        console.error("Error fetching tasks:", err)
      }
    }

    useEffect(() => {
      refreshTasks() // fetch tasks on mount
    }, [])

    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <Outlet context={{ tasks, refreshTasks }} /> 
      </Layout>
    )
  }

  return (
    <Routes>
      <Route
        path='/login'
        element={
          <div className='fixed inset-0 bg-black flex items-center justify-center'>
            <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
          </div>
        }
      />

      <Route
        path='/signup'
        element={
          <div className='fixed inset-0 bg-black flex items-center justify-center'>
            <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
          </div>
        }
      />

      {/* Protected Routes */}
      <Route element={currentUser ? <ProtectedLayout /> : <Navigate to='/login' replace />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/pending' element={<Pendingpage />} />
        <Route path='/complete' element={<CompletePage />} />
        <Route path='/profile' element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
      </Route>

      <Route path='*' element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
