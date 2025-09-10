import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, CircleCheckBig, Settings } from 'lucide-react';
import { useState } from "react";


const Navbar = () => {

    const navigate = useNavigate()
    const menuref = useRef(null)
    const [menuOpen, setmenuOpen] = useState(false)

    const handleMenuToggle = () => {
        setmenuOpen((prev) => !prev)
    }

    return (
        <header className='sticky top-0 z-50 bg-white backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>
            <div className='flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto'>

                {/* logo section */}
                <div className='flex items-center gap-2 cursor-pointer group'
                    onClick={() => navigate('/')}
                >
                
                    {/* logo container */}
                    <div className='relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg group-hover:shadow-purple-300/50 group-hover:scale-105 transition-all duration-300'>
                        <CircleCheckBig className='w-6 g-6 text-white'/>
                        <div className='absolute -bottom-1 -middle-1 w-3 h-3 bg-white rounded-full shadow-md animate-ping' />
                    </div>

                    {/* brand name */}
                    <span className='text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
                        OrganizeIt
                    </span>
                </div>

                {/* settings, login and sign-up buttons */}
                <div className='flex items-center gap-4'>
                    <button className='p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full'
                        onClick={() => navigate('/profile')}
                    >
                        <Settings className='w-5 h-5 ' />
                    </button>

                    {/* user drop_down */}
                    <div ref={menuref} className='relative'>
                        <button
                            className='flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-300 border border-transparent hover:border-purple-200'
                            onClick={handleMenuToggle}    
                        >
                            <div className='relative'>
                                {
                                    User.avatar ? (
                                        <img src={User.avatar} alt="avatar" className='w-9 h-9 rounded-full shadow-sm' />
                                    ) : (
                                        <div className='w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white font-semibold shadow-md'>
                                            {
                                                user.name?.[0]?.toUpperCase()
                                            }
                                        </div>
                                    )
                                }
                                <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse' />
                            </div>

                            <div className='text-left hidden md:block'>
                                <p className='text-sm font-medium text-gray-800'>{user.name}</p>
                                <p className='text-xs font-normal text-gray-500'>{user.email}</p>
                            </div>

                            <ChevronDown className={`w-4 h-4 `} />
                            {/* 1:39:21 */}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
