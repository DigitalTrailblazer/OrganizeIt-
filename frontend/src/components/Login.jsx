import React, { useEffect, useId, useState } from 'react'
import {Eye, EyeOff, Icon, Lock, LogIn, Mail } from 'lucide-react'
import {toast, ToastContainer} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from "axios";

 


  const INITIAL_FORM = {
    email : "",
    password : ""
  }

    const FIELDS = [
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock, isPassword : true},
  ]


const Login = ({onSubmit, onSwitchMode}) => {

    const API_URL = "http://localhost:1111"
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(INITIAL_FORM)
    const [showPassword, setShowPassword] = useState(false)


    useEffect(() => { 
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      if(token){
        (async () => {
          try {

            const { data } = await axios.get(`${API_URL}/api/user/me/`, {

              headers : { Authorization : `Bearer ${token}` }
            })
            if(data.success){
              onSubmit?.({token, userId, ...data.user})

              toast.success("Session restored !")
              navigate('/')
            }
            else{
              localStorage.clear()
            }
          } 
          catch{
            localStorage.clear()
          }
        })()
      }
    }, [navigate, onSubmit])


    const handleSubmit = async e => {
      e.preventDefault()
      setLoading(true)

      try {

        const { data } = await axios.post(`${API_URL}/api/user/login`, formData)

        if(!data.token){
          throw new Error(data.mesage || "Login Failed !")
        }

        // save to local storage
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.user.id)

        setFormData(INITIAL_FORM)
        onSubmit?.({token : data.token, userId : data.user.id, ...data.user})
        toast.success("Login Successfull")

        setTimeout(() => {
          navigate('/')
        }, 1000)

      } 
      catch (err) {
        const msg = err.response?.data?.message || err.message
        toast.error(msg)
      }
      finally{
        setLoading(false)
      }
    }

    // const handleSwitchMode = () => {
    //   toast.dismiss()
    //   onSwitchMode?.
    // }



  return (
    <div className='max-w-md bg-white w-full shadow-lg border border-purple-100 p-8 rounded-xl'>
        <ToastContainer position='top-center' autoClose={3000} hideProgressBar/>

        <div className='mb-6 text-center'>
          <div className='w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-pruple-600 rounded-full mx-auto flex items-center justify-center mb-4'>
            <LogIn className='w-8 h-8 text-white' />
          </div>

          <h2 className='text-2xl font-bold text-gray-80000'>Welcome Back !</h2>
          <p className='text-gray-500 text-sm mt-1'>Sign in to continue to Orgainze your tasks...</p>
        </div>

        <form action="" onSubmit={handleSubmit} className='space-y-4'>
            {FIELDS.map(({name, type, placeholder, icon:Icon, isPassword}) => (
              <>
                <div key={name}
                  className='flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200'
                >
                  <Icon className="text-purple-500 w-5 h-5 mr-2" />

                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}

                    className='w-full focus:outline-none text-sm text-gray-700 ' />

                  {isPassword && (
                    <button type='button'
                      onClick={() => setShowPassword((prev) => !prev)}
                      className='ml-2 hover:text-purple-500 transition-colors'
                    >
                      {showPassword ? <EyeOff className='w-5 h-5 bg-transparent' /> : <Eye className='w-5 h-5 bg-transparent' />}
                    </button>
                  )}
                </div>
              </>
            ))}

            <button
              type='submit'
              disabled={loading}
              className='cursor-pointer w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2'
            >
              {loading ? (
                "Loggiing in..."
              ) : (
                <>
                  <LogIn className='w-4 h-4 cursor-pointer' />
                  Login
                </>
              )}
            </button>
        </form>

        <p className='text-center text-sm text-gray-600 mt-6'>
          Don't have an account ?{" "}
          <button
            type='button'
            onClick={onSwitchMode }
            className='tex-purple-600 hover:text-purple-700 cursor-pointer'
          >
            Sign Up
          </button>
        </p>
    </div>
  )
}

export default Login
