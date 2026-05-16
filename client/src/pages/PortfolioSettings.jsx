import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, X, Loader2, ExternalLink, Save, Github, Linkedin, Twitter, Globe, Download, Eye, LayoutTemplate, Palette, Type, SlidersHorizontal, ImagePlus, UploadCloud, Mail, MapPin, Phone, BriefcaseBusiness, WandSparkles, UserRound, FileText, Sparkles, Share2, Award, GraduationCap, CodeXml, Building2, User, Layout } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const templates = [
    { id: 'bento', label: 'Bento', desc: 'Modern grid-based layout with creative asymmetry' },
    { id: 'studio', label: 'Studio', desc: 'Bold header with project-first energy' },
    { id: 'classic', label: 'Classic', desc: 'Recruiter-friendly editorial layout' },
]

const fonts = ['Outfit', 'Inter', 'Poppins', 'Montserrat', 'Raleway', 'Open Sans', 'Lora', 'Playfair Display', 'Caveat', 'Fira Code']
const accents = ['#10b981', '#2563eb', '#f97316', '#7c3aed', '#ef4444', '#06b6d4', '#f59e0b', '#ec4899', '#0f766e', '#1e293b', '#6366f1', '#8b5cf6', '#d946ef', '#14b8a6', '#4ade80']

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

const builderSections = [
    { id: 'profile', label: 'Profile', icon: UserRound },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'template', label: 'Template', icon: LayoutTemplate },
    { id: 'sections', label: 'Sections', icon: SlidersHorizontal },
    { id: 'links', label: 'Links', icon: Globe },
    { id: 'style', label: 'Style', icon: Palette },
]

const PortfolioSettings = () => {
    const { token } = useSelector(state => state.auth)

    const [activeSection, setActiveSection] = useState('profile')
    const [username, setUsername] = useState('')
    const [originalUsername, setOriginalUsername] = useState('')
    const [usernameStatus, setUsernameStatus] = useState(null)
    const [bio, setBio] = useState('')
    const [portfolioImage, setPortfolioImage] = useState('')
    const [portfolioImageFile, setPortfolioImageFile] = useState(null)
    const [portfolioImagePreview, setPortfolioImagePreview] = useState('')
    const [socialLinks, setSocialLinks] = useState({ github: '', linkedin: '', twitter: '', website: '' })
    const [portfolioResumeId, setPortfolioResumeId] = useState('')
    const [portfolioStyle, setPortfolioStyle] = useState(defaultStyle)
    const [resumes, setResumes] = useState([])
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        loadSettings()
        loadResumes()
    }, [])

    const loadSettings = async () => {
        try {
            const { data } = await api.get('/api/portfolio/settings', { headers: { Authorization: token } })
            const s = data.settings
            setUsername(s.username || '')
            setOriginalUsername(s.username || '')
            setBio(s.bio || '')
            setPortfolioImage(s.portfolioImage || '')
            setPortfolioImagePreview(s.portfolioImage || '')
            setSocialLinks({ github: '', linkedin: '', twitter: '', website: '', ...(s.socialLinks || {}) })
            setPortfolioResumeId(s.portfolioResumeId || '')
            const settingsStyle = s.portfolioStyle || {}
            if (settingsStyle.template === 'clean') settingsStyle.template = 'bento'
            
            setPortfolioStyle({
                ...defaultStyle,
                ...settingsStyle,
                visibleSections: { ...defaultStyle.visibleSections, ...(settingsStyle.visibleSections || {}) },
            })
        } catch {
            toast.error('Failed to load settings')
        }
    }

    const loadResumes = async () => {
        try {
            const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
            setResumes(data.resumes)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!username || username === originalUsername) {
            setUsernameStatus(null)
            return
        }

        const regex = /^[a-z0-9_-]{3,30}$/
        if (!regex.test(username)) {
            setUsernameStatus('invalid')
            return
        }

        setUsernameStatus('checking')
        const timer = setTimeout(async () => {
            try {
                const { data } = await api.get(`/api/portfolio/check/${username}`)
                setUsernameStatus(data.available ? 'available' : 'taken')
            } catch {
                setUsernameStatus(null)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [username, originalUsername])

    const publicResumes = resumes.filter(r => r.public)
    const selectedResume = resumes.find(r => r._id === portfolioResumeId)
    const previewInfo = selectedResume?.personal_info || {}
    const displayImage = portfolioImagePreview || previewInfo.image
    const previewName = previewInfo.full_name || 'Your Name'
    const previewProfession = previewInfo.profession || 'Portfolio headline'

    const updateStyle = (key, value) => {
        setPortfolioStyle(prev => ({ ...prev, [key]: value }))
    }

    const toggleSection = (key) => {
        setPortfolioStyle(prev => ({
            ...prev,
            visibleSections: { ...prev.visibleSections, [key]: !prev.visibleSections[key] },
        }))
    }

    const fillFromResume = (resume, overwrite = true) => {
        if (!resume) return
        const info = resume.personal_info || {}
        setBio(prev => overwrite ? (resume.professional_summary || prev) : (prev || resume.professional_summary || ''))
        setSocialLinks(prev => ({
            github: overwrite ? (info.github || prev.github || '') : (prev.github || info.github || ''),
            linkedin: overwrite ? (info.linkedin || prev.linkedin || '') : (prev.linkedin || info.linkedin || ''),
            twitter: prev.twitter || '',
            website: overwrite ? (info.website || prev.website || '') : (prev.website || info.website || ''),
        }))
        if (!portfolioImageFile && (overwrite || !portfolioImagePreview)) {
            setPortfolioImagePreview(info.image || portfolioImage || '')
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (portfolioImagePreview?.startsWith('blob:')) URL.revokeObjectURL(portfolioImagePreview)
        setPortfolioImageFile(file)
        setPortfolioImagePreview(URL.createObjectURL(file))
    }

    const save = async () => {
        if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
            return toast.error('Please fix the username before saving')
        }

        setIsSaving(true)
        try {
            const formData = new FormData()
            if (username) formData.append('username', username)
            formData.append('bio', bio)
            formData.append('socialLinks', JSON.stringify(socialLinks))
            formData.append('portfolioStyle', JSON.stringify(portfolioStyle))
            if (portfolioResumeId) formData.append('portfolioResumeId', portfolioResumeId)
            if (portfolioImageFile) formData.append('image', portfolioImageFile)

            const { data } = await api.put('/api/portfolio/update', formData, {
                headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
            })

            setPortfolioImage(data.user?.portfolioImage || portfolioImage)
            setPortfolioImagePreview(data.user?.portfolioImage || portfolioImagePreview)
            setPortfolioImageFile(null)
            setOriginalUsername(username)
            toast.success('Portfolio saved')
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to save')
        } finally {
            setIsSaving(false)
        }
    }

    const renderEditor = () => {
        if (activeSection === 'profile') {
            return (
                <div className='space-y-5'>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>Public address</label>
                        <div className='relative'>
                            <span className='hidden sm:block absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400'>resumeai.app/portfolio/</span>
                            <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} className='w-full sm:pl-[185px] pr-10 py-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500' placeholder='your-name' />
                            <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                                {usernameStatus === 'checking' && <Loader2 className='size-4 text-slate-400 animate-spin' />}
                                {usernameStatus === 'available' && <Check className='size-4 text-emerald-500' />}
                                {usernameStatus === 'taken' && <X className='size-4 text-red-500' />}
                                {usernameStatus === 'invalid' && <X className='size-4 text-orange-500' />}
                            </div>
                        </div>
                        {usernameStatus === 'taken' && <p className='text-xs text-red-500 mt-1'>This username is already taken.</p>}
                        {usernameStatus === 'invalid' && <p className='text-xs text-orange-500 mt-1'>3-30 characters, lowercase letters, numbers, hyphens, underscores only.</p>}
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>Portfolio image</label>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                            <div className='size-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0'>
                                {displayImage ? <img src={displayImage} alt='Portfolio profile' className='size-full object-cover' /> : <ImagePlus className='size-8 text-slate-300' />}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='flex gap-2'>
                                    <label htmlFor='portfolio-image' className='inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer'>
                                        <UploadCloud className='size-4 text-emerald-600' /> Upload image
                                    </label>
                                    {(portfolioImage || portfolioImageFile) && (
                                        <button 
                                            onClick={() => {
                                                setPortfolioImage('')
                                                setPortfolioImageFile(null)
                                                setPortfolioImagePreview('')
                                                if (portfolioImagePreview?.startsWith('blob:')) URL.revokeObjectURL(portfolioImagePreview)
                                            }}
                                            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors'
                                        >
                                            <X className='size-4' /> Remove
                                        </button>
                                    )}
                                </div>
                                <input id='portfolio-image' type='file' accept='image/*' onChange={handleImageChange} hidden />
                                <p className='text-xs text-slate-400'>Square photos work best. This can be different from your resume photo.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} placeholder='A brief introduction about yourself...' className='w-full px-4 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500' />
                    </div>
                </div>
            )
        }

        if (activeSection === 'resume') {
            return (
                <div className='space-y-5'>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>Featured resume</label>
                        {publicResumes.length > 0 ? (
                            <select value={portfolioResumeId} onChange={(e) => {
                                const nextId = e.target.value
                                setPortfolioResumeId(nextId)
                                fillFromResume(resumes.find(r => r._id === nextId), false)
                            }} className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500'>
                                <option value=''>No featured resume</option>
                                {publicResumes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                            </select>
                        ) : (
                            <p className='text-sm text-slate-400'>No public resumes found. Set a resume to public first.</p>
                        )}
                    </div>

                    {selectedResume && (
                        <div className='rounded-xl border border-slate-200 p-4 bg-slate-50'>
                            <p className='text-sm font-semibold text-slate-800'>{selectedResume.title}</p>
                            <p className='text-xs text-slate-500 mt-1'>{previewName} {previewProfession !== 'Portfolio headline' ? `- ${previewProfession}` : ''}</p>
                            <button onClick={() => fillFromResume(selectedResume, true)} className='mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50 transition-colors'>
                                <WandSparkles className='size-4 text-emerald-600' /> Fill portfolio from resume
                            </button>
                        </div>
                    )}

                    <label className='flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700'>
                        <span className='flex items-center gap-2'><Download className='size-4 text-slate-400' /> Show resume button</span>
                        <input type='checkbox' checked={portfolioStyle.showResumeDownload} onChange={(e) => updateStyle('showResumeDownload', e.target.checked)} />
                    </label>
                </div>
            )
        }

        if (activeSection === 'template') {
            return (
                <div className='grid grid-cols-1 gap-3'>
                    {templates.map(t => (
                        <button key={t.id} onClick={() => updateStyle('template', t.id)} className={`text-left rounded-xl border p-4 transition-all flex items-center gap-4 ${portfolioStyle.template === t.id ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                            <div className='w-24 h-16 rounded-lg border border-slate-200 bg-white p-2 shrink-0 overflow-hidden relative'>
                                {t.id === 'studio' ? (
                                    <div className='absolute inset-0' style={{ backgroundColor: portfolioStyle.accentColor }}>
                                        <div className='h-2 w-full bg-white/20 mt-2'></div>
                                        <div className='size-6 rounded-full bg-white/30 absolute bottom-2 right-2'></div>
                                    </div>
                                ) : t.id === 'classic' ? (
                                    <div className='flex gap-1 h-full'>
                                        <div className='w-1/3 h-full bg-slate-100 rounded-sm'></div>
                                        <div className='w-2/3 space-y-1'>
                                            <div className='h-2 w-full bg-slate-200 rounded-sm'></div>
                                            <div className='h-1 w-full bg-slate-50 rounded-sm'></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-2 gap-1 h-full'>
                                        <div className='col-span-2 h-3 rounded-sm' style={{ backgroundColor: portfolioStyle.accentColor }}></div>
                                        <div className='h-6 bg-slate-100 rounded-sm'></div>
                                        <div className='h-6 bg-slate-50 rounded-sm'></div>
                                        <div className='col-span-2 h-2 bg-slate-100 rounded-sm'></div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className='text-sm font-bold text-slate-800'>{t.label}</p>
                                <p className='text-xs text-slate-500 mt-0.5'>{t.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )
        }

        if (activeSection === 'sections') {
            return (
                <div className='grid sm:grid-cols-2 gap-3'>
                    {Object.keys(defaultStyle.visibleSections).map(section => (
                        <label key={section} className='flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 capitalize cursor-pointer hover:bg-slate-50'>
                            <span className='flex items-center gap-2'><Eye className='size-4 text-slate-400' /> {section}</span>
                            <input type='checkbox' checked={portfolioStyle.visibleSections[section]} onChange={() => toggleSection(section)} className='rounded text-emerald-500 focus:ring-emerald-500 size-4' />
                        </label>
                    ))}
                </div>
            )
        }

        if (activeSection === 'links') {
            return (
                <div className='space-y-3'>
                    {[
                        { key: 'github', icon: Github, placeholder: 'https://github.com/username' },
                        { key: 'linkedin', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
                        { key: 'twitter', icon: Twitter, placeholder: 'https://x.com/username' },
                        { key: 'website', icon: Globe, placeholder: 'https://yoursite.com' },
                    ].map(s => (
                        <div key={s.key} className='flex items-center gap-3'>
                            <s.icon className='size-4 text-slate-400 shrink-0' />
                            <input value={socialLinks[s.key] || ''} onChange={(e) => setSocialLinks(prev => ({ ...prev, [s.key]: e.target.value }))} placeholder={s.placeholder} className='flex-1 px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500' />
                        </div>
                    ))}
                </div>
            )
        }

        return (
            <div className='space-y-8'>
                <section>
                    <label className='block text-sm font-semibold text-slate-700 mb-3'>Accent color</label>
                    <div className='grid grid-cols-5 gap-3'>
                        {accents.map(color => (
                            <button key={color} onClick={() => updateStyle('accentColor', color)} className={`size-10 rounded-xl border-2 transition-all ${portfolioStyle.accentColor === color ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent shadow-sm hover:scale-105'}`} style={{ backgroundColor: color }} title={color} />
                        ))}
                    </div>
                </section>

                <section>
                    <label className='block text-sm font-semibold text-slate-700 mb-3'>Background Aesthetic</label>
                    <div className='grid grid-cols-2 gap-2'>
                        {['mesh', 'solid', 'gradient', 'grain'].map(style => (
                            <button key={style} onClick={() => updateStyle('backgroundStyle', style)} className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${portfolioStyle.backgroundStyle === style ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                {style}
                            </button>
                        ))}
                    </div>
                </section>

                <section className='space-y-4'>
                    <div className='flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200'>
                        <div>
                            <p className='text-sm font-bold text-slate-800'>Glassmorphism</p>
                            <p className='text-[10px] text-slate-500'>Frosted glass cards with backdrop blur</p>
                        </div>
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input type='checkbox' checked={portfolioStyle.glassmorphism} onChange={(e) => updateStyle('glassmorphism', e.target.checked)} className='sr-only peer' />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>

                    <div>
                        <div className='flex items-center justify-between mb-2'>
                            <label className='text-sm font-semibold text-slate-700'>Corner Rounding</label>
                            <span className='text-xs font-bold text-slate-500'>{portfolioStyle.borderRadius}</span>
                        </div>
                        <input 
                            type='range' 
                            min='0' 
                            max='40' 
                            step='2'
                            value={parseInt(portfolioStyle.borderRadius) || 0} 
                            onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                            className='w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500' 
                        />
                        <div className='flex justify-between mt-1'>
                            <span className='text-[10px] text-slate-400'>Sharp</span>
                            <span className='text-[10px] text-slate-400'>Soft</span>
                        </div>
                    </div>
                </section>

                <section>
                    <label className='block text-sm font-semibold text-slate-700 mb-3'>Typography</label>
                    <div className='grid grid-cols-2 gap-2'>
                        {fonts.map(font => (
                            <button 
                                key={font} 
                                onClick={() => updateStyle('fontFamily', font)} 
                                className={`px-4 py-3 rounded-xl border text-left transition-all ${portfolioStyle.fontFamily === font ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                style={{ fontFamily: font }}
                            >
                                {font}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        )
    }

    const activeIndex = builderSections.findIndex(section => section.id === activeSection)

    // LIVE PREVIEW PORTFOLIO LOGIC
    const accent = portfolioStyle.accentColor || '#10b981'
    const template = portfolioStyle.template
    const isStudio = template === 'studio'
    const isClassic = template === 'classic'
    const isBento = template === 'bento' || template === 'clean'

    const previewSocials = [
        { icon: Github, url: socialLinks?.github || previewInfo.github, label: 'GitHub' },
        { icon: Linkedin, url: socialLinks?.linkedin || previewInfo.linkedin, label: 'LinkedIn' },
        { icon: Twitter, url: socialLinks?.twitter, label: 'Twitter' },
        { icon: Globe, url: socialLinks?.website || previewInfo.website, label: 'Website' },
    ].filter(s => s.url)

    const getBackground = () => {
        if (portfolioStyle.backgroundStyle === 'mesh') {
            return {
                background: `radial-gradient(at 0% 0%, ${accent}15 0px, transparent 50%), radial-gradient(at 100% 100%, ${accent}10 0px, transparent 50%), radial-gradient(at 100% 0%, #f1f5f9 0px, transparent 50%)`,
                backgroundColor: '#f8fafc'
            }
        }
        if (portfolioStyle.backgroundStyle === 'gradient') return { background: `linear-gradient(135deg, #f8fafc 0%, ${accent}08 100%)` }
        if (portfolioStyle.backgroundStyle === 'grain') {
            return {
                backgroundColor: '#f1f5f9',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundBlendMode: 'overlay', opacity: 0.8
            }
        }
        return { backgroundColor: portfolioStyle.backgroundStyle === 'solid' ? '#ffffff' : '#f8fafc' }
    }

    const cardStyles = {
        borderRadius: portfolioStyle.borderRadius || '0px',
        backgroundColor: portfolioStyle.glassmorphism ? 'rgba(255, 255, 255, 0.7)' : (isBento ? `${accent}05` : '#ffffff'),
        backdropFilter: portfolioStyle.glassmorphism ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: portfolioStyle.glassmorphism ? 'blur(12px)' : 'none',
        border: `1px solid ${portfolioStyle.glassmorphism ? 'rgba(255, 255, 255, 0.3)' : (isBento ? `${accent}20` : '#e2e8f0')}`,
    }

    const sectionTitle = (label, Icon, isAccentBg = false) => (
        <div className='flex items-center gap-3 mb-6'>
            <div className='relative'>
                {!isAccentBg && <div className='absolute inset-0 blur-lg opacity-20' style={{ backgroundColor: accent }}></div>}
                <span className={`relative size-10 flex items-center justify-center border ${isAccentBg ? 'bg-white/20 border-white/20 text-white' : 'bg-white'}`} style={!isAccentBg ? { borderColor: isBento ? `${accent}30` : '#e2e8f0', color: accent, borderRadius: portfolioStyle.borderRadius } : { borderRadius: portfolioStyle.borderRadius }}>
                    <Icon className='size-5' />
                </span>
            </div>
            <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isAccentBg ? 'text-white/70' : 'text-slate-400'}`}>{label}</h2>
        </div>
    )

    return (
        <div className='min-h-screen bg-slate-50'>
            <div className='max-w-[1600px] mx-auto px-2 sm:px-3 py-5'>
                <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
                    <Link to='/app' className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
                        <ArrowLeft className='size-4' /> Back to Dashboard
                    </Link>
                    <div className='flex flex-wrap items-center gap-2'>
                        {username && usernameStatus !== 'taken' && usernameStatus !== 'invalid' && (
                            <>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/portfolio/${username}`)
                                        toast.success('Link copied to clipboard')
                                    }} 
                                    className='inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors'
                                >
                                    <Share2 className='size-4' /> Share
                                </button>
                                <a href={`/portfolio/${username}`} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors'>
                                    <Eye className='size-4' /> View Live
                                </a>
                            </>
                        )}
                        <button onClick={save} disabled={isSaving} className={`inline-flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            {isSaving ? <Loader2 className='size-4 animate-spin' /> : <Save className='size-4' />}
                            {isSaving ? 'Saving...' : 'Save Portfolio'}
                        </button>
                    </div>
                </div>

                <div className='grid lg:grid-cols-12 gap-5'>
                    <section className='lg:col-span-4'>
                        <div className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
                            <div className='relative px-6 pt-6 pb-5 border-b border-slate-100'>
                                <div className='absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-300' style={{ width: `${((activeIndex + 1) / builderSections.length) * 100}%` }}></div>
                                <p className='text-sm font-semibold text-emerald-600 mb-1'>Portfolio Builder</p>
                                <h1 className='text-2xl font-bold text-slate-900'>Build your public profile</h1>
                            </div>

                            <div className='grid sm:grid-cols-[150px_1fr]'>
                                <nav className='border-b sm:border-b-0 sm:border-r border-slate-100 p-3 bg-slate-50'>
                                    <div className='grid grid-cols-2 sm:grid-cols-1 gap-1'>
                                        {builderSections.map(section => (
                                            <button key={section.id} onClick={() => setActiveSection(section.id)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors ${activeSection === section.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-800'}`}>
                                                <section.icon className='size-4' /> {section.label}
                                            </button>
                                        ))}
                                    </div>
                                </nav>
                                <div className='p-4 min-h-[520px]'>
                                    <div className='flex items-center gap-2 mb-5'>
                                        {(() => {
                                            const current = builderSections.find(section => section.id === activeSection)
                                            const Icon = current?.icon || Sparkles
                                            return <Icon className='size-5 text-emerald-600' />
                                        })()}
                                        <h2 className='font-semibold text-slate-900'>{builderSections.find(section => section.id === activeSection)?.label}</h2>
                                    </div>
                                    {renderEditor()}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='lg:col-span-8'>
                        <div className='sticky top-6'>
                            <div className='flex items-center justify-between gap-3 mb-3'>
                                <p className='text-sm font-semibold text-slate-700'>Live preview</p>
                                <span className='text-[11px] px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-500 capitalize'>{portfolioStyle.template}</span>
                            </div>
                            
                            {/* COMPLETE PORTFOLIO PREVIEW */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm h-[700px] flex flex-col bg-white">
                                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2 shrink-0">
                                    <div className="flex gap-1.5"><div className="size-3 rounded-full bg-red-400"/><div className="size-3 rounded-full bg-amber-400"/><div className="size-3 rounded-full bg-emerald-400"/></div>
                                    <div className="bg-white text-slate-400 text-[10px] px-3 py-1 rounded w-full max-w-sm flex items-center justify-center font-mono shadow-sm">resumeai.app/portfolio/{username || 'your-name'}</div>
                                </div>
                                <div className="flex-1 overflow-y-auto select-none" style={{ ...getBackground(), fontFamily: `"${portfolioStyle.fontFamily}", sans-serif` }}>
                                    
                                    <div className='max-w-7xl mx-auto px-6 py-12 lg:py-16'>
                                        {isBento ? (
                                            <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
                                                {/* HERO BLOCK */}
                                                <header className='md:col-span-8 flex flex-col justify-center p-8 min-h-[300px] relative overflow-hidden shadow-lg' style={{ ...cardStyles, backgroundColor: accent, border: 'none' }}>
                                                    <div className='absolute top-0 right-0 w-64 h-64 blur-3xl opacity-20 bg-white -mr-32 -mt-32 rounded-full'></div>
                                                    <div className='relative z-10'>
                                                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md text-white border border-white/20'>
                                                            <Sparkles className='size-3 text-white' /> Available for projects
                                                        </div>
                                                        <h1 className='text-5xl font-black mb-4 tracking-tighter text-white leading-[0.9] drop-shadow-sm'>
                                                            {previewName}
                                                        </h1>
                                                        {previewProfession && (
                                                            <p className='text-xl font-medium mb-6 flex items-center gap-4 text-white/90'>
                                                                <span className='w-8 h-[2px] bg-white/50'></span>
                                                                {previewProfession}
                                                            </p>
                                                        )}
                                                        <div className='flex flex-wrap items-center gap-4'>
                                                            {portfolioStyle.showResumeDownload && (
                                                                <span className='inline-flex items-center gap-2 px-6 py-3 text-sm font-bold shadow-lg bg-white text-slate-900' style={{ borderRadius: portfolioStyle.borderRadius }}>
                                                                    <Download className='size-4' /> View Resume
                                                                </span>
                                                            )}
                                                            <span className='inline-flex items-center gap-2 px-6 py-3 text-sm font-bold border-2 border-white/20 bg-white/10 text-white shadow-sm' style={{ borderRadius: portfolioStyle.borderRadius }}>
                                                                <Share2 className='size-4' /> Share
                                                            </span>
                                                            {previewSocials.map((s) => (
                                                                <div key={s.label} className='size-12 flex items-center justify-center bg-white/10 border border-white/20 text-white shadow-sm' style={{ borderRadius: portfolioStyle.borderRadius }}>
                                                                    <s.icon size={20} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </header>

                                                {/* IMAGE BLOCK */}
                                                <aside className='md:col-span-4 flex items-center justify-center p-2 shadow-sm' style={{ ...cardStyles, backgroundColor: `${accent}15` }}>
                                                    <div className='relative w-full aspect-square overflow-hidden' style={{ borderRadius: portfolioStyle.borderRadius }}>
                                                        {displayImage ? (
                                                            <img src={displayImage} alt={previewName} className='size-full object-cover' />
                                                        ) : (
                                                            <div className='size-full flex items-center justify-center' style={{ backgroundColor: `${accent}20` }}>
                                                                <User size={48} style={{ color: accent }} className='opacity-50' />
                                                            </div>
                                                        )}
                                                    </div>
                                                </aside>

                                                {/* ABOUT BLOCK */}
                                                {portfolioStyle.visibleSections.about && bio && (
                                                    <section className='md:col-span-5 p-8 relative overflow-hidden shadow-sm' style={cardStyles}>
                                                        <div className='absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10' style={{ backgroundColor: accent }}></div>
                                                        {sectionTitle('Manifesto', User)}
                                                        <p className='text-lg font-medium leading-relaxed text-slate-700 relative z-10 line-clamp-4'>
                                                            "{bio}"
                                                        </p>
                                                    </section>
                                                )}

                                                {/* SKILLS BLOCK */}
                                                {portfolioStyle.visibleSections.skills && (
                                                    <section className='md:col-span-7 p-8 relative overflow-hidden shadow-sm' style={{ ...cardStyles, backgroundColor: `${accent}05` }}>
                                                        <div className='absolute bottom-0 left-0 w-32 h-32 blur-3xl opacity-10' style={{ backgroundColor: accent }}></div>
                                                        {sectionTitle('Tech Stack', Award)}
                                                        <div className='flex flex-wrap gap-2 relative z-10'>
                                                            {(selectedResume?.skills || ['React', 'Node.js', 'Design', 'Strategy']).map((skill, i) => (
                                                                <span key={i} className='px-3 py-1.5 shadow-sm border text-[10px] font-bold text-white uppercase tracking-tight' style={{ borderRadius: portfolioStyle.borderRadius, backgroundColor: accent, borderColor: accent }}>
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}

                                                {/* PROJECTS BLOCK */}
                                                {portfolioStyle.visibleSections.projects && (
                                                    <section className='md:col-span-12 p-8 shadow-sm' style={cardStyles}>
                                                        {sectionTitle('Selected Works', CodeXml)}
                                                        <div className='grid md:grid-cols-2 gap-6'>
                                                            {(selectedResume?.project?.length > 0 ? selectedResume.project : [{name: 'Sample Project', description: 'A description of this sample project.'}]).slice(0,2).map((proj, i) => (
                                                                <article key={i} className='flex flex-col'>
                                                                    <div className='aspect-video mb-4 overflow-hidden relative shadow-sm border border-slate-100' style={{ borderRadius: portfolioStyle.borderRadius, backgroundColor: `${accent}10` }}>
                                                                        <div className='absolute inset-0 flex flex-col items-center justify-center opacity-90' style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent})` }}>
                                                                            <CodeXml size={32} className='text-white/80 mb-2' />
                                                                        </div>
                                                                    </div>
                                                                    <h3 className='text-lg font-black text-slate-900 mb-2 uppercase tracking-tight'>{proj.name}</h3>
                                                                    <p className='text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2'>{proj.description}</p>
                                                                </article>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}

                                                {/* EXPERIENCE BLOCK */}
                                                {portfolioStyle.visibleSections.experience && (
                                                    <section className='md:col-span-8 p-8 relative overflow-hidden shadow-sm' style={{ ...cardStyles, backgroundColor: `${accent}05` }}>
                                                        <div className='absolute bottom-0 right-0 w-64 h-64 blur-3xl opacity-5 -mr-32 -mb-32' style={{ backgroundColor: accent }}></div>
                                                        {sectionTitle('Career Path', Building2)}
                                                        <div className='space-y-6 relative z-10'>
                                                            {(selectedResume?.experience?.length > 0 ? selectedResume.experience : [{position: 'Senior Role', company: 'Tech Corp', start_date: '2020', end_date: '2023', description: 'Led a team of developers to build amazing products.'}]).slice(0,2).map((exp, i) => (
                                                                <div key={i} className='grid md:grid-cols-[100px_1fr] gap-4'>
                                                                    <div className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>
                                                                        {exp.start_date} — {exp.is_current ? 'Now' : exp.end_date}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className='text-base font-bold text-slate-900'>{exp.position}</h3>
                                                                        <p className='text-xs font-bold mb-2' style={{ color: accent }}>{exp.company}</p>
                                                                        <p className='text-xs text-slate-600 leading-relaxed line-clamp-2'>{exp.description}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}

                                                {/* CONTACT BLOCK */}
                                                <section className='md:col-span-4 p-8 flex flex-col justify-between overflow-hidden relative shadow-sm' style={{ ...cardStyles, backgroundColor: '#0f172a', border: 'none' }}>
                                                    <div className='absolute top-0 right-0 w-48 h-48 blur-3xl opacity-20 rounded-full -mr-16 -mt-16' style={{ backgroundColor: accent }}></div>
                                                    <div className='relative z-10'>
                                                        {sectionTitle('Contact', Mail, true)}
                                                        <h3 className='text-2xl font-black text-white leading-tight mb-4'>Ready to start?</h3>
                                                    </div>
                                                    <div className='relative z-10 w-full py-3 text-white text-center font-black uppercase tracking-widest text-[10px] shadow-2xl mt-8' style={{ borderRadius: portfolioStyle.borderRadius, backgroundColor: accent }}>
                                                        Send Message
                                                    </div>
                                                </section>
                                            </div>
                                        ) : (
                                            // CLASSIC AND STUDIO PREVIEW
                                            <div>
                                                <header className={isStudio ? 'text-white overflow-hidden relative' : 'bg-white border-b border-slate-200/60 shadow-sm'} style={{ 
                                                    borderRadius: portfolioStyle.borderRadius || '0px',
                                                    backgroundColor: isStudio ? accent : (cardStyles.backgroundColor || 'white'),
                                                    border: isStudio ? 'none' : cardStyles.border,
                                                }}>
                                                    {isStudio && (
                                                        <div className='absolute inset-0 opacity-10'>
                                                            <div className='absolute top-[-10%] left-[-10%] size-96 rounded-full bg-white blur-3xl'></div>
                                                        </div>
                                                    )}
                                                    <div className={`px-6 py-10 relative z-10`}>
                                                        <div className={`grid gap-8 ${isClassic ? 'sm:grid-cols-[180px_1fr]' : 'sm:grid-cols-[1fr_200px]'} items-center`}>
                                                            <div className={isClassic ? 'sm:order-2' : ''}>
                                                                <h1 className={`text-4xl font-black mb-2 tracking-tight ${isStudio ? 'text-white' : 'text-slate-950'}`}>
                                                                    {previewName}
                                                                </h1>
                                                                {previewProfession && (
                                                                    <p className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isStudio ? 'text-white/90' : ''}`} style={isStudio ? undefined : { color: accent }}>
                                                                        <span className='w-6 h-[2px]' style={{ backgroundColor: isStudio ? 'white' : accent }}></span>
                                                                        {previewProfession}
                                                                    </p>
                                                                )}
                                                                {bio && <p className={`${isStudio ? 'text-white/80' : 'text-slate-600'} text-xs leading-relaxed max-w-lg line-clamp-3`}>{bio}</p>}
                                                            </div>

                                                            <aside className={`${isStudio ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : 'bg-white border-slate-200 shadow-xl'} border p-6 ${isClassic ? 'sm:order-1' : ''}`} style={{ borderRadius: portfolioStyle.borderRadius }}>
                                                                <div className='relative mb-4'>
                                                                    {displayImage ? (
                                                                        <img src={displayImage} alt={previewName} className='size-24 object-cover border-2 border-white shadow-md mx-auto' style={{ borderRadius: portfolioStyle.borderRadius }} />
                                                                    ) : (
                                                                        <div className='size-24 border-2 border-white shadow-md flex items-center justify-center mx-auto' style={{ borderRadius: portfolioStyle.borderRadius, backgroundColor: isStudio ? 'rgba(255,255,255,0.2)' : `${accent}10` }}>
                                                                            <User size={32} className={isStudio ? 'text-white/50' : 'opacity-50'} style={isStudio ? {} : { color: accent }} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className={`space-y-3 text-[10px] font-medium ${isStudio ? 'text-white/90' : 'text-slate-600'} flex flex-col items-center`}>
                                                                    <p className='flex items-center gap-2'><Mail size={12} style={{ color: isStudio ? 'white' : accent }} /> Contact Me</p>
                                                                    <p className='flex items-center gap-2'><MapPin size={12} style={{ color: isStudio ? 'white' : accent }} /> Based in World</p>
                                                                </div>
                                                            </aside>
                                                        </div>
                                                    </div>
                                                </header>

                                                <div className={`px-6 py-10 ${isClassic ? 'grid grid-cols-[1fr_200px] gap-8' : 'space-y-10'}`}>
                                                    <div className='space-y-8'>
                                                        {portfolioStyle.visibleSections.experience && (
                                                            <section>
                                                                {sectionTitle('Experience', Building2)}
                                                                <div className='space-y-4'>
                                                                    {(selectedResume?.experience?.length > 0 ? selectedResume.experience : [{position: 'Senior Role', company: 'Tech Corp', start_date: '2020', end_date: '2023', description: 'Led a team of developers.'}]).slice(0,2).map((exp, i) => (
                                                                        <div key={i} className='p-6 grid grid-cols-[100px_1fr] gap-4 shadow-sm' style={cardStyles}>
                                                                            <div className='text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1'>{exp.start_date}</div>
                                                                            <div>
                                                                                <h3 className='text-sm font-bold text-slate-900'>{exp.position}</h3>
                                                                                <p className='text-xs font-bold mb-2' style={{ color: accent }}>{exp.company}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </section>
                                                        )}
                                                        {portfolioStyle.visibleSections.projects && (
                                                            <section>
                                                                {sectionTitle('Projects', CodeXml)}
                                                                <div className='grid sm:grid-cols-2 gap-4'>
                                                                    {(selectedResume?.project?.length > 0 ? selectedResume.project : [{name: 'Sample Project'}]).slice(0,2).map((proj, i) => (
                                                                        <article key={i} className='flex flex-col overflow-hidden shadow-sm' style={cardStyles}>
                                                                            <div className='aspect-video overflow-hidden relative shadow-sm border-b border-slate-100' style={{ backgroundColor: `${accent}10` }}>
                                                                                <div className='absolute inset-0 flex flex-col items-center justify-center opacity-90' style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent})` }}></div>
                                                                            </div>
                                                                            <div className='p-4 flex flex-col flex-1'>
                                                                                <h3 className='text-sm font-bold text-slate-900'>{proj.name}</h3>
                                                                            </div>
                                                                        </article>
                                                                    ))}
                                                                </div>
                                                            </section>
                                                        )}
                                                    </div>
                                                    <div className='space-y-8'>
                                                        {portfolioStyle.visibleSections.skills && (
                                                            <section>
                                                                {sectionTitle('Expertise', Award)}
                                                                <div className='flex flex-wrap gap-2'>
                                                                    {(selectedResume?.skills || ['React', 'Node.js']).map((skill, i) => (
                                                                        <span key={i} className='px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-700 shadow-sm' style={{ borderRadius: portfolioStyle.borderRadius }}>{skill}</span>
                                                                    ))}
                                                                </div>
                                                            </section>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default PortfolioSettings