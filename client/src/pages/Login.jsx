import { Mail, User2Icon, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import React from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'

const Login = () => {
    const dispatch = useDispatch()
    const query = new URLSearchParams(window.location.search)
    const urlState = query.get('state')
    const [state, setState] = React.useState(urlState || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post(`/api/users/${state}`, formData)
            dispatch(login(data))
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className='min-h-[calc(100vh-65px)] flex flex-col lg:flex-row bg-gray-50'>
            {/* Left Section: Onboarding/Welcome */}
            <div className='w-full lg:w-1/2 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-8 lg:p-20 order-1 lg:order-1 max-lg:py-12'>
                {/* Background effects */}
                <div className="absolute top-0 right-0 size-80 bg-emerald-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 size-80 bg-teal-500/10 rounded-full blur-[100px]"></div>
                
                <div className='relative z-10 max-w-md w-full text-center lg:text-left'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-sm font-medium mb-4 lg:mb-6'>
                        <Sparkles size={14} className="fill-emerald-400" />
                        <span>AI-Powered Career Growth</span>
                    </div>
                    
                    <h2 className='text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6 leading-tight'>
                        {state === "login" ? "Welcome back to ResumeAI" : "Start building your professional future"}
                    </h2>
                    
                    <p className='text-slate-400 mb-6 lg:mb-10 text-base lg:text-lg'>
                        Join thousands of professionals using our AI to craft perfect resumes and land their dream jobs.
                    </p>

                    <div className='hidden lg:block space-y-4'>
                        {[
                            'AI-Powered Content Generation',
                            'Smart ATS Optimization',
                            'Professional Template Library',
                            'Instant PDF Export'
                        ].map((feature, i) => (
                            <div key={i} className='flex items-center gap-3 text-slate-300'>
                                <CheckCircle2 size={18} className='text-emerald-500 shrink-0' />
                                <span className='text-sm font-medium'>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Section: Form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 order-2 lg:order-2'>
                <div className='w-full max-w-[400px]'>
                    <form onSubmit={handleSubmit} className="text-center bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-200/50">
                        <h1 className="text-slate-900 text-3xl font-bold tracking-tight">
                            {state === "login" ? "Sign In" : "Create Account"}
                        </h1>
                        <p className="text-slate-500 text-sm mt-2 mb-8">
                            {state === "login" ? "Enter your details to access your account" : "Sign up to start building your professional resume"}
                        </p>

                        <div className='space-y-4'>
                            {state !== "login" && (
                                <div className="flex items-center w-full bg-slate-50 border border-gray-200 h-12 rounded-xl focus-within:border-emerald-500 transition-all pl-4 gap-3">
                                    <User2Icon size={18} className="text-slate-400" />
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder="Full Name" 
                                        className="bg-transparent border-none outline-none text-slate-900 text-sm w-full" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            )}
                            
                            <div className="flex items-center w-full bg-slate-50 border border-gray-200 h-12 rounded-xl focus-within:border-emerald-500 transition-all pl-4 gap-3">
                                <Mail size={18} className="text-slate-400" />
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Email address" 
                                    className="bg-transparent border-none outline-none text-slate-900 text-sm w-full" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            
                            <div className="flex items-center w-full bg-slate-50 border border-gray-200 h-12 rounded-xl focus-within:border-emerald-500 transition-all pl-4 gap-3">
                                <Lock size={18} className="text-slate-400" />
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Password" 
                                    className="bg-transparent border-none outline-none text-slate-900 text-sm w-full" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" className="mt-8 w-full h-12 rounded-xl text-white bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                            {state === "login" ? "Sign In" : "Sign Up"}
                            <ArrowRight size={18} />
                        </button>

                        <p className="text-slate-500 text-sm mt-8">
                            {state === "login" ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                type="button"
                                onClick={() => setState(prev => prev === "login" ? "register" : "login")} 
                                className="ml-1 text-emerald-600 font-bold hover:underline"
                            >
                                {state === "login" ? "Register" : "Login"}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login