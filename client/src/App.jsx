import React, { useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Preview from './pages/Preview'
import Portfolio from './pages/Portfolio'
import PortfolioSettings from './pages/PortfolioSettings'
import CoverLetterGenerator from './pages/CoverLetterGenerator'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import {login, setLoading}from './app/features/authSlice'
import {Toaster} from 'react-hot-toast'

const App = () => {

  const dispatch = useDispatch()

  const getUserData = async ()=>{
    const auth = JSON.parse(localStorage.getItem('auth'))
    try {
      if(auth && auth.token){
        const {data} = await api.get('/api/users/data')
        if(data.user){
          dispatch(login({token: auth.token, user: data.user}))
        }
        dispatch(setLoading(false))
      } else {
        dispatch(setLoading(false))
      }
      } catch (error){
        dispatch(setLoading(false))
        console.log(error.message)
    }
  }

  useEffect(()=>{
    getUserData()
  },[])

  return (
    <>
    <Toaster />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='app' element={<Layout />}>
        <Route index element ={<Dashboard />}/>
        <Route path='builder/:resumeId' element ={<ResumeBuilder />}/>
        <Route path='cover-letter/new' element={<CoverLetterGenerator />} />
        <Route path='portfolio' element={<PortfolioSettings />} />
      </Route>
      <Route path='view/:resumeId' element ={<Preview />}/>
      <Route path='portfolio/:username' element={<Portfolio />} />
    </Routes>
    </>
  )
}

export default App