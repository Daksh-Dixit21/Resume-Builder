import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../app/features/authSlice'
import { FileText, LayoutDashboard, Settings, LogOut, Menu, X, User } from 'lucide-react'

const Navbar = () => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const logoutUser = () => {
        navigate('/')
        dispatch(logout())
        setIsMenuOpen(false)
    }

    const isActive = (path) => location.pathname === path

    return (
    <div className='bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm'>
        <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 md:px-8 py-3.5'>
            <div className='flex items-center gap-10'>
                <Link to='/' className='flex items-center gap-2.5 shrink-0'>
                    <div className="size-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <FileText size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">ResumeAI</span>
                </Link>

                {user && (
                    <div className='hidden md:flex items-center gap-7'>
                        <Link to='/app' className={`text-sm font-bold transition-all flex items-center gap-2 ${isActive('/app') ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>
                        <Link to='/app/portfolio' className={`text-sm font-bold transition-all flex items-center gap-2 ${isActive('/app/portfolio') ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Settings size={16} />
                            Portfolio
                        </Link>
                    </div>
                )}
            </div>

            <div className='flex items-center gap-4'>
                {user ? (
                    <>
                        <div className='hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-100'>
                            <div className='size-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20'>
                                <User size={13} className='text-emerald-600' />
                            </div>
                            <p className='text-xs font-bold text-slate-600'>Hi, {user?.name?.split(' ')[0]}</p>
                        </div>
                        
                        <button 
                            onClick={logoutUser} 
                            className='hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition-all active:scale-95'
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </>
                ) : (
                    <div className='hidden md:flex items-center gap-4'>
                        <Link to='/app?state=login' className='text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors'>Login</Link>
                        <Link to='/app?state=register' className='px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-500/20 transition-all active:scale-95'>Get Started</Link>
                    </div>
                )}

                {/* Mobile Menu Button */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='md:hidden p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors'>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-x-0 top-[65px] bg-white border-b border-slate-100 shadow-xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <div className='p-5 flex flex-col gap-5'>
                {user ? (
                    <>
                        <Link to='/app' onClick={() => setIsMenuOpen(false)} className={`text-base font-bold flex items-center gap-3 ${isActive('/app') ? 'text-emerald-600' : 'text-slate-500'}`}>
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>
                        <Link to='/app/portfolio' onClick={() => setIsMenuOpen(false)} className={`text-base font-bold flex items-center gap-3 ${isActive('/app/portfolio') ? 'text-emerald-600' : 'text-slate-500'}`}>
                            <Settings size={20} /> Portfolio
                        </Link>
                        <hr className='border-slate-50' />
                        <button onClick={logoutUser} className='flex items-center gap-3 text-base font-bold text-rose-500'>
                            <LogOut size={20} /> Logout
                        </button>
                    </>
                ) : (
                    <div className='flex flex-col gap-3'>
                        <Link to='/app?state=login' onClick={() => setIsMenuOpen(false)} className='w-full py-3 text-center text-sm font-bold border border-slate-200 rounded-full text-slate-600'>Login</Link>
                        <Link to='/app?state=register' onClick={() => setIsMenuOpen(false)} className='w-full py-3 text-center text-sm font-bold bg-emerald-500 text-white rounded-full'>Get Started</Link>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Navbar