import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, FileText, Briefcase, GraduationCap, Code, Mail, MapPin, Phone } from 'lucide-react';

const ResumeMockup = () => (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-[280px] text-left overflow-hidden">
        {/* Resume Header */}
        <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-4">
            <h3 className="text-sm font-bold text-white">Alex Mitchell</h3>
            <p className="text-[10px] text-emerald-100 font-medium mt-0.5">Senior Software Engineer</p>
            <div className="flex gap-3 mt-2 text-[8px] text-emerald-200">
                <span className="flex items-center gap-0.5"><Mail size={7}/> alex@email.com</span>
                <span className="flex items-center gap-0.5"><MapPin size={7}/> New York</span>
            </div>
        </div>
        <div className="px-5 py-3 space-y-3">
            {/* Summary */}
            <div>
                <h4 className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Summary</h4>
                <div className="space-y-1">
                    <div className="h-1.5 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-1.5 bg-slate-100 rounded-full w-4/5"></div>
                </div>
            </div>
            {/* Experience */}
            <div>
                <h4 className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Experience</h4>
                <div className="space-y-2">
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-semibold text-slate-700">Lead Engineer — Google</span>
                            <span className="text-[7px] text-slate-400">2022–Now</span>
                        </div>
                        <div className="space-y-0.5 mt-1">
                            <div className="h-1 bg-slate-100 rounded-full w-full"></div>
                            <div className="h-1 bg-slate-100 rounded-full w-3/4"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-semibold text-slate-700">SDE II — Amazon</span>
                            <span className="text-[7px] text-slate-400">2019–22</span>
                        </div>
                        <div className="space-y-0.5 mt-1">
                            <div className="h-1 bg-slate-100 rounded-full w-full"></div>
                            <div className="h-1 bg-slate-100 rounded-full w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Skills */}
            <div>
                <h4 className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Skills</h4>
                <div className="space-y-1.5">
                    {[
                        { name: 'React & Node.js', width: '92%' },
                        { name: 'System Design', width: '85%' },
                        { name: 'Python / ML', width: '78%' },
                    ].map((skill) => (
                        <div key={skill.name}>
                            <div className="flex justify-between">
                                <span className="text-[8px] text-slate-600">{skill.name}</span>
                                <span className="text-[7px] text-slate-400">{skill.width}</span>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                                <div
                                    className="h-full bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"
                                    style={{ width: skill.width }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Education */}
            <div>
                <h4 className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Education</h4>
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-semibold text-slate-700">M.S. Computer Science</span>
                    <span className="text-[7px] text-slate-400">MIT</span>
                </div>
            </div>
        </div>
    </div>
);

const BuilderSidebar = () => (
    <div className="hidden md:flex flex-col w-44 space-y-2.5 shrink-0">
        {[
            { icon: <FileText size={12} />, label: 'Personal Info', active: false },
            { icon: <Briefcase size={12} />, label: 'Experience', active: true },
            { icon: <Code size={12} />, label: 'Skills', active: false },
            { icon: <GraduationCap size={12} />, label: 'Education', active: false },
        ].map((item) => (
            <div key={item.label}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-medium transition-all ${
                    item.active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-white/40 hover:text-white/60 border border-transparent'
                }`}
            >
                {item.icon}
                <span>{item.label}</span>
            </div>
        ))}
        {/* Fake form fields */}
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
            <div className="h-2 bg-white/10 rounded w-16"></div>
            <div className="h-6 bg-white/5 border border-white/10 rounded-md"></div>
            <div className="h-2 bg-white/10 rounded w-20 mt-2"></div>
            <div className="h-6 bg-white/5 border border-white/10 rounded-md"></div>
            <div className="h-2 bg-white/10 rounded w-14 mt-2"></div>
            <div className="h-14 bg-white/5 border border-white/10 rounded-md"></div>
        </div>
    </div>
);

const Hero = () => {
    const { user } = useSelector(state => state.auth);
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <>
            <div className="relative min-h-screen bg-slate-950 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 hero-grid"></div>
                <div className="absolute top-10 left-1/4 size-80 bg-emerald-500/15 rounded-full blur-[120px] animate-float"></div>
                <div className="absolute bottom-40 right-1/5 size-72 bg-teal-500/10 rounded-full blur-[100px] animate-float-delayed"></div>
                <div className="absolute top-1/3 right-1/3 size-96 bg-indigo-500/8 rounded-full blur-[140px]"></div>

                {/* Navbar */}
                <nav className="relative z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-black text-xl text-white">
                            R
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">ResumeAI</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
                        <a href="#" className="hover:text-white transition font-medium">Home</a>
                        <a href="#features" className="hover:text-white transition font-medium">Features</a>
                        <a href="#testimonials" className="hover:text-white transition font-medium">Testimonials</a>
                        <a href="#cta" className="hover:text-white transition font-medium">Contact</a>
                    </div>

                    <div className="hidden md:flex gap-3">
                        {!user ? (
                            <>
                                <Link to='/app?state=login' className="px-6 py-2 text-sm border border-white/20 text-white/80 hover:text-white hover:border-white/40 rounded-full transition-all active:scale-95">
                                    Login
                                </Link>
                                <Link to='/app?state=register' className="px-6 py-2 text-sm bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <Link to='/app' className="px-8 py-2 text-sm bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <button onClick={() => setMenuOpen(true)} className="md:hidden text-white active:scale-90 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 5h16M4 12h16M4 19h16" />
                        </svg>
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div className={`fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-lg gap-6 md:hidden transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                    <a href="#" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition">Home</a>
                    <a href="#features" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition">Features</a>
                    <a href="#testimonials" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition">Testimonials</a>
                    <a href="#cta" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition">Contact</a>
                    <div className="flex gap-3 mt-4">
                        {!user ? (
                            <>
                                <Link to='/app?state=login' onClick={() => setMenuOpen(false)} className="px-6 py-2 text-sm border border-white/20 text-white rounded-full">Login</Link>
                                <Link to='/app?state=register' onClick={() => setMenuOpen(false)} className="px-6 py-2 text-sm bg-emerald-500 text-white rounded-full">Get Started</Link>
                            </>
                        ) : (
                            <Link to='/app' onClick={() => setMenuOpen(false)} className="px-8 py-2 text-sm bg-emerald-500 text-white rounded-full">Dashboard</Link>
                        )}
                    </div>
                    <button onClick={() => setMenuOpen(false)} className="mt-4 size-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition">✕</button>
                </div>

                {/* Hero Content */}
                <div className="relative flex flex-col items-center text-center px-4 md:px-16 lg:px-24 xl:px-40 pt-12 md:pt-20">
                    {/* Badge */}
                    <div className="animate-fade-in-up flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-sm font-medium mb-8">
                        <Sparkles size={14} className="fill-emerald-400" />
                        <span>AI-Powered Resume Builder</span>
                    </div>

                    {/* Headline */}
                    <h1 className="animate-fade-in-up-delay-1 text-4xl sm:text-5xl md:text-7xl font-bold max-w-5xl leading-[1.1] tracking-tight text-white">
                        Build a Job-Winning Resume{' '}
                        <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">in Minutes</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="animate-fade-in-up-delay-2 max-w-2xl text-base sm:text-lg md:text-xl text-white/50 mt-6 mb-8 leading-relaxed">
                        Go beyond basic templates. Use AI to craft perfect content, beat ATS filters, and land your dream job faster than ever.
                    </p>

                    {/* Feature Pills */}
                    <div className="animate-fade-in-up-delay-2 flex flex-wrap justify-center gap-2.5 mb-10">
                        {['AI Content Generation', 'Smart ATS Scoring', 'Premium Templates', 'Instant PDF Export'].map((feature) => (
                            <div key={feature} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 backdrop-blur-sm">
                                <div className="size-1.5 rounded-full bg-emerald-400"></div>
                                <span className="text-xs font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center gap-4">
                        <Link to='/app' className="w-full sm:w-auto bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-10 h-14 text-base font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center transition-all active:scale-95 gap-2">
                            Create My Resume
                            <ArrowRight size={18} />
                        </Link>
                        <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all rounded-full px-10 h-14 text-base font-bold text-white/80 hover:text-white active:scale-95">
                            How it works
                        </a>
                    </div>

                    {/* Preview Mockup */}
                    <div className="animate-fade-in-up-delay-4 mt-16 md:mt-20 w-full max-w-4xl preview-tilt">
                        <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/5 animate-pulse-glow">
                            {/* Browser Chrome */}
                            <div className="bg-white/5 backdrop-blur-sm px-4 py-2.5 flex items-center border-b border-white/10">
                                <div className="flex gap-1.5">
                                    <div className="size-3 rounded-full bg-red-400/70"></div>
                                    <div className="size-3 rounded-full bg-yellow-400/70"></div>
                                    <div className="size-3 rounded-full bg-green-400/70"></div>
                                </div>
                                <div className="flex-1 text-center">
                                    <span className="text-xs text-white/30 font-mono">resumeai.app/builder</span>
                                </div>
                            </div>
                            {/* Builder Interface */}
                            <div className="bg-slate-900/80 backdrop-blur-sm p-4 md:p-6 flex gap-5">
                                <BuilderSidebar />
                                <div className="flex-1 flex justify-center">
                                    <ResumeMockup />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom fade to white */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-white to-transparent"></div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
            `}</style>
        </>
    );
}

export default Hero