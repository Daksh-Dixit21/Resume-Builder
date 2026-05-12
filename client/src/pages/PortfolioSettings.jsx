import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, X, Loader2, ExternalLink, Save, Github, Linkedin, Twitter, Globe, Download, Eye, LayoutTemplate, Palette, Type, SlidersHorizontal, ImagePlus, UploadCloud, Mail, MapPin, Phone, BriefcaseBusiness, WandSparkles, UserRound, FileText, Sparkles, Share2, Award, GraduationCap, CodeXml } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const templates = [
    { id: 'clean', label: 'Clean', desc: 'Balanced profile with compact sections' },
    { id: 'studio', label: 'Studio', desc: 'Bold header with project-first energy' },
    { id: 'classic', label: 'Classic', desc: 'Recruiter-friendly editorial layout' },
]

const fonts = ['Outfit', 'Inter', 'Poppins', 'Montserrat', 'Raleway', 'Open Sans', 'Lora', 'Playfair Display', 'Caveat', 'Fira Code']
const accents = ['#10b981', '#2563eb', '#f97316', '#7c3aed', '#ef4444', '#06b6d4', '#f59e0b', '#ec4899', '#0f766e', '#1e293b', '#6366f1', '#8b5cf6', '#d946ef', '#14b8a6', '#4ade80']

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
            setPortfolioStyle({
                ...defaultStyle,
                ...(s.portfolioStyle || {}),
                visibleSections: { ...defaultStyle.visibleSections, ...(s.portfolioStyle?.visibleSections || {}) },
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
                            <div>
                                <label htmlFor='portfolio-image' className='inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer'>
                                    <UploadCloud className='size-4 text-emerald-600' /> Upload image
                                </label>
                                <input id='portfolio-image' type='file' accept='image/*' onChange={handleImageChange} hidden />
                                <p className='text-xs text-slate-400 mt-2'>Square photos work best. This can be different from your resume photo.</p>
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
                                    <div className='space-y-1'>
                                        <div className='h-2 w-1/2 rounded-sm' style={{ backgroundColor: portfolioStyle.accentColor }}></div>
                                        <div className='h-1.5 w-full bg-slate-100 rounded-sm'></div>
                                        <div className='grid grid-cols-2 gap-1'>
                                            <div className='h-4 bg-slate-50 rounded-sm'></div>
                                            <div className='h-4 bg-slate-50 rounded-sm'></div>
                                        </div>
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
            <div className='space-y-6'>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-3'>Accent color</label>
                    <div className='grid grid-cols-5 gap-3'>
                        {accents.map(color => (
                            <button key={color} onClick={() => updateStyle('accentColor', color)} className={`size-10 rounded-xl border-2 transition-all ${portfolioStyle.accentColor === color ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent shadow-sm hover:scale-105'}`} style={{ backgroundColor: color }} title={color} />
                        ))}
                    </div>
                </div>
                <div>
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
                </div>
            </div>
        )
    }

    const previewSocials = [
        { icon: Github, url: socialLinks.github },
        { icon: Linkedin, url: socialLinks.linkedin },
        { icon: Twitter, url: socialLinks.twitter },
        { icon: Globe, url: socialLinks.website },
    ].filter(item => item.url)

    const activeIndex = builderSections.findIndex(section => section.id === activeSection)

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
                            <div className='rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all' style={{ fontFamily: `"${portfolioStyle.fontFamily}", sans-serif` }}>
                                <div className={`${portfolioStyle.template === 'studio' ? 'text-white overflow-hidden relative' : 'bg-white border-b border-slate-200/60'} p-8`} style={portfolioStyle.template === 'studio' ? { backgroundColor: portfolioStyle.accentColor } : undefined}>
                                    {portfolioStyle.template === 'studio' && (
                                        <div className='absolute inset-0 opacity-10 pointer-events-none'>
                                            <div className='absolute top-[-10%] left-[-10%] size-40 rounded-full bg-white blur-2xl'></div>
                                        </div>
                                    )}
                                    <div className={`relative z-10 grid gap-5 ${portfolioStyle.template === 'classic' ? 'sm:grid-cols-[1fr_150px]' : 'sm:grid-cols-[1fr_170px]'} items-center`}>
                                        <div className={portfolioStyle.template === 'classic' ? 'sm:order-2 text-right' : ''}>
                                            <h3 className={`text-3xl font-black tracking-tight ${portfolioStyle.template === 'studio' ? 'text-white' : 'text-slate-950'}`}>{previewName}</h3>
                                            <p className='text-sm font-bold mt-2 flex items-center gap-2' style={portfolioStyle.template === 'studio' ? undefined : { color: portfolioStyle.accentColor }}>
                                                {portfolioStyle.template !== 'classic' && <span className='w-4 h-[1px]' style={{ backgroundColor: portfolioStyle.template === 'studio' ? 'white' : portfolioStyle.accentColor }}></span>}
                                                {previewProfession}
                                            </p>
                                            {bio && <p className={`text-[10px] leading-relaxed mt-3 line-clamp-2 ${portfolioStyle.template === 'studio' ? 'text-white/80' : 'text-slate-500'}`}>{bio}</p>}
                                            <div className='flex flex-wrap gap-2 mt-4'>
                                                {portfolioStyle.showResumeDownload && <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm ${portfolioStyle.template === 'studio' ? 'bg-white text-slate-900' : 'text-white'}`} style={portfolioStyle.template === 'studio' ? undefined : { backgroundColor: portfolioStyle.accentColor }}><Download className='size-3' /> Resume</span>}
                                                {previewSocials.map((item, index) => <span key={index} className={`size-7 rounded-lg flex items-center justify-center ${portfolioStyle.template === 'studio' ? 'bg-white/15 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}><item.icon className='size-3.5' /></span>)}
                                            </div>
                                        </div>
                                        <div className={`${portfolioStyle.template === 'classic' ? 'sm:order-1' : ''}`}>
                                            <div className='size-28 rounded-2xl border-2 border-white/20 bg-slate-100 overflow-hidden shadow-lg flex items-center justify-center'>
                                                {displayImage ? <img src={displayImage} alt='Portfolio preview' className='size-full object-cover' /> : <ImagePlus className='size-8 text-slate-300' />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-8 ${portfolioStyle.template === 'classic' ? 'bg-[#f8f9fa]' : 'bg-slate-50/50'}`}>
                                    <div className='grid sm:grid-cols-2 gap-4'>
                                        {portfolioStyle.visibleSections.about && (
                                            <div className='sm:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm'>
                                                <div className='flex items-center gap-2 mb-3'>
                                                    <div className='size-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100'><UserRound className='size-3' style={{ color: portfolioStyle.accentColor }} /></div>
                                                    <div className='h-1.5 bg-slate-200 rounded w-12'></div>
                                                </div>
                                                <div className='space-y-1.5'>
                                                    {bio ? (
                                                        <p className='text-[10px] text-slate-500 line-clamp-2'>{bio}</p>
                                                    ) : (
                                                        <>
                                                            <div className='h-1.5 bg-slate-100 rounded'></div>
                                                            <div className='h-1.5 bg-slate-100 rounded w-4/5'></div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {portfolioStyle.visibleSections.projects && (
                                            <div className='bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm'>
                                                <div className='size-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3'><LayoutTemplate className='size-4' style={{ color: portfolioStyle.accentColor }} /></div>
                                                {selectedResume?.project?.length > 0 ? (
                                                    <div>
                                                        <div className='font-bold text-[10px] truncate'>{selectedResume.project[0].name}</div>
                                                        <div className='text-[8px] text-slate-400 line-clamp-1 mt-1'>{selectedResume.project[0].description}</div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='h-2 bg-slate-900 rounded w-16 mb-2'></div>
                                                        <div className='h-1.5 bg-slate-100 rounded w-full'></div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {portfolioStyle.visibleSections.experience && (
                                            <div className='bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm'>
                                                <div className='size-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3'><BriefcaseBusiness className='size-4' style={{ color: portfolioStyle.accentColor }} /></div>
                                                {selectedResume?.experience?.length > 0 ? (
                                                    <div>
                                                        <div className='font-bold text-[10px] truncate'>{selectedResume.experience[0].position}</div>
                                                        <div className='text-[8px] text-slate-400 truncate mt-1'>{selectedResume.experience[0].company}</div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='h-2 bg-slate-900 rounded w-20 mb-2'></div>
                                                        <div className='h-1.5 bg-slate-100 rounded w-full'></div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {portfolioStyle.visibleSections.certifications && (
                                            <div className='bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm'>
                                                <div className='size-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3'><Award className='size-4' style={{ color: portfolioStyle.accentColor }} /></div>
                                                {selectedResume?.certifications?.length > 0 ? (
                                                    <div>
                                                        <div className='font-bold text-[10px] truncate'>{selectedResume.certifications[0].name}</div>
                                                        <div className='text-[8px] text-slate-400 truncate mt-1'>{selectedResume.certifications[0].issuer}</div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='h-2 bg-slate-900 rounded w-24 mb-2'></div>
                                                        <div className='h-1.5 bg-slate-100 rounded w-full'></div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {portfolioStyle.visibleSections.languages && (
                                            <div className='bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm'>
                                                <div className='size-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3'><Globe className='size-4' style={{ color: portfolioStyle.accentColor }} /></div>
                                                <div className='flex gap-2 flex-wrap'>
                                                    {(selectedResume?.languages || [{name: 'Lang', level: 'Level'}]).map((l, i) => (
                                                        <div key={i} className='px-2 py-1 rounded bg-slate-50 text-[10px] font-bold' style={{ color: portfolioStyle.accentColor }}>{l.name}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {portfolioStyle.visibleSections.education && (
                                            <div className='bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm'>
                                                <div className='size-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3'><GraduationCap className='size-4' style={{ color: portfolioStyle.accentColor }} /></div>
                                                {selectedResume?.education?.length > 0 ? (
                                                    <div>
                                                        <div className='font-bold text-[10px] truncate'>{selectedResume.education[0].degree}</div>
                                                        <div className='text-[8px] text-slate-400 truncate mt-1'>{selectedResume.education[0].institution}</div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='h-2 bg-slate-900 rounded w-20 mb-2'></div>
                                                        <div className='h-1.5 bg-slate-100 rounded w-full'></div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {portfolioStyle.visibleSections.skills && (
                                            <div className='sm:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm'>
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selectedResume?.skills || ['Skill', 'Skill', 'Skill']).slice(0, 6).map((s, i) => (
                                                        <div key={i} className='px-2 py-1 rounded-full border border-slate-100 text-[10px] font-bold text-slate-500'>{s}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className='mt-8 pt-8 border-t border-slate-100 text-center'>
                                        <p className='text-[10px] font-bold text-slate-300 uppercase tracking-widest'>Made with ResumeAI</p>
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
