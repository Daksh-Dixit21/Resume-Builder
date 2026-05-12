import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Phone, ExternalLink, Download, BriefcaseBusiness, GraduationCap, Sparkles, Share2, CodeXml, Award, CheckCircle2, Building2, Calendar, User, Layout, Smartphone } from 'lucide-react'
import api from '../configs/api'

const defaultStyle = {
    template: 'clean',
    accentColor: '#10b981',
    fontFamily: 'Outfit',
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

    if (error) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4'>
                <h1 className='text-6xl font-bold text-slate-200 mb-4'>404</h1>
                <p className='text-lg text-slate-500 mb-6'>{error}</p>
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
        ...(portfolio.portfolioStyle || {}),
        visibleSections: { ...defaultStyle.visibleSections, ...(portfolio.portfolioStyle?.visibleSections || {}) },
    }
    const info = resume?.personal_info || {}
    const accent = style.accentColor
    const template = style.template
    const isStudio = template === 'studio'
    const isClassic = template === 'classic'
    const displayImage = portfolioImage || info.image

    const socialItems = [
        { icon: Github, url: socialLinks?.github || info.github, label: 'GitHub' },
        { icon: Linkedin, url: socialLinks?.linkedin || info.linkedin, label: 'LinkedIn' },
        { icon: Twitter, url: socialLinks?.twitter, label: 'Twitter' },
        { icon: Globe, url: socialLinks?.website || info.website, label: 'Website' },
    ].filter(s => s.url)

    const sectionTitle = (label, Icon) => (
        <div className='flex items-center gap-3 mb-6'>
            <div className='relative'>
                <div className='absolute inset-0 blur-lg opacity-20' style={{ backgroundColor: accent }}></div>
                <span className='relative size-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm' style={{ color: accent }}>
                    <Icon className='size-5' />
                </span>
            </div>
            <h2 className='text-sm font-bold uppercase tracking-[0.2em] text-slate-500'>{label}</h2>
        </div>
    )

    const pageClass = isStudio ? 'bg-white' : isClassic ? 'bg-[#f8f9fa]' : 'bg-slate-50/50'
    const headerClass = isStudio ? 'text-white overflow-hidden relative' : 'bg-white border-b border-slate-200/60'
    
    const cardClass = isClassic
        ? 'bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300'
        : isStudio
            ? 'bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1'
            : 'bg-white rounded-2xl border border-slate-200/60 p-6 hover:border-emerald-500/30 transition-colors'
            
    const chipClass = isClassic ? 'rounded-lg border' : 'rounded-full border'

    return (
        <div className={`min-h-screen ${pageClass} text-slate-800 selection:bg-emerald-100 selection:text-emerald-900`} style={{ fontFamily: `"${style.fontFamily}", sans-serif` }}>
            <header className={headerClass} style={isStudio ? { backgroundColor: accent } : undefined}>
                {isStudio && (
                    <div className='absolute inset-0 opacity-10 pointer-events-none'>
                        <div className='absolute top-[-10%] left-[-10%] size-96 rounded-full bg-white blur-3xl'></div>
                        <div className='absolute bottom-[-10%] right-[-10%] size-96 rounded-full bg-black blur-3xl'></div>
                    </div>
                )}
                <div className={`max-w-6xl mx-auto px-6 ${isStudio ? 'py-20' : 'py-14'} relative z-10`}>
                    <div className={`grid gap-12 ${isClassic ? 'lg:grid-cols-[300px_1fr]' : 'lg:grid-cols-[1fr_350px]'} items-center`}>
                        <div className={isClassic ? 'lg:order-2' : ''}>
                            <h1 className={`text-5xl sm:text-6xl font-black mb-4 tracking-tight ${isStudio ? 'text-white' : 'text-slate-950'}`}>
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
                                    <Link to={`/view/${resume._id}`} className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all ${isStudio ? 'bg-white text-slate-900' : 'text-white'}`} style={isStudio ? undefined : { backgroundColor: accent }}>
                                        <Download className='size-4' /> View Resume
                                    </Link>
                                )}
                                {isOwner && (
                                    <button 
                                        onClick={handleShare}
                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:scale-105 active:scale-95 ${isStudio ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 shadow-sm'}`}
                                    >
                                        <Share2 className='size-4' /> {copied ? 'Copied!' : 'Share Portfolio'}
                                    </button>
                                )}
                                <div className='flex gap-2 ml-2'>
                                    {socialItems.map((s) => (
                                        <a key={s.label} href={s.url} target='_blank' rel='noopener noreferrer' className={`size-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${isStudio ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600 shadow-sm'}`} title={s.label}>
                                            <s.icon size={20} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <aside className={`${isStudio ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : isClassic ? 'bg-white border-slate-200 shadow-xl' : 'bg-white border-slate-200 shadow-lg'} border rounded-3xl p-8 ${isClassic ? 'lg:order-1' : ''}`}>
                            <div className='relative group'>
                                <div className='absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200'></div>
                                {displayImage && <img src={displayImage} alt={info.full_name || name} className='relative size-32 rounded-2xl mb-6 object-cover border-2 border-white shadow-md' />}
                            </div>
                            <div className={`space-y-4 text-sm font-medium ${isStudio ? 'text-white/90' : 'text-slate-600'}`}>
                                {info.email && <p className='flex items-center gap-3'><div className='size-8 rounded-lg flex items-center justify-center bg-slate-50/10'><Mail size={16} className={isStudio ? 'text-white' : ''} style={isStudio ? undefined : { color: accent }} /></div> {info.email}</p>}
                                {info.phone && <p className='flex items-center gap-3'><div className='size-8 rounded-lg flex items-center justify-center bg-slate-50/10'><Phone size={16} className={isStudio ? 'text-white' : ''} style={isStudio ? undefined : { color: accent }} /></div> {info.phone}</p>}
                                {info.location && <p className='flex items-center gap-3'><div className='size-8 rounded-lg flex items-center justify-center bg-slate-50/10'><MapPin size={16} className={isStudio ? 'text-white' : ''} style={isStudio ? undefined : { color: accent }} /></div> {info.location}</p>}
                            </div>
                        </aside>
                    </div>
                </div>
            </header>

            {resume && (
                <main className={`max-w-6xl mx-auto px-6 py-20 ${isStudio ? 'grid lg:grid-cols-[1fr_380px] gap-12' : isClassic ? 'grid lg:grid-cols-[1fr_350px] gap-12' : ''}`}>
                    <div className='space-y-16'>
                        {style.visibleSections.about && resume.professional_summary && (
                            <section>
                                {sectionTitle('About Me', User)}
                                <div className={`${isClassic ? 'bg-white border border-slate-200 p-8 rounded-2xl shadow-sm' : ''} relative`}>
                                    {isClassic && <div className='absolute top-0 left-0 w-1 h-full rounded-full' style={{ backgroundColor: accent }}></div>}
                                    <p className='text-slate-600 leading-relaxed text-xl font-light'>{resume.professional_summary}</p>
                                </div>
                            </section>
                        )}

                        {style.visibleSections.projects && resume.project?.length > 0 && (
                            <section>
                                {sectionTitle('Featured Projects', CodeXml)}
                                <div className='grid sm:grid-cols-2 gap-6'>
                                    {resume.project.map((proj, i) => (
                                        <article key={i} className={cardClass}>
                                            <div className='flex items-start justify-between gap-3 mb-4'>
                                                <div className='size-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100' style={{ color: accent }}>
                                                    <Layout className='size-6' />
                                                </div>
                                                {proj.link && (
                                                    <a href={proj.link} target='_blank' rel='noopener noreferrer' className='size-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors' style={{ color: accent }}>
                                                        <ExternalLink size={18} />
                                                    </a>
                                                )}
                                            </div>
                                            <h3 className='text-xl font-bold text-slate-900 mb-2'>{proj.name}</h3>
                                            {proj.description && <p className='text-slate-500 leading-relaxed text-sm line-clamp-3'>{proj.description}</p>}
                                            <div className='mt-6 flex items-center text-xs font-bold uppercase tracking-wider' style={{ color: accent }}>
                                                View Case Study <ExternalLink size={12} className='ml-1' />
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {style.visibleSections.experience && resume.experience?.length > 0 && (
                            <section>
                                {sectionTitle('Work Experience', Building2)}
                                <div className='space-y-6'>
                                    {resume.experience.map((exp, i) => (
                                        <article key={i} className={`${cardClass} flex flex-col md:flex-row gap-6`}>
                                            <div className='md:w-48 shrink-0'>
                                                <div className='flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2'>
                                                    <Calendar size={14} />
                                                    {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                                                </div>
                                                <div className='inline-flex px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tighter'>
                                                    {exp.is_current ? 'Current Role' : 'Past Role'}
                                                </div>
                                            </div>
                                            <div className='flex-1'>
                                                <h3 className='text-xl font-bold text-slate-900 mb-1'>{exp.position}</h3>
                                                <p className='font-bold mb-4 flex items-center gap-2' style={{ color: accent }}>
                                                    <Building2 size={16} />
                                                    {exp.company}
                                                </p>
                                                {exp.description && <p className='text-slate-500 leading-relaxed text-sm'>{exp.description}</p>}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {style.visibleSections.certifications && resume.certifications?.length > 0 && (
                            <section>
                                {sectionTitle('Certifications', Award)}
                                <div className='grid sm:grid-cols-2 gap-4'>
                                    {resume.certifications.map((cert, i) => (
                                        <article key={i} className={cardClass}>
                                            <div className='flex items-start justify-between gap-3'>
                                                <div>
                                                    <h3 className='font-bold text-slate-900'>{cert.name}</h3>
                                                    <p className='text-sm font-medium' style={{ color: accent }}>{cert.issuer}</p>
                                                </div>
                                                {cert.link && <a href={cert.link} target='_blank' rel='noopener noreferrer' className='text-slate-400 hover:text-emerald-500 transition-colors'><ExternalLink size={16} /></a>}
                                            </div>
                                            <p className='text-xs text-slate-400 mt-2'>{cert.date}</p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className='space-y-16'>
                        {style.visibleSections.skills && resume.skills?.length > 0 && (
                            <section>
                                {sectionTitle('Skills & Expertise', Award)}
                                <div className='flex flex-wrap gap-3'>
                                    {resume.skills.map((skill, i) => (
                                        <div key={i} className={`group flex items-center gap-2 px-4 py-2.5 bg-white text-sm font-bold ${chipClass} border-slate-200/60 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all cursor-default`} style={{ color: '#334155' }}>
                                            <CheckCircle2 size={14} className='text-emerald-500' />
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {style.visibleSections.languages && resume.languages?.length > 0 && (
                            <section>
                                {sectionTitle('Languages', Globe)}
                                <div className='space-y-3'>
                                    {resume.languages.map((lang, i) => (
                                        <div key={i} className='flex items-center justify-between p-3 bg-white border border-slate-200/60 rounded-xl shadow-sm'>
                                            <span className='font-bold text-slate-700'>{lang.name}</span>
                                            <span className='text-xs font-bold px-2 py-1 bg-slate-50 rounded-lg' style={{ color: accent }}>{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {style.visibleSections.education && resume.education?.length > 0 && (
                            <section>
                                {sectionTitle('Education', GraduationCap)}
                                <div className='space-y-6'>
                                    {resume.education.map((edu, i) => (
                                        <article key={i} className={cardClass}>
                                            <div className='flex items-center gap-4 mb-4'>
                                                <div className='size-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100' style={{ color: accent }}>
                                                    <GraduationCap className='size-6' />
                                                </div>
                                                <div>
                                                    <h3 className='font-bold text-slate-900'>{edu.degree}</h3>
                                                    <p className='text-sm text-slate-400'>{edu.graduation_date}</p>
                                                </div>
                                            </div>
                                            <p className='font-bold text-sm mb-2' style={{ color: accent }}>{edu.institution}</p>
                                            <p className='text-xs font-medium text-slate-500'>{edu.field} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}</p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className='p-8 rounded-3xl bg-slate-900 text-white overflow-hidden relative group'>
                            <div className='absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors'></div>
                            <h3 className='text-xl font-bold mb-2 relative z-10'>Have a project in mind?</h3>
                            <p className='text-slate-400 text-sm mb-6 relative z-10'>I'm always open to discussing new projects and opportunities.</p>
                            <a href={`mailto:${info.email}`} className='inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all relative z-10'>
                                Get in touch <Mail size={16} />
                            </a>
                        </section>
                    </div>
                </main>
            )}

            <footer className='border-t border-slate-200 mt-20'>
                <div className='max-w-6xl mx-auto px-6 py-12 text-center'>
                    <p className='text-sm text-slate-400 font-medium'>
                        Made with <span className='text-emerald-500 font-bold'>ResumeAI</span>
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Portfolio

