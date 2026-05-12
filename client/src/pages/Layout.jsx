import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Login from './Login'

const Layout = () => {

  const {user, loading} = useSelector(state => state.auth)

  if(loading){
    return <Loader />
  }

  return (
    <div className='min-h-screen flex flex-col'>
        <Navbar/>
        <div className='flex-1 flex flex-col'>
            {user ? <Outlet/> : (
              <>
                <div className='flex-1'>
                  <Login />
                </div>
                <Footer />
              </>
            )}
        </div>
    </div>
  )
}

export default Layout