import React from 'react'
import { Sparkles } from 'lucide-react'

const Banner = () => {
    return (
        <div className="w-full py-2.5 text-sm text-center bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white/90">
            <p className="flex items-center justify-center gap-2">
                <Sparkles size={14} className="animate-pulse" />
                <span><strong>ResumeAI</strong> — Build professional resumes powered by AI.</span>
            </p>
        </div>
    );
};

export default Banner