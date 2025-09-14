import { ChevronLeft, UserCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'



const personalFields = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
]

const API_URL = "http://localhost:1111"


const Profile = ({setCurrentUser, onLogout}) => {

    const navigate = useNavigate()

    const [profile, setProfile]  = useState({name : "", lemail : ""})
    const [password, setPassword] = useState({current : "", new : "", confirm : ""})
    

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer position='top-center' autoClose={3000} />

      <div className='max-w-4xl mx-auto p-6'>
        <button
            onClick={() => navigate(-1)}
            className='flex items-center text-gray-600 hover:text-purple-600 mb-8 transition-colors duration-200'
        >
            <ChevronLeft className='w-5 h-5 mr-1' />
            Back to Dashboard
        </button>

        <div className='flex items-center gap-4 mb-8'>
            <div className='w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md'>

                {profile.name? profile.name[0].toUpperCase() : "U"}
            </div>
            <div>
                <h1 className='text-[20px] font-bold text-gray-800'>Explore your Account</h1>
                <p className='text-gray-500 text-sm '>Manage your profile</p>
            </div>
        </div> 

        <div className='grid md:grid-cols-2 gap-8'>
            <section className='bg-white rounded-xl shadow-sm border border-purple-100 p-6'>
                <div className='flex items-center gap-2 mb-6'>
                    <UserCircle className='text-purple-500 w-5 h-5' />
                    <h2 className='text-xl font-semibold text-gray-800'>Personal Information</h2>

                    {/* PERSONAL INFO SECTION */}
                    <form onSubmit={saveProfile} className='space-y-4'>

                    </form>
                </div>
            </section>

        </div>

      </div>
    </div>
  )
}

export default Profile


// 3    :   20  :   52