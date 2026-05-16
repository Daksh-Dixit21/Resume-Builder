import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Phone, ExternalLink, Download, BriefcaseBusiness, GraduationCap, Sparkles, Share2, CodeXml, Award, Building2, User, Layout } from 'lucide-react'
import api from '../configs/api'

const defaultStyle = {
    template: 'bento',
    accentColor: '#10b981',
    fontFamily: 'Outfit',
    backgroundStyle: 'mesh',
    glassmorphism: false,
    borderRadius: '0px',
    showResumeDownload: true,
    visibleSections: {
        about: true,
        experience: true,
        projects: true,
        skills: true,
        education: true,
        certifications: true,
        languages: true,
    },
}

const Portfolio = () => {
    const { username } = useParams()
    const { user: currentUser } = useSelector(state => state.auth)
    const [portfolio, setPortfolio] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        loadPortfolio()
    }, [username])

    const loadPortfolio = async () => {
        try {
            const { data } = await api.get(`/api/portfolio/${username}`)
            setPortfolio(data.portfolio)
        } catch (err) {
            setError(err?.response?.data?.message || 'Portfolio not found')
        } finally {
            setLoading(false)
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-slate-50'>
                <div className='animate-spin size-8 border-3 border-emerald-500 border-t-transparent rounded-full'></div>
            </div>
        )
    }

    if (error || !portfolio) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4'>
                <h1 className='text-6xl font-bold text-slate-200 mb-4'>404</h1>
                <p className='text-lg text-slate-500 mb-6'>{error || "Portfolio not found"}</p>
                <Link to='/' className='px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors'>
                    Go Home
                </Link>
            </div>
        )
    }

    const { name, bio, portfolioImage, socialLinks, resume } = portfolio
    const isOwner = currentUser?.username === portfolio.username

    const style = {
        ...defaultStyle,
        template: portfolio.portfolioStyle?.template || 'bento',
        ...(portfolio.portfolioStyle || {}),
        visibleSections: { ...defaultStyle.visibleSections, ...(portfolio.portfolioStyle?.visibleSections || {}) },
    }
    const info = resume?.personal_info || {}
    const accent = style.accentColor || '#10b981'
    const template = style.template
    const isStudio = template === 'studio'
    const isClassic = template === 'classic'
    const isBento = template === 'bento' || template === 'clean'
    const displayImage = portfolioImage || info.image

    const socialItems = [
        { icon: Github, url: socialLinks?.github || info.github, label: 'GitHub' },
        { icon: Linkedin, url: socialLinks?.linkedin || info.linkedin, label: 'LinkedIn' },
        { icon: Twitter, url: socialLinks?.twitter, label: 'Twitter' },
        { icon: Globe, url: socialLinks?.website || info.website, label: 'Website' },
    ].filter(s => s.url)

    const getBackground = () => {
        if (style.backgroundStyle === 'mesh') {
            return {
                background: `radial-gradient(at 0% 0%, ${accent}15 0px, transparent 50%), 
                            radial-gradient(at 100% 100%, ${accent}10 0px, transparent 50%),
                            radial-gradient(at 100% 0%, #f1f5f9 0px, transparent 50%)`,
                backgroundColor: '#f8fafc'
            }
        }
        if (style.backgroundStyle === 'gradient') {
            return {
                background: `linear-gradient(135deg, #f8fafc 0%, ${accent}08 100%)`,
            }
        }
        if (style.backgroundStyle === 'grain') {
            return {
                backgroundColor: '#f1f5f9',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundBlendMode: 'overlay',
                opacity: 0.8
            }
        }
        return { backgroundColor: style.backgroundStyle === 'solid' ? '#ffffff' : '#f8fafc' }
    }

    // Enhance Bento cards with a vibrant theme tint instead of harsh white
    const cardStyles = {
        borderRadius: style.borderRadius || '0px',
        backgroundColor: style.glassmorphism ? 'rgba(255, 255, 255, 0.7)' : (isBento ? `${accent}05` : '#ffffff'),
        backdropFilter: style.glassmorphism ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: style.glassmorphism ? 'blur(12px)' : 'none',
        border: `1px solid ${style.glassmorphism ? 'rgba(255, 255, 255, 0.3)' : (isBento ? `${accent}20` : '#e2e8f0')}`,
    }

    const sectionTitle = (label, Icon, isAccentBg = false) => (
        <div className='flex items-center gap-3 mb-6'>
            <div className='relative'>
                {!isAccentBg && <div className='absolute inset-0 blur-lg opacity-20' style={{ backgroundColor: accent }}></div>}
                <span className={`relative size-10 flex items-center justify-center border ${isAccentBg ? 'bg-white/20 border-white/20 text-white' : 'bg-white'}`} style={!isAccentBg ? { borderColor: isBento ? `${accent}30` : '#e2e8f0', color: accent, borderRadius: style.borderRadius } : { borderRadius: style.borderRadius }}>
                    <Icon className='size-5' />
                </span>
            </div>
            <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isAccentBg ? 'text-white/70' : 'text-slate-400'}`}>{label}</h2>
        </div>
    )

    return (
        <div className={`min-h-screen text-slate-800 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden`} style={{ ...getBackground(), fontFamily: `"${style.fontFamily}", sans-serif` }}>
            {style.backgroundStyle === 'grain' && <div className='fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url("https://grainy-gradients.vercel.app/noise.svg")]'></div>}
            
            <div className='max-w-7xl mx-auto px-6 py-12 lg:py-20'>
                {isBento ? (
                    <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
                        {/* HERO BLOCK */}
                        <header className='md:col-span-8 flex flex-col justify-center p-8 lg:p-12 min-h-[400px] relative overflow-hidden group shadow-lg' style={{ ...cardStyles, backgroundColor: accent, border: 'none' }}>
                            <div className='absolute top-0 right-0 w-64 h-64 blur-3xl opacity-20 bg-white -mr-32 -mt-32 rounded-full transition-transform duration-1000 group-hover:scale-150'></div>
                            <div className='relative z-10'>
                                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md text-white border border-white/20'>
                                    <Sparkles className='size-3 text-white' /> Available for projects
                                </div>
                                <h1 className='text-6xl lg:text-8xl font-black mb-6 tracking-tighter text-white leading-[0.9] drop-shadow-sm'>
                                    {info.full_name || name}
                                </h1>
                                {info.profession && (
                                    <p className='text-2xl font-medium mb-8 flex items-center gap-4 text-white/90'>
                                        <span className='w-12 h-[2px] bg-white/50'></span>
                                        {info.profession}
                                    </p>
                                )}
                                <div className='flex flex-wrap items-center gap-4'>
                                    {style.showResumeDownload && resume?._id && (
                                        <Link to={`/view/${resume._id}`} className='inline-flex items-center gap-2 px-6 py-3 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all bg-white text-slate-900' style={{ borderRadius: style.borderRadius }}>
                                            <Download className='size-4' /> View Resume
                                        </Link>
                                    )}
                                    {isOwner && (
                                        <button 
                                            onClick={handleShare}
                                            className='inline-flex items-center gap-2 px-6 py-3 text-sm font-bold border-2 transition-all hover:scale-105 active:scale-95 border-white/20 bg-white/10 text-white hover:bg-white/20 shadow-sm'
                                            style={{ borderRadius: style.borderRadius }}
                                        >
                                            <Share2 className='size-4' /> {copied ? 'Copied!' : 'Share'}
                                        </button>
                                    )}
                                    {socialItems.map((s) => (
                                        <a key={s.label} href={s.url} target='_blank' rel='noopener noreferrer' className='size-12 flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-white/10 border border-white/20 text-white shadow-sm hover:bg-white hover:text-slate-900' style={{ borderRadius: style.borderRadius }} title={s.label}>
                                            <s.icon size={20} className="transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </header>

                        {/* IMAGE BLOCK */}
                        <aside className='md:col-span-4 flex items-center justify-center p-2 shadow-sm' style={{ ...cardStyles, backgroundColor: `${accent}15` }}>
                            <div className='relative w-full aspect-square overflow-hidden group' style={{ borderRadius: style.borderRadius }}>
                                {displayImage ? (
                                    <img src={displayImage} alt={name} className='size-full object-cover transition-all duration-700 scale-105 group-hover:scale-100' />
                                ) : (
                                    <div className='size-full flex items-center justify-center' style={{ backgroundColor: `${accent}20` }}>
                                        <User size={64} style={{ color: accent }} className='opacity-50' />
                                    </div>
                                )}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6'>
                                    <p className='text-white font-bold text-sm'>Let's build something great</p>
                                </div>
                            </div>
                        </aside>

                        {/* ABOUT BLOCK */}
                        {style.visibleSections.about && resume?.professional_summary && (
                            <section className='md:col-span-5 p-8 lg:p-10 relative overflow-hidden shadow-sm' style={cardStyles}>
                                <div className='absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10' style={{ backgroundColor: accent }}></div>
                                {sectionTitle('Manifesto', User)}
                                <p className='text-xl lg:text-2xl font-medium leading-relaxed text-slate-700 relative z-10'>
                                    "{resume.professional_summary}"
                                </p>
                            </section>
                        )}

                        {/* SKILLS BLOCK */}
                        {style.visibleSections.skills && resume?.skills?.length > 0 && (
                            <section className='md:col-span-7 p-8 lg:p-10 relative overflow-hidden shadow-sm' style={{ ...cardStyles, backgroundColor: `${accent}05` }}>
                                <div className='absolute bottom-0 left-0 w-32 h-32 blur-3xl opacity-10' style={{ backgroundColor: accent }}></div>
                                {sectionTitle('Tech Stack', Award)}
                                <div className='flex flex-wrap gap-2 relative z-10'>
                                    {resume.skills.map((skill, i) => (
                                        <span key={i} className='px-4 py-2 shadow-sm border text-xs font-bold text-white uppercase tracking-tight transition-colors cursor-default' style={{ borderRadius: style.borderRadius, backgroundColor: accent, borderColor: accent }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PROJECTS BLOCK */}
                        {style.visibleSections.projects && resume?.project?.length > 0 && (
                            <section className='md:col-span-12 p-8 lg:p-12 shadow-sm' style={cardStyles}>
                                {sectionTitle('Selected Works', CodeXml)}
                                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {resume.project.map((proj, i) => (
                                        <article key={i} className='group relative flex flex-col'>
                                            {/* VIBRANT THEME FALLBACK FOR PROJECT IMAGES */}
                                            <div className='aspect-video mb-4 overflow-hidden relative shadow-sm border border-slate-100' style={{ borderRadius: style.borderRadius, backgroundColor: `${accent}10` }}>
                                                {proj.image ? (
                                                    <img src={proj.image} alt={proj.name} className='size-full object-cover group-hover:scale-105 transition-transform duration-500' />
                                                ) : (
                                                    <div className='absolute inset-0 flex flex-col items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500' style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent})` }}>
                                                        <CodeXml size={48} className='text-white/80 mb-2' />
                                                        <span className='text-white/90 font-black tracking-widest uppercase text-[10px]'>Project Scope</span>
                                                    </div>
                                                )}
                                                {proj.link && (
                                                    <a href={proj.link} target='_blank' rel='noopener noreferrer' className='absolute top-4 right-4 size-10 bg-white shadow-xl flex items-center justify-center rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-slate-50' style={{ color: accent }}>
                                                        <ExternalLink size={18} />
                                                    </a>
                                                )}
                                            </div>
                                            <h3 className='text-xl font-black text-slate-900 mb-2 uppercase tracking-tight'>{proj.name}</h3>
                                            <p className='text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3'>{proj.description}</p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EXPERIENCE BLOCK */}
                        {style.visibleSections.experience && resume?.experience?.length > 0 && (
                            <section className='md:col-span-8 p-8 lg:p-12 relative overflow-hidden shadow-sm' style={{ ...cardStyles, backgroundColor: `${accent}05` }}>
                                <div className='absolute bottom-0 right-0 w-64 h-64 blur-3xl opacity-5 -mr-32 -mb-32' style={{ backgroundColor: accent }}></div>
                                {sectionTitle('Career Path', Building2)}
                                <div className='space-y-8 relative z-10'>
                                    {resume.experience.map((exp, i) => (
                                        <div key={i} className='grid md:grid-cols-[140px_1fr] gap-4'>
                                            <div className='text-[10px] font-black text-slate-500 uppercase tracking-widest pt-1'>
                                                {exp.start_date} — {exp.is_current ? 'Now' : exp.end_date}
                                            </div>
                                            <div>
                                                <h3 className='text-lg font-bold text-slate-900'>{exp.position}</h3>
                                                <p className='text-sm font-bold mb-3' style={{ color: accent }}>{exp.company}</p>
                                                <p className='text-sm text-slate-600 leading-relaxed'>{exp.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CONTACT BLOCK */}
                        <section className='md:col-span-4 p-8 lg:p-10 flex flex-col justify-between overflow-hidden relative group shadow-sm' style={{ ...cardStyles, backgroundColor: '#0f172a', border: 'none' }}>
                            <div className='absolute top-0 right-0 w-48 h-48 blur-3xl opacity-20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700' style={{ backgroundColor: accent }}></div>
                            <div className='relative z-10'>
                                {sectionTitle('Contact', Mail, true)}
                                <h3 className='text-3xl font-black text-white leading-tight mb-4'>Ready to start <br/>a new chapter?</h3>
                                <p className='text-white/60 text-sm mb-8 font-medium'>Drop a line and let's discuss how we can work together.</p>
                            </div>
                            <a href={`mailto:${info.email}`} className='relative z-10 w-full py-4 text-white text-center font-black uppercase tracking-widest text-xs hover:brightness-110 transition-colors shadow-2xl' style={{ borderRadius: style.borderRadius, backgroundColor: accent }}>
                                Send Message
                            </a>
                        </section>

                        {/* EDUCATION & CERTS */}
                        <div className='md:col-span-12 grid md:grid-cols-2 gap-4'>
                            {style.visibleSections.education && resume?.education?.length > 0 && (
                                <section className='p-8 shadow-sm' style={cardStyles}>
                                    {sectionTitle('Learning', GraduationCap)}
                                    <div className='space-y-6'>
                                        {resume.education.map((edu, i) => (
                                            <div key={i}>
                                                <h4 className='font-bold text-slate-900'>{edu.degree}</h4>
                                                <p className='text-xs font-bold mb-1' style={{ color: accent }}>{edu.institution}</p>
                                                <p className='text-[10px] text-slate-500 uppercase tracking-wider'>{edu.graduation_date}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                            {style.visibleSections.certifications && resume?.certifications?.length > 0 && (
                                <section className='p-8 shadow-sm' style={cardStyles}>
                                    {sectionTitle('Validated', Award)}
                                    <div className='space-y-6'>
                                        {resume.certifications.map((cert, i) => (
                                            <div key={i} className='flex items-center justify-between gap-4'>
                                                <div>
                                                    <h4 className='font-bold text-slate-900'>{cert.name}</h4>
                                                    <p className='text-xs font-bold' style={{ color: accent }}>{cert.issuer}</p>
                                                </div>
                                                {cert.link && <a href={cert.link} target='_blank' rel='noopener noreferrer' className='size-8 flex items-center justify-center border rounded-full hover:bg-slate-50' style={{ color: accent, borderColor: `${accent}30` }}><ExternalLink size={14} /></a>}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                ) : (
                    // CLASSIC AND STUDIO TEMPLATES
                    <div className='animate-in fade-in duration-1000'>
                        <header className={isStudio ? 'text-white overflow-hidden relative' : 'bg-white border-b border-slate-200/60 shadow-sm'} style={{ 
                            borderRadius: style.borderRadius || '0px',
                            backgroundColor: isStudio ? accent : (cardStyles.backgroundColor || 'white'),
                            border: isStudio ? 'none' : cardStyles.border,
                            backdropFilter: cardStyles.backdropFilter,
                            WebkitBackdropFilter: cardStyles.WebkitBackdropFilter,
                        }}>
                            {isStudio && (
                                <div className='absolute inset-0 opacity-10 pointer-events-none'>
                                    <div className='absolute top-[-10%] left-[-10%] size-96 rounded-full bg-white blur-3xl'></div>
                                    <div className='absolute bottom-[-10%] right-[-10%] size-96 rounded-full bg-black blur-3xl'></div>
                                </div>
                            )}
                            <div className={`max-w-6xl mx-auto px-6 ${isStudio ? 'py-20' : 'py-14'} relative z-10`}>
                                <div className={`grid gap-12 ${isClassic ? 'lg:grid-cols-[300px_1fr]' : 'lg:grid-cols-[1fr_350px]'} items-center`}>
                                    <div className={isClassic ? 'lg:order-2' : ''}>
                                        <h1 className={`text-5xl sm:text-7xl font-black mb-4 tracking-tight ${isStudio ? 'text-white' : 'text-slate-950'}`}>
                                            {info.full_name || name}
                                        </h1>
                                        {info.profession && (
                                            <p className={`text-xl font-semibold mb-6 flex items-center gap-2 ${isStudio ? 'text-white/90' : ''}`} style={isStudio ? undefined : { color: accent }}>
                                                <span className='w-8 h-[2px]' style={{ backgroundColor: isStudio ? 'white' : accent }}></span>
                                                {info.profession}
                                            </p>
                                        )}
                                        {bio && <p className={`${isStudio ? 'text-white/80' : 'text-slate-600'} text-lg leading-relaxed max-w-2xl`}>{bio}</p>}

                                        <div className='flex flex-wrap items-center gap-4 mt-8'>
                                            {style.showResumeDownload && resume?._id && (
                                                <Link to={`/view/${resume._id}`} className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all ${isStudio ? 'bg-white text-slate-900' : 'text-white'}`} style={{ backgroundColor: isStudio ? undefined : accent, borderRadius: style.borderRadius }}>
                                                    <Download className='size-4' /> View Resume
                                                </Link>
                                            )}
                                            {isOwner && (
                                                <button 
                                                    onClick={handleShare}
                                                    className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-bold border-2 transition-all hover:scale-105 active:scale-95 ${isStudio ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 shadow-sm'}`}
                                                    style={{ borderRadius: style.borderRadius }}
                                                >
                                                    <Share2 className='size-4' /> {copied ? 'Copied!' : 'Share Portfolio'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <aside className={`${isStudio ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : 'bg-white border-slate-200 shadow-xl'} border p-8 ${isClassic ? 'lg:order-1' : ''}`} style={{ borderRadius: style.borderRadius }}>
                                        <div className='relative group mb-6'>
                                            <div className='absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 blur opacity-25 group-hover:opacity-50 transition duration-1000' style={{ borderRadius: style.borderRadius }}></div>
                                            {displayImage ? (
                                                <img src={displayImage} alt={name} className='relative size-40 object-cover border-2 border-white shadow-md' style={{ borderRadius: style.borderRadius }} />
                                            ) : (
                                                <div className='relative size-40 border-2 border-white shadow-md flex items-center justify-center' style={{ borderRadius: style.borderRadius, backgroundColor: isStudio ? 'rgba(255,255,255,0.2)' : `${accent}10` }}>
                                                    <User size={48} className={isStudio ? 'text-white/50' : 'opacity-50'} style={isStudio ? {} : { color: accent }} />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`space-y-4 text-sm font-medium ${isStudio ? 'text-white/90' : 'text-slate-600'}`}>
                                            {info.email && <p className='flex items-center gap-3'><Mail size={16} style={{ color: isStudio ? 'white' : accent }} /> {info.email}</p>}
                                            {info.phone && <p className='flex items-center gap-3'><Phone size={16} style={{ color: isStudio ? 'white' : accent }} /> {info.phone}</p>}
                                            {info.location && <p className='flex items-center gap-3'><MapPin size={16} style={{ color: isStudio ? 'white' : accent }} /> {info.location}</p>}
                                        </div>
                                    </aside>
                                </div>
                            </div>
                        </header>

                        <main className={`max-w-6xl mx-auto px-6 py-20 ${isClassic ? 'grid lg:grid-cols-[1fr_350px] gap-12' : 'grid lg:grid-cols-1 gap-12'}`}>
                            <div className='space-y-16'>
                                {style.visibleSections.about && resume?.professional_summary && (
                                    <section>
                                        {sectionTitle('About', User)}
                                        <div className='p-8 shadow-sm' style={cardStyles}>
                                            <p className='text-slate-700 leading-relaxed text-xl'>{resume.professional_summary}</p>
                                        </div>
                                    </section>
                                )}

                                {style.visibleSections.experience && resume?.experience?.length > 0 && (
                                    <section>
                                        {sectionTitle('Experience', Building2)}
                                        <div className='space-y-6'>
                                            {resume.experience.map((exp, i) => (
                                                <div key={i} className='p-8 grid md:grid-cols-[140px_1fr] gap-4 shadow-sm group hover:-translate-y-1 transition-transform' style={cardStyles}>
                                                    <div className='text-[10px] font-black text-slate-500 uppercase tracking-widest pt-1'>
                                                        {exp.start_date} — {exp.is_current ? 'Now' : exp.end_date}
                                                    </div>
                                                    <div>
                                                        <h3 className='text-lg font-bold text-slate-900'>{exp.position}</h3>
                                                        <p className='text-sm font-bold mb-3' style={{ color: accent }}>{exp.company}</p>
                                                        <p className='text-sm text-slate-600 leading-relaxed'>{exp.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {style.visibleSections.projects && resume?.project?.length > 0 && (
                                    <section>
                                        {sectionTitle('Projects', CodeXml)}
                                        <div className='grid sm:grid-cols-2 gap-6'>
                                            {resume.project.map((proj, i) => (
                                                <article key={i} className='flex flex-col group hover:-translate-y-1 transition-transform relative overflow-hidden shadow-sm' style={cardStyles}>
                                                    {/* VIBRANT THEME FALLBACK FOR PROJECT IMAGES */}
                                                    <div className='aspect-video overflow-hidden relative shadow-sm border-b border-slate-100' style={{ backgroundColor: `${accent}10` }}>
                                                        {proj.image ? (
                                                            <img src={proj.image} alt={proj.name} className='size-full object-cover group-hover:scale-105 transition-transform duration-500' />
                                                        ) : (
                                                            <div className='absolute inset-0 flex flex-col items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500' style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent})` }}>
                                                                <CodeXml size={48} className='text-white/80 mb-2' />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className='p-8 flex flex-col flex-1'>
                                                        <h3 className='text-xl font-bold text-slate-900 mb-2 relative z-10'>{proj.name}</h3>
                                                        <p className='text-slate-600 text-sm line-clamp-3 mb-4 flex-1 relative z-10'>{proj.description}</p>
                                                        {proj.link && <a href={proj.link} target='_blank' rel='noopener noreferrer' className='text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1 mt-auto relative z-10' style={{ color: accent }}>Visit Site <ExternalLink size={12}/></a>}
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className='space-y-16'>
                                {style.visibleSections.skills && resume?.skills?.length > 0 && (
                                    <section>
                                        {sectionTitle('Expertise', Award)}
                                        <div className='flex flex-wrap gap-2'>
                                            {resume.skills.map((skill, i) => (
                                                <span key={i} className='px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm' style={{ borderRadius: style.borderRadius }}>{skill}</span>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {style.visibleSections.education && resume?.education?.length > 0 && (
                                    <section>
                                        {sectionTitle('Education', GraduationCap)}
                                        <div className='space-y-4'>
                                            {resume.education.map((edu, i) => (
                                                <div key={i} className='p-6 shadow-sm group hover:-translate-y-1 transition-transform' style={cardStyles}>
                                                    <h4 className='font-bold text-slate-900'>{edu.degree}</h4>
                                                    <p className='text-xs font-bold mb-1' style={{ color: accent }}>{edu.institution}</p>
                                                    <p className='text-[10px] text-slate-500 uppercase tracking-wider'>{edu.graduation_date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {style.visibleSections.certifications && resume?.certifications?.length > 0 && (
                                    <section>
                                        {sectionTitle('Certifications', Award)}
                                        <div className='space-y-4'>
                                            {resume.certifications.map((cert, i) => (
                                                <div key={i} className='p-6 flex items-center justify-between gap-4 shadow-sm group hover:-translate-y-1 transition-transform' style={cardStyles}>
                                                    <div>
                                                        <h4 className='font-bold text-slate-900'>{cert.name}</h4>
                                                        <p className='text-xs font-bold' style={{ color: accent }}>{cert.issuer}</p>
                                                    </div>
                                                    {cert.link && <a href={cert.link} target='_blank' rel='noopener noreferrer' className='size-8 flex items-center justify-center border border-slate-200 rounded-full hover:bg-slate-50' style={{ color: accent }}><ExternalLink size={14} /></a>}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </main>
                    </div>
                )}
            </div>

            <footer className='border-t border-slate-200/60 mt-20 bg-white/50 backdrop-blur-sm'>
                <div className='max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6'>
                    <div className='flex items-center gap-4'>
                        <div className='size-10 bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-black text-xl' style={{ borderRadius: style.borderRadius }}>R</div>
                        <p className='text-sm text-slate-500 font-medium'>
                            Designed for high-impact careers.
                        </p>
                    </div>
                    <p className='text-sm text-slate-400 font-medium'>
                        Made with <a href="/" className='text-slate-900 font-black hover:underline transition-all underline-offset-4 decoration-emerald-500 decoration-2'>ResumeAI</a>
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Portfolio