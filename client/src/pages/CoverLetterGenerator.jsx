import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Sparkles, Loader2, Copy, Check, FileText, Building2, ClipboardList, Download, Printer, UserRound, BriefcaseBusiness, ChevronDown } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const templates = [
    { id: 'professional', label: 'Professional', desc: 'Formal and achievement-led', color: '#10b981' },
    { id: 'casual', label: 'Conversational', desc: 'Warm but still polished', color: '#2563eb' },
    { id: 'creative', label: 'Creative', desc: 'Narrative and memorable', color: '#7c3aed' },
    { id: 'executive', label: 'Executive', desc: 'Leadership and outcomes', color: '#0f172a' },
    { id: 'startup', label: 'Startup', desc: 'Fast, direct, ownership-heavy', color: '#f97316' },
    { id: 'referral', label: 'Referral', desc: 'Warm relationship-aware tone', color: '#db2777' },
];

const visualTemplates = [
    { id: 'classic', label: 'Classic', desc: 'Centered header, traditional spacing' },
    { id: 'modern', label: 'Modern', desc: 'Left-aligned, clean dividers' },
    { id: 'minimal', label: 'Minimal', desc: 'Clean, no-frills editorial look' },
]

const CoverLetterGenerator = () => {
    const { token } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [resumes, setResumes] = useState([])
    const [selectedResumeId, setSelectedResumeId] = useState('')
    const [isResumeMenuOpen, setIsResumeMenuOpen] = useState(false)
    const [company, setCompany] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [hiringManager, setHiringManager] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [template, setTemplate] = useState('professional')
    const [visualTemplate, setVisualTemplate] = useState('classic')
    const [accentColor, setAccentColor] = useState('#10b981')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedContent, setGeneratedContent] = useState('')
    const [generatedTitle, setGeneratedTitle] = useState('')
    const [coverLetterId, setCoverLetterId] = useState(null)
    const [letterDate, setLetterDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
    const [isSaving, setIsSaving] = useState(false)
    const [copied, setCopied] = useState(false)
    const [step, setStep] = useState(1)

    useEffect(() => {
        loadResumes()
    }, [])

    useEffect(() => {
        const resumeId = searchParams.get('resumeId')
        const letterId = searchParams.get('id')
        if (resumeId) setSelectedResumeId(resumeId)
        if (letterId) loadCoverLetter(letterId)
    }, [searchParams])

    const loadCoverLetter = async (id) => {
        try {
            const { data } = await api.get(`/api/cover-letters/${id}`, { headers: { Authorization: token } })
            if (data.coverLetter) {
                setGeneratedContent(data.coverLetter.content)
                setGeneratedTitle(data.coverLetter.title || 'Cover Letter')
                setCoverLetterId(data.coverLetter._id)
                if (data.coverLetter.resumeId) setSelectedResumeId(data.coverLetter.resumeId)
                if (data.coverLetter.jobTitle) setJobTitle(data.coverLetter.jobTitle)
                if (data.coverLetter.company) setCompany(data.coverLetter.company)
                setStep(3)
            }
        } catch (error) {
            toast.error('Failed to load cover letter')
        }
    }

    const loadResumes = async () => {
        try {
            const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
            setResumes(data.resumes)
        } catch (error) {
            toast.error('Failed to load resumes')
        }
    }

    const generate = async () => {
        if (!selectedResumeId) return toast.error('Please select a resume')
        if (!jobDescription.trim()) return toast.error('Please enter a job description')

        setIsGenerating(true)
        try {
            const { data } = await api.post('/api/ai/generate-cover-letter', {
                resumeId: selectedResumeId,
                jobDescription,
                company,
                jobTitle,
                hiringManager,
                template,
            }, { headers: { Authorization: token } })

            setGeneratedContent(data.coverLetter.content)
            setGeneratedTitle(data.coverLetter.title)
            setCoverLetterId(data.coverLetter._id)
            setStep(3)
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to generate cover letter')
        } finally {
            setIsGenerating(false)
        }
    }

    const saveCoverLetter = async () => {
        if (!coverLetterId) return toast.error('No cover letter ID found')
        setIsSaving(true)
        try {
            await api.put(`/api/cover-letters/${coverLetterId}`, { title: generatedTitle, content: generatedContent }, { headers: { Authorization: token } })
            toast.success('Cover letter saved!')
        } catch (error) {
            toast.error('Failed to save cover letter')
        } finally {
            setIsSaving(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedContent)
        setCopied(true)
        toast.success('Copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadTxt = () => {
        const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${generatedTitle || 'cover-letter'}.txt`
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    }

    const printLetter = () => {
        window.print()
    }

    const selectedResume = resumes.find(r => r._id === selectedResumeId)

    const renderVisualTemplate = () => {
        const resume = selectedResume || {}
        const info = resume.personal_info || {}

        if (visualTemplate === 'modern') {
            return (
                <div className="bg-white p-10 text-slate-800 font-sans leading-relaxed shadow-sm border border-slate-100 print:p-0 print:border-none print:shadow-none print:text-[11pt] print:leading-normal">
                    <header className="mb-8 border-b-2 pb-4" style={{ borderColor: accentColor }}>
                        <h1 className="text-3xl font-bold uppercase tracking-tight" style={{ color: accentColor }}>{info.full_name || 'Your Name'}</h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-2 font-medium">
                            {info.email && <span>{info.email}</span>}
                            {info.phone && <span>{info.phone}</span>}
                            {info.location && <span>{info.location}</span>}
                        </div>
                    </header>
                    <div className="mb-8 print:mb-4">
                        <input 
                            value={letterDate} 
                            onChange={(e) => setLetterDate(e.target.value)} 
                            className="font-bold block w-full bg-transparent border-0 p-0 text-inherit hover:bg-slate-50 focus:bg-white focus:ring-2 outline-none rounded"
                        />
                        <div className="mt-6 text-slate-700">
                            <input 
                                value={hiringManager} 
                                onChange={(e) => setHiringManager(e.target.value)} 
                                placeholder="Hiring Manager"
                                className="font-bold block w-full bg-transparent border-0 p-0 text-slate-900 placeholder-slate-400 hover:bg-slate-50 focus:bg-white focus:ring-2 outline-none rounded"
                            />
                            <input 
                                value={company} 
                                onChange={(e) => setCompany(e.target.value)} 
                                placeholder="Target Company"
                                className="block w-full bg-transparent border-0 p-0 text-slate-900 placeholder-slate-400 hover:bg-slate-50 focus:bg-white focus:ring-2 outline-none rounded mt-1"
                            />
                        </div>
                    </div>
                    <div 
                        contentEditable 
                        suppressContentEditableWarning 
                        onBlur={(e) => setGeneratedContent(e.currentTarget.innerText)}
                        className="w-full bg-transparent border-2 border-transparent hover:border-slate-200 focus:border-emerald-500 focus:bg-white hover:bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 p-4 -mx-4 print:p-0 print:m-0 rounded-xl outline-none text-sm whitespace-pre-wrap transition-all leading-relaxed"
                        style={{ fontFamily: 'inherit' }}
                        title="Click to edit your cover letter"
                    >
                        {generatedContent}
                    </div>
                    <footer className="mt-12 print:mt-6">
                        <p>Sincerely,</p>
                        <p className="font-bold mt-2">{info.full_name || 'Your Name'}</p>
                    </footer>
                </div>
            )
        }

        if (visualTemplate === 'minimal') {
            return (
                <div className="bg-white p-10 text-slate-700 font-sans leading-relaxed shadow-sm border border-slate-100 print:p-0 print:border-none print:shadow-none print:text-[11pt] print:leading-normal">
                    <div className="mb-10">
                        <h1 className="text-2xl font-black text-slate-900">{info.full_name || 'Your Name'}</h1>
                        <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: accentColor }}>{info.profession || 'Professional'}</p>
                        <div className="flex gap-4 text-xs mt-3 text-slate-400">
                            {info.email && <span>{info.email}</span>}
                            {info.phone && <span>{info.phone}</span>}
                        </div>
                    </div>
                    <div className="mb-8 text-sm print:mb-4">
                        <input 
                            value={letterDate} 
                            onChange={(e) => setLetterDate(e.target.value)} 
                            className="block w-full bg-transparent border-0 p-0 text-slate-400 mb-4 hover:bg-slate-50 focus:bg-white focus:ring-2 outline-none rounded"
                        />
                        <input 
                            value={hiringManager} 
                            onChange={(e) => setHiringManager(e.target.value)} 
                            placeholder="Hiring Manager"
                            className="font-bold block w-full bg-transparent border-0 p-0 text-slate-900 placeholder-slate-400 hover:bg-slate-50 focus:bg-white focus:ring-2 outline-none rounded"
                        />
                        <input 
                            value={company} 
                            onChange={(e) => setCompany(e.target.value)} 
                            placeholder="Target Company"
                            className="block w-full bg-transparent border-0 p-0 text-slate-500 placeholder-slate-400 hover:bg-slate-50 focus:bg-white focus:ring-2 outline-none rounded mt-1"
                        />
                    </div>
                    <div 
                        contentEditable 
                        suppressContentEditableWarning 
                        onBlur={(e) => setGeneratedContent(e.currentTarget.innerText)}
                        className="w-full bg-transparent border-2 border-transparent hover:border-slate-200 focus:border-emerald-500 focus:bg-white hover:bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 p-4 -mx-4 print:p-0 print:m-0 rounded-xl outline-none text-sm whitespace-pre-wrap transition-all leading-relaxed"
                        style={{ fontFamily: 'inherit' }}
                        title="Click to edit your cover letter"
                    >
                        {generatedContent}
                    </div>
                    <footer className="mt-12 pt-6 border-t border-slate-100 print:mt-6 print:pt-4">
                        <p className="font-bold text-slate-900">{info.full_name || 'Your Name'}</p>
                    </footer>
                </div>
            )
        }

        // Classic (Default)
        return (
            <div className="bg-white p-10 text-slate-800 font-serif leading-relaxed shadow-sm border border-slate-100 print:p-0 print:border-none print:shadow-none print:text-[11pt] print:leading-normal">
                <header className="text-center mb-10 border-b pb-6 border-slate-200">
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{info.full_name || 'Your Name'}</h1>
                    <p className="text-sm text-slate-500 mt-2">
                        {[info.location, info.phone, info.email].filter(Boolean).join('  |  ')}
                    </p>
                </header>
                <div className="mb-8 print:mb-4">
                    <input 
                        value={letterDate} 
                        onChange={(e) => setLetterDate(e.target.value)} 
                        className="block w-full bg-transparent border-0 p-0 text-inherit hover:bg-slate-50 focus:bg-white focus:ring-2 outline-none rounded"
                    />
                    <div className="mt-6">
                        <input 
                            value={hiringManager} 
                            onChange={(e) => setHiringManager(e.target.value)} 
                            placeholder="Hiring Manager"
                            className="font-bold block w-full bg-transparent border-0 p-0 text-slate-900 placeholder-slate-400 hover:bg-slate-50 focus:bg-white focus:ring-2 outline-none rounded"
                        />
                        <input 
                            value={company} 
                            onChange={(e) => setCompany(e.target.value)} 
                            placeholder="Target Company"
                            className="block w-full bg-transparent border-0 p-0 text-slate-900 placeholder-slate-400 hover:bg-slate-50 focus:bg-white focus:ring-2 outline-none rounded mt-1"
                        />
                    </div>
                </div>
                <div 
                    contentEditable 
                    suppressContentEditableWarning 
                    onBlur={(e) => setGeneratedContent(e.currentTarget.innerText)}
                    className="w-full bg-transparent border-2 border-transparent hover:border-slate-200 focus:border-emerald-500 focus:bg-white hover:bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 p-4 -mx-4 print:p-0 print:m-0 rounded-xl outline-none text-sm whitespace-pre-wrap transition-all leading-relaxed"
                    style={{ fontFamily: 'inherit' }}
                    title="Click to edit your cover letter"
                >
                    {generatedContent}
                </div>
                <footer className="mt-12 print:mt-6">
                    <p>Sincerely,</p>
                    <p className="font-bold mt-4">{info.full_name || 'Your Name'}</p>
                </footer>
            </div>
        )
    }

    return (
        <div className='max-w-6xl mx-auto px-3 sm:px-4 py-8 print:p-0 print:m-0'>
            <Link to='/app' className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all mb-6 print:hidden'>
                <ArrowLeft className='size-4' /> Back to Dashboard
            </Link>

            <h1 className='text-2xl font-bold text-slate-800 mb-1 print:hidden'>AI Cover Letter Generator</h1>
            <p className='text-slate-500 text-sm mb-8 print:hidden'>Generate a tailored cover letter using your resume data and job details.</p>

            {/* Progress Steps */}
            <div className='flex items-center gap-2 mb-8 print:hidden'>
                {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                        <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {s}
                        </div>
                        {s < 3 && <div className={`flex-1 h-0.5 transition-colors ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Select Resume & Template */}
            {step === 1 && (
                <div className='space-y-6'>
                    <div className='relative'>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>
                            <FileText className='inline size-4 mr-1.5' />
                            Select Resume as Reference
                        </label>
                        
                        {/* Custom Styled Dropdown */}
                        <div className='relative'>
                            <button 
                                onClick={() => setIsResumeMenuOpen(!isResumeMenuOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl text-sm transition-all ${isResumeMenuOpen ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <span className={selectedResume ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                                    {selectedResume ? selectedResume.title : 'Choose a resume...'}
                                </span>
                                <ChevronDown className={`size-4 text-slate-400 transition-transform ${isResumeMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isResumeMenuOpen && (
                                <div className='absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden p-1.5 space-y-1 animate-in fade-in zoom-in duration-200'>
                                    {resumes.length > 0 ? (
                                        resumes.map(r => (
                                            <button 
                                                key={r._id} 
                                                onClick={() => {
                                                    setSelectedResumeId(r._id)
                                                    setIsResumeMenuOpen(false)
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${selectedResumeId === r._id ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <div className={`size-8 rounded-lg flex items-center justify-center ${selectedResumeId === r._id ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                                    <FileText className={`size-4 ${selectedResumeId === r._id ? 'text-emerald-600' : 'text-slate-400'}`} />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <p className='truncate'>{r.title}</p>
                                                    <p className='text-[10px] text-slate-400 font-normal mt-0.5 truncate'>{r.personal_info?.full_name || 'No Name Set'}</p>
                                                </div>
                                                {selectedResumeId === r._id && <Check className='size-4 text-emerald-600' />}
                                            </button>
                                        ))
                                    ) : (
                                        <div className='p-4 text-center'>
                                            <p className='text-sm text-slate-400'>No resumes found.</p>
                                            <Link to='/app/builder' className='text-xs text-emerald-600 font-semibold mt-1 inline-block hover:underline'>Create your first resume</Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {isResumeMenuOpen && <div className='fixed inset-0 z-10' onClick={() => setIsResumeMenuOpen(false)}></div>}
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>Cover Letter Style (Tone)</label>
                        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                            {templates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTemplate(t.id)}
                                    className={`p-4 rounded-xl border text-left transition-all ${template === t.id ? 'shadow-sm bg-white' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                                    style={{ borderColor: template === t.id ? t.color : undefined }}
                                >
                                    <div className='flex items-center gap-2 mb-2'>
                                        <span className='size-8 rounded-lg flex items-center justify-center text-white' style={{ backgroundColor: t.color }}>
                                            <Sparkles className='size-4' />
                                        </span>
                                        <p className='text-sm font-semibold text-slate-800'>{t.label}</p>
                                    </div>
                                    <p className='text-xs text-slate-500 mt-1'>{t.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => selectedResumeId ? setStep(2) : toast.error('Please select a resume')}
                        className='w-full sm:w-auto px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors'
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Step 2: Job Details */}
            {step === 2 && (
                <div className='space-y-6'>
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>
                            <Building2 className='inline size-4 mr-1.5' />
                            Company Name <span className='text-slate-400 font-normal'>(optional)</span>
                        </label>
                        <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder='e.g. Google, Microsoft, Startup Inc.'
                            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500'
                        />
                    </div>

                    <div className='grid sm:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-2'>
                                <BriefcaseBusiness className='inline size-4 mr-1.5' />
                                Job Title <span className='text-slate-400 font-normal'>(optional)</span>
                            </label>
                            <input
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder='e.g. Frontend Developer'
                                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-slate-700 mb-2'>
                                <UserRound className='inline size-4 mr-1.5' />
                                Hiring Manager <span className='text-slate-400 font-normal'>(optional)</span>
                            </label>
                            <input
                                value={hiringManager}
                                onChange={(e) => setHiringManager(e.target.value)}
                                placeholder='e.g. Priya Sharma'
                                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500'
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>
                            <ClipboardList className='inline size-4 mr-1.5' />
                            Job Description
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder='Paste the full job description here...'
                            rows={10}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500'
                        />
                    </div>

                    <div className='flex gap-3'>
                        <button onClick={() => setStep(1)} className='px-6 py-2.5 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors'>
                            Back
                        </button>
                        <button
                            onClick={generate}
                            disabled={isGenerating}
                            className={`flex items-center gap-2 px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isGenerating ? <Loader2 className='size-4 animate-spin' /> : <Sparkles className='size-4' />}
                            {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Result */}
            {step === 3 && generatedContent && (
                <div className='grid lg:grid-cols-12 gap-8 print:flex print:flex-col'>
                    <div className='lg:col-span-4 space-y-6 print:hidden'>
                        <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6'>
                            <h2 className='text-sm font-bold text-slate-800 uppercase tracking-wider mb-4'>Document Details</h2>
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-xs font-bold text-slate-500 mb-1.5'>Title</label>
                                    <input 
                                        type="text" 
                                        value={generatedTitle} 
                                        onChange={(e) => setGeneratedTitle(e.target.value)} 
                                        className='w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-700'
                                    />
                                </div>
                                <button onClick={saveCoverLetter} disabled={isSaving} className='w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold transition-colors disabled:opacity-50 shadow-sm'>
                                    {isSaving ? <Loader2 className='size-4 animate-spin' /> : <Check className='size-4' />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6'>
                            <h2 className='text-sm font-bold text-slate-800 uppercase tracking-wider mb-4'>Visual Template</h2>
                            <div className='space-y-3'>
                                {visualTemplates.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setVisualTemplate(t.id)}
                                        className={`w-full p-4 rounded-xl border text-left transition-all ${visualTemplate === t.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <p className={`text-sm font-bold ${visualTemplate === t.id ? 'text-emerald-700' : 'text-slate-800'}`}>{t.label}</p>
                                        <p className='text-xs text-slate-500 mt-1'>{t.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className='mt-6'>
                                <h2 className='text-sm font-bold text-slate-800 uppercase tracking-wider mb-4'>Accent Color</h2>
                                <div className='flex flex-wrap gap-2'>
                                    {['#10b981', '#2563eb', '#f97316', '#7c3aed', '#ef4444', '#06b6d4', '#1e293b'].map(color => (
                                        <button 
                                            key={color} 
                                            onClick={() => setAccentColor(color)}
                                            className={`size-8 rounded-full border-2 transition-all ${accentColor === color ? 'border-slate-900 scale-110 shadow-sm' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <button onClick={copyToClipboard} className='flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium'>
                                {copied ? <Check className='size-4 text-emerald-500' /> : <Copy className='size-4' />}
                                {copied ? 'Copied Content' : 'Copy Text'}
                            </button>
                            <button onClick={downloadTxt} className='flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium'>
                                <Download className='size-4' /> Download TXT
                            </button>
                            <button onClick={printLetter} className='flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium'>
                                <Printer className='size-4' /> Print / Save PDF
                            </button>
                        </div>
                    </div>

                    <div className='lg:col-span-8 print:w-full'>
                        <div id="cover-letter-preview">
                            {renderVisualTemplate()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CoverLetterGenerator
