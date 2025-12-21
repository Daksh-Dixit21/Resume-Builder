import React from 'react'
import { Link } from 'react-router-dom'


const Footer = () => {
  return (
    <>
    <footer className="w-full bg-linear-to-b from-white via-green-400 to-green-600 text-white mt-20 ">  
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-6">
                    <img alt="logo" className="h-11 w-auto"
                        src="/logo.svg" />
                </div>
                <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
                    Empowering employees worldwide with the minimalistic and advanced AI resume creation tool.
                </p>
            </div>
            <div className="border-t border-green-600">
                <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
                    <p>Nexus Resume Builder ©2025. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </>
  )
}

export default Footer