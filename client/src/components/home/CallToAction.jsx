import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Rocket } from 'lucide-react'

const CallToAction = () => {
    return (
        <div id='cta' className='px-4 mt-20'>
            <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute top-0 right-0 size-80 bg-emerald-500/15 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 size-60 bg-teal-500/10 rounded-full blur-[80px]"></div>

                {/* Content */}
                <div className="relative flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-8 sm:px-16 py-16 sm:py-20">
                    <div className="max-w-lg">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            Ready to Build Your Dream Resume?
                        </h2>
                        <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                            Join thousands of professionals who landed their dream jobs with ResumeAI. Start building for free today.
                        </p>
                    </div>
                    <Link to='/app?state=register' className="flex items-center gap-2 rounded-full py-3.5 px-10 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all text-white font-semibold shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0">
                        <span>Get Started Free</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CallToAction