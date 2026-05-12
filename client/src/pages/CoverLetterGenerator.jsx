import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Sparkles, Loader2, Copy, Check, FileText, Building2, ClipboardList, Download, Printer, UserRound, BriefcaseBusiness } from 'lucide-react'
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

const CoverLetterGenerator = () => {
    const { token } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [resumes, setResumes] = useState([])
    const [selectedResumeId, setSelectedResumeId] = useState('')
    const [company, setCompany] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [hiringManager, setHiringManager] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [template, setTemplate] = useState('professional')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedContent, setGeneratedContent] = useState('')
    const [generatedTitle, setGeneratedTitle] = useState('')
    const [copied, setCopied] = useState(false)
    const [step, setStep] = useState(1)

    useEffect(() => {
        loadResumes()
    }, [])

    useEffect(() => {
        const resumeId = searchParams.get('resumeId')
        if (resumeId) setSelectedResumeId(resumeId)
    }, [searchParams])

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
            setStep(3)
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to generate cover letter')
        } finally {
            setIsGenerating(false)
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
        const printWindow = window.open('', '_blank')
        if (!printWindow) return toast.error('Please allow popups to print')
        printWindow.document.write(`
            <html>
                <head>
                    <title>${generatedTitle || 'Cover Letter'}</title>
                    <style>
                        body { font-family: Arial, sans-serif; color: #0f172a; line-height: 1.65; max-width: 760px; margin: 48px auto; padding: 0 24px; }
                        h1 { font-size: 20px; margin-bottom: 24px; }
                        .letter { white-space: pre-wrap; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <h1>${generatedTitle || 'Cover Letter'}</h1>
                    <div class="letter">${generatedContent.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]))}</div>
                </body>
            </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
    }

    return (
        <div className='max-w-5xl mx-auto px-3 sm:px-4 py-8'>
            <Link to='/app' className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all mb-6'>
                <ArrowLeft className='size-4' /> Back to Dashboard
            </Link>

            <h1 className='text-2xl font-bold text-slate-800 mb-1'>AI Cover Letter Generator</h1>
            <p className='text-slate-500 text-sm mb-8'>Generate a tailored cover letter using your resume data and job details.</p>

            {/* Progress Steps */}
            <div className='flex items-center gap-2 mb-8'>
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
                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>
                            <FileText className='inline size-4 mr-1.5' />
                            Select Resume as Reference
                        </label>
                        <select
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500'
                        >
                            <option value=''>Choose a resume...</option>
                            {resumes.map(r => (
                                <option key={r._id} value={r._id}>{r.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-slate-700 mb-2'>Cover Letter Style</label>
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
                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h2 className='text-lg font-semibold text-slate-800'>Your Cover Letter</h2>
                            {(company || jobTitle) && <p className='text-sm text-slate-400'>{[jobTitle, company].filter(Boolean).join(' at ')}</p>}
                        </div>
                        <div className='flex flex-wrap gap-2 justify-end'>
                            <button onClick={copyToClipboard} className='flex items-center gap-1.5 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600'>
                                {copied ? <Check className='size-4 text-emerald-500' /> : <Copy className='size-4' />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                            <button onClick={downloadTxt} className='flex items-center gap-1.5 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600'>
                                <Download className='size-4' /> TXT
                            </button>
                            <button onClick={printLetter} className='flex items-center gap-1.5 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600'>
                                <Printer className='size-4' /> Print / PDF
                            </button>
                        </div>
                    </div>
                    <div className='bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm'>
                        <div className='prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap'>
                            {generatedContent}
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <button onClick={() => { setStep(2); setGeneratedContent(''); setGeneratedTitle(''); }} className='px-6 py-2.5 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors'>
                            Regenerate
                        </button>
                        <button onClick={() => navigate('/app')} className='px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors'>
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CoverLetterGenerator
