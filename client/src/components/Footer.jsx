import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Github, Heart } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="w-full bg-slate-950 text-white mt-auto">
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
                {/* Top section */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-12">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="size-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                <FileText size={18} className="text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">ResumeAI</span>
                        </div>
                        <p className="text-sm text-white/40 max-w-xs text-center md:text-left leading-relaxed">
                            Empowering job seekers worldwide with AI-powered tools to create, optimize, and land their dream careers.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-16">
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Product</h4>
                            <ul className="space-y-2.5 text-sm text-white/50">
                                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                                <li><Link to="/app" className="hover:text-white transition">Builder</Link></li>
                                <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Connect</h4>
                            <ul className="space-y-2.5 text-sm text-white/50">
                                <li>
                                    <a href="https://github.com/Daksh-Dixit21" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition">
                                        <Github size={14} />
                                        <span>GitHub</span>
                                    </a>
                                </li>
                                <li><a href="#cta" className="hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10"></div>

                {/* Bottom */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-white/30">
                    <p>
                        &copy; {new Date().getFullYear()} Daksh Dixit. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1.5">
                        Built with <Heart size={12} className="text-red-400 fill-red-400" /> by
                        <a href="https://github.com/Daksh-Dixit21" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition font-medium">
                            Daksh Dixit
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer
