import React from 'react'
import { Zap, Cpu, ShieldCheck, LayoutTemplate, FileDown, Palette, BarChart3 } from 'lucide-react'
import Title from './Title';

const features = [
    {
        icon: <Cpu size={22} />,
        title: 'AI-Powered Content',
        description: 'Generate professional summaries and job descriptions tailored to your role instantly.',
        color: 'emerald',
        bgClass: 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20',
        borderClass: 'group-hover:border-emerald-500/30',
    },
    {
        icon: <ShieldCheck size={22} />,
        title: 'Smart ATS Analysis',
        description: 'Real-time scoring and feedback to ensure your resume passes through recruiter filters.',
        color: 'violet',
        bgClass: 'bg-violet-500/10 text-violet-500 group-hover:bg-violet-500/20',
        borderClass: 'group-hover:border-violet-500/30',
    },
    {
        icon: <LayoutTemplate size={22} />,
        title: 'Executive Templates',
        description: 'Professional, industry-standard layouts designed to impress hiring managers.',
        color: 'orange',
        bgClass: 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20',
        borderClass: 'group-hover:border-orange-500/30',
    },
    {
        icon: <FileDown size={22} />,
        title: 'Instant PDF Export',
        description: 'Download your polished resume as a print-ready PDF in a single click.',
        color: 'cyan',
        bgClass: 'bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20',
        borderClass: 'group-hover:border-cyan-500/30',
    },
    {
        icon: <Palette size={22} />,
        title: 'Custom Styling',
        description: 'Choose colors, fonts, and layouts to match your personal brand perfectly.',
        color: 'pink',
        bgClass: 'bg-pink-500/10 text-pink-500 group-hover:bg-pink-500/20',
        borderClass: 'group-hover:border-pink-500/30',
    },
    {
        icon: <BarChart3 size={22} />,
        title: 'Resume Analytics',
        description: 'Track your resume performance with detailed insights and optimization tips.',
        color: 'amber',
        bgClass: 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20',
        borderClass: 'group-hover:border-amber-500/30',
    },
];

const Features = () => {
    return (
        <div id='features' className='flex flex-col items-center py-20 px-4 scroll-mt-12'>
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-400/10 rounded-full px-4 py-1.5 font-medium">
                <Zap width={14} />
                <span>How It Works</span>
            </div>
            <Title
                title='Everything You Need to Stand Out'
                description='Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools.'
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl w-full mt-12">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className={`group relative p-6 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-xl transition-all duration-300 cursor-default ${feature.borderClass}`}
                    >
                        <div className={`size-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${feature.bgClass}`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features