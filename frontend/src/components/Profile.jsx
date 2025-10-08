import axios from 'axios'
import { ChevronLeft, Lock, LogOut, Mail, Save, Shield, User, UserCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const personalFields = [
  { name: "name", type: "text", placeholder: "Full Name", icon: User },
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
]

const securityFields = [
    { name: "current", placeholder: "Current Password" },
    { name: "new", placeholder: "New Password" },
    { name: "confirm", placeholder: "Confirm Password" },
];

const API_URL = "https://organizeit-backend-ifkw.onrender.com"

const Profile = ({ setCurrentUser, onLogout }) => {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({ name: "", email: "" })
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" })

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${API_URL}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          if (data.success) {
            setProfile({ name: data.user.name, email: data.user.email })
          } else {
            toast.error(data.message)
          }
        })
        .catch(() => toast.error("Unable to load Profile."))
    }
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`
        }))
        toast.success("Profile Updated!")
      } else toast.error(data.message)
    }
    catch (err) {
      toast.error(err.response?.data?.message || "Profile Update Failed")
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()

    if(password.new != password.confirm){
        return toast.error("Password does not match !")
    }

    try {
        
        const token = localStorage.getItem('token')
        const {data} = await axios.put(
            `${API_URL}/api/user/password`,
            {currentPassword : password.current, newPassword : password.new},
            {headers : {Authorization : `Bearer ${token}`}}
        )

        if(data.success){
            toast.success("Password Changed")
            setPassword({
                current : "",
                new : "",
                confirm : ""
            })
        }
        else{
            toast.error(data.message)
        }
    } 
    catch (err) {
        toast.error(err.response?.data?.message || "Password Change Failed")
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-purple-600 mb-8 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-gray-800">Explore your Account</h1>
            <p className="text-gray-500 text-sm">Manage your profile</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            </div>

            {/* PERSONAL INFO SECTION */}
            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div
                  key={name}
                  className="flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200"
                >
                  <Icon className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </form>
          </section>

          <section className='bg-white rounded-xl shadow-sm border border-purple-100 p-6'>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>

            <form action="" onSubmit={changePassword} className='space-y-4' >
              {securityFields.map(({name, placeholder}) => (
                <div
                  key={name}
                  className="flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200"
                >
                  <Lock className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type="password"
                    required
                    placeholder={placeholder}
                    value={password[name]}
                    onChange={(e) =>
                      setPassword({ ...password, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                  />
                </div>
              ))}

                <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Shield className="w-4 h-4" /> Change Password
              </button>

              <div className='mt-8 pt-6 border-t border-purple-100'>
                <h3 className='text-red-600 font-semibold mb-4 flex items-center gap-2'>
                    <LogOut className='w-4 h-4' /> Danger Zone 
                </h3>

                <button
                    onClick={onLogout}
                    className='w-full text-red-600 border border-red-200 py-2.5 rounded-lg hover:bg-red-50 transition-colors duration-200'
                >
                    Logout 
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile
