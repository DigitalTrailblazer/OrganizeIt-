import { CheckCircle2, Home, Lightbulb, ListChecks, Menu, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';


  const menuItems = [
    { text: "Dashboard", path: "/", icon: <Home className="w-5 h-5 mr-1" /> },
    { text: "Pending Tasks", path: "/pending", icon: <ListChecks className="w-5 h-5 mr-1" /> },
    { text: "Completed Tasks", path: "/complete", icon: <CheckCircle2 className="w-5 h-5 mr-1" /> },
  ]

const Sidebar = ({user, tasks}) => {

  const[mobileOpen, setMobileOpen] = useState(false);
  const[showModel, setShowModel] = useState(false);

  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((t) => t.completed).length || 0
  const productivity = totalTasks > 0 ? Math.round((completedTasks/totalTasks) * 100) : 0

  const username = user?.name || "User"
  const initial = username.charAt(0).toUpperCase()


  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto"

    return () => {
      document.body.style.overflow = "auto"
    }

  }, [mobileOpen])

  const renderMenuItems =(isMobile = false) => (
    <ul className='space-y-2'>

      {menuItems.map(({text, path, icon}) => (
        <li key={text}>
          <NavLink to={path} className={({isActive}) => [
            'group flex items-center px-4 py-3 rounded-xl transition-all duration-300',
            isActive ? "bg-gradient-to-r from-purple-50 to-fuchsia-50 border-l-4 border-purple-500 text-purple-700 font-medium shadow-sm" : "hover:bg-purple-50/50 text-gray-600 hover:text-purple-700",
            isMobile ? "justify-start" : "lg:justify-start"
          ].join(" ")} onClick={() => setMobileOpen(false)} >
          
          <span className='transition-transform duration-300 group-hover:scale-110 text-purple-500'>
            {icon}
          </span>
          <span className={`${isMobile ? "block" : "hidden lg:block"} `}>
            {text}
          </span>
          </NavLink>
        </li>
      ))}
    </ul>
  )


  return (
    <>

      <div className='hidden md:flex flex-col fixed h-full w-20 lg:w-68 bg-white/90 backdrop-blur-sm border-r border-purple-100 shadow-sm z-20 transition-all duration-300'>
        <div className='p-5 border-b border-purple-100 lg:block hidden'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md bg-gradient-to-br from-fuchsia-500 to-purple-600'>
              {initial}
            </div>

            <div className='items-center justify-between'>
              <h2 className='text-lg font-bold text-gray-800'>Hello, {username}</h2>
              <p className='ml-1 text-sm text-purple-500 font-medium flex items-center gap-1'><Sparkles className='w-3 h-3' /> Let's Crush Your Tasks</p>
            </div>
          </div>
        </div>

        <div className='p-4 space-y-6 overflow-y-auto flex-1'>
          <div className='bg-purple-50/50 rounded-xl p-3 border border-purple-100'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-xs font-semibold text-purple-700'>
                PRODUCTIVITY METRE
              </h3>
              <span className='text-xs font-semibold text-purple-700'>
                {productivity}%
              </span>
            </div>
            <div className='w-full h-2 bg-purple-200 rounded-full overflow-hidden'>
              
              <div 
                className='h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 animate-pulse'
                style = {{ width: `${productivity}%` }}
              >
              </div>

            </div>
          </div>

          {renderMenuItems()}

          <div className='mt-auto pt-6 lg:block hidden'>
            <div className='bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl p-4 border border-purple-100'>
              <div className='flex items-center gap-2'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <Lightbulb className='w-5 h-5 text-purple-600' /> 
                </div>

                <div>
                  <h3 className='text-sm font-semibold text-gray-800'>Pro Tip</h3>
                  <p className='text-xs text-gray-600 mt-1'>Use Keyboard Shortcuts to boost productivity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU FOR MOBILE USERS */}
      {!mobileOpen && (
        <button 
          onClick={() => setMobileOpen(true)}
          className='absolute md:hidden top-25 left-5 z-50 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition'
        >
          <Menu className='w-5 h-5' />
        </button>
      )}

      {/* MENU DRAWER FOR MOBILE */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div 
            className="absolute md:hidden top-0 left-0 h-full w-64 bg-white text-gray-800 p-6 shadow-2xl rounded-r-2xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-purple-600">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-600 hover:text-purple-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md bg-gradient-to-br from-fuchsia-500 to-purple-600">
                {initial}
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mt-10">Hey, {username}</h2>
                <p className="text-sm text-purple-500 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Let's crush some tasks!
                </p>
              </div>
            </div>

            {/* Menu Items */}
            {renderMenuItems(true)}
          </div>
        </div>
      )}


    </>
  )
}

export default Sidebar
