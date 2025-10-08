import { Icon, UserPlus, User, Mail, Lock } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'


  const API_URL = "https://organizeit-backend-ifkw.onrender.com"
  const INITIAL_FORM = {
    name : "",
    email : "",
    password : ""
  }

  const FIELDS = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
  ]



const SignUp = ({onSwitchMode}) => {

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({text : "", type: ""})


  const handleSubmit = async (e) => {

    e.preventDefault()
    setLoading(true)
    setMessage({text : "", type : ""})

    try {
      
      const { data } = await axios.post(`${API_URL}/api/user/register`, formData)
      
      console.log("signUp successfull !!", data)
      setMessage({
        text : "Registration Successfull ! You can now login.",
        type : 'success'
      })
      setFormData(INITIAL_FORM)

    } 
    catch (err) {
      console.error("SignUp Error : ",err)
      setMessage({
        text : err.response?.data?.message || "An error occured. Please try again later.",
        type : "error"
      })
    }
    finally{
      setLoading(false)
    }
  }


  return (
    <div className='max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8'>
      <div className='mb-6 text-center'>
        <div className='w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4'>
          <UserPlus className='w-8 h-8 text-white'/>
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>
          Create Account
        </h2>
        <p className='text-gray-500 text-sm mt-1'>OrganizeIt - Simple. Smart. Prioritized.</p>
      </div>

      {message.text && (
        <div className={message.type === "success" ? "bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100" : "bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100"}>
          {message.text}
        </div>
      )}

      <form action="" onSubmit={handleSubmit} className='space-y-4'>

        {FIELDS.map(({name, type, placeholder, icon:Icon}) => (
          <div key={name}
            className='flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200'
          >
            <Icon className="text-purple-500 w-5 h-5 mr-2" />

            <input 
              type={type} 
              placeholder={placeholder} 
              value={formData[name]} 
              onChange={(e) => setFormData({...formData, [name] : e.target.value })} 

              className='w-full focus:outline-none text-sm text-gray-700'
            />
          </div>
        ))}

        <button 
          type='submit' 
          disabled = {loading}
          className='w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:bg-purple-800'
        >
          {loading ? "Signing Up..." : <> <UserPlus className='w-4 h-4'/> Sign Up </>}
        </button>
      </form>

      <p className='text-center text-sm text-gray-600 mt-6'>
        Already have an account ?{" "}
        <button
          onClick={onSwitchMode}
          className='text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors cursor-pointer'
        >
          Login
        </button>
      </p>

    </div>
  )
}

export default SignUp
