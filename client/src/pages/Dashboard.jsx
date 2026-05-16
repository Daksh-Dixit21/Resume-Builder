import React, { useEffect, useState } from 'react'
import { Activity, BarChart3, BriefcaseBusiness, Copy, Eye, FilePenLineIcon, FileText, Globe, LayoutTemplate, PencilIcon, PlusIcon, ScanSearch, Target, Trash2, TrashIcon, UploadCloud, UploadCloudIcon, WandSparkles, XIcon, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const themeColors = [
  { from: 'from-blue-400', to: 'to-indigo-500', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { from: 'from-emerald-400', to: 'to-teal-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { from: 'from-orange-400', to: 'to-red-500', text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  { from: 'from-violet-400', to: 'to-fuchsia-500', text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { from: 'from-pink-400', to: 'to-rose-500', text: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' }
]

const Dashboard = () => {
  const { user, token } = useSelector(state => state.auth)
  const [allResumes, setAllResumes] = useState([])
  const [coverLetters, setCoverLetters] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Email Tool State
  const [showEmailTool, setShowEmailTool] = useState(false)
  const [emailContent, setEmailContent] = useState('')
  const [refinePrompt, setRefinePrompt] = useState('')
  const [isRefining, setIsRefining] = useState(false)

  const emailTemplates = [
    {
      title: 'Job Application',
      content: `Subject: Application for [Job Title] - [Your Name]\n\nDear [Hiring Manager Name],\n\nI am writing to express my strong interest in the [Job Title] position at [Company Name]. With my background in [Your Field] and experience in [Key Skill], I am confident I would be a valuable asset to your team.\n\nIn my previous role at [Previous Company], I [Briefly mention a key achievement]. I am particularly drawn to [Company Name] because of [Specific reason].\n\nAttached is my resume for your review. I look forward to discussing how my skills can benefit your team.\n\nBest regards,\n[Your Name]\n[Phone]\n[LinkedIn]`
    },
    {
      title: 'Interview Follow-up',
      content: `Subject: Follow-up: [Job Title] Interview - [Your Name]\n\nDear [Interviewer Name],\n\nThank you for the opportunity to interview for the [Job Title] position today. I enjoyed learning about the team and the exciting projects at [Company Name].\n\nOur discussion about [Specific Topic] furthered my interest in the role. I am confident my skills in [Skill] align perfectly with your goals.\n\nPlease let me know if you need any further information. I look forward to hearing from you.\n\nBest regards,\n[Your Name]`
    },
    {
      title: 'Networking Outreach',
      content: `Subject: Inquiry from a fellow [Industry] enthusiast\n\nHi [Name],\n\nI hope you're well. My name is [Your Name], and I'm a [Current Role] at [Company/University]. I've been following your work at [Their Company] and was impressed by [Specific Project].\n\nI'm looking to learn more about the [Industry] and would love to hear about your career journey. If you have 15 minutes for a brief virtual coffee, I would greatly appreciate your insights.\n\nThank you for your time!\n\nBest,\n[Your Name]`
    },
    {
      title: 'Post-Interview Thank You',
      content: `Subject: Thank You - [Job Title] Interview - [Your Name]\n\nHi [Interviewer Name],\n\nThank you for speaking with me today about the [Job Title] role. It was a pleasure meeting the team.\n\nI'm even more excited about joining [Company Name] after hearing about [Something specific]. I believe my experience with [Skill] makes me a great fit.\n\nI look forward to hearing from you soon.\n\nBest regards,\n[Your Name]`
    }
  ]

  const refineEmail = async () => {
    if (!emailContent) return toast.error('Please select a template or enter content')
    setIsRefining(true)
    try {
      const { data } = await api.post('/api/ai/refine-email', { content: emailContent, prompt: refinePrompt }, { headers: { Authorization: token } })
      setEmailContent(data.data)
      setRefinePrompt('')
      toast.success('Email refined!')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsRefining(false)
    }
  }

  const navigate = useNavigate()

  const statCards = analytics ? [
    { label: 'Total Resumes', value: analytics.resumeCount, icon: FileText, colorTheme: 'blue' },
    { label: 'Public Profiles', value: analytics.publicCount, icon: Globe, colorTheme: 'emerald' },
    { label: 'Lifetime Views', value: analytics.totalViews, icon: Eye, colorTheme: 'orange' },
    { label: 'Views This Week', value: analytics.recentViews, icon: BarChart3, colorTheme: 'violet' },
  ] : []

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const loadCoverLetters = async () => {
    try {
      const { data } = await api.get('/api/cover-letters', { headers: { Authorization: token } })
      setCoverLetters(data.coverLetters)
    } catch (error) {
      console.error(error)
    }
  }

  const loadAnalytics = async () => {
    try {
      const { data } = await api.get('/api/resumes/analytics', { headers: { Authorization: token } })
      setAnalytics(data.analytics)
    } catch (error) {
      console.error(error)
    }
  }

  const refreshDashboard = () => {
    loadAllResumes()
    loadCoverLetters()
    loadAnalytics()
  }

  const createResume = async (e) => {
    try {
      e.preventDefault()
      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, { headers: { Authorization: token } })
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const editTitle = async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData()
      formData.append('resumeId', editResumeId)
      formData.append('resumeData', JSON.stringify({ title }))
      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } })
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume))
      setEditResumeId('')
      setTitle('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteResume = async (resumeId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this resume?')) return
      const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })
      setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
      toast.success(data.message)
      loadAnalytics()
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const duplicateResume = async (resumeId) => {
    try {
      const { data } = await api.post(`/api/resumes/duplicate/${resumeId}`, {}, { headers: { Authorization: token } })
      setAllResumes([data.resume, ...allResumes])
      toast.success('Resume duplicated')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const duplicateCoverLetter = async (id) => {
    try {
      const { data } = await api.post(`/api/cover-letters/duplicate/${id}`, {}, { headers: { Authorization: token } })
      setCoverLetters([data.coverLetter, ...coverLetters])
      toast.success('Cover letter duplicated')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteCoverLetter = async (id) => {
    try {
      if (!window.confirm('Delete this cover letter?')) return
      await api.delete(`/api/cover-letters/${id}`, { headers: { Authorization: token } })
      setCoverLetters(coverLetters.filter(cl => cl._id !== id))
      toast.success('Cover letter deleted')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    refreshDashboard()
  }, [])

  return (
    <div className='bg-[#F7F7F5] min-h-screen text-slate-800 font-sans pb-12'>
      <style dangerouslySetInnerHTML={{__html: `
        .metric-block { opacity: 0.5; transition: all 0.3s ease; border-left: 3px solid transparent; padding-left: 0.75rem; cursor: default; }
        .metric-block:hover { opacity: 1; border-color: #cbd5e1; }
        .glow-text { transition: text-shadow 0.3s ease, color 0.3s ease; color: #94a3b8; }
        .metric-block:hover .glow-text-blue { color: #3b82f6; text-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }
        .metric-block:hover .glow-text-emerald { color: #10b981; text-shadow: 0 0 15px rgba(16, 185, 129, 0.6); }
        .metric-block:hover .glow-text-orange { color: #f97316; text-shadow: 0 0 15px rgba(249, 115, 22, 0.6); }
        .metric-block:hover .glow-text-violet { color: #8b5cf6; text-shadow: 0 0 15px rgba(139, 92, 246, 0.6); }
      `}} />

      {/* Playful, colorful header area */}
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 pt-10 pb-8'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
          <div>
            <p className='text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2'>Workspace</p>
            <h1 className='text-4xl font-black text-slate-900 tracking-tight'>Welcome back, {user?.name?.split(' ')[0] || 'User'}! ✌️</h1>
            <p className='text-slate-500 mt-2 max-w-xl'>Build beautiful resumes, generate tailored cover letters, and track your views in one powerful workspace.</p>
          </div>
          
          <div className='flex flex-wrap items-center gap-3'>
            <button onClick={() => setShowUploadResume(true)} className='px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2'>
              <UploadCloudIcon className='size-4 text-blue-500' /> Import PDF
            </button>
            <button onClick={() => setShowCreateResume(true)} className='px-5 py-2.5 bg-slate-900 text-white shadow-lg shadow-slate-900/20 rounded-xl text-sm font-bold hover:shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center gap-2'>
              <PlusIcon className='size-4 text-emerald-400' /> New Resume
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6'>
        <div className='grid xl:grid-cols-[160px_minmax(0,1fr)_320px] gap-12'>
          
          {/* Left Sidebar: Glowing Metrics */}
          <aside className='hidden xl:block space-y-8'>
            <div>
              <h2 className='text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6'>Analytics</h2>
              <div className='space-y-6'>
                {statCards.map((card, i) => (
                  <div key={i} className='metric-block group'>
                    <div className='flex items-center gap-2 text-slate-500 mb-1'>
                      <card.icon className='size-4' />
                      <span className='text-[10px] font-bold uppercase tracking-wider'>{card.label}</span>
                    </div>
                    <div className={`text-3xl font-black glow-text glow-text-${card.colorTheme}`}>
                      {card.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions in Sidebar */}
            <div>
              <h2 className='text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4'>Create</h2>
              <ul className='space-y-3'>
                <li><button onClick={() => setShowCreateResume(true)} className='text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2'><FilePenLineIcon className='size-4'/> Resume</button></li>
                <li><button onClick={() => navigate('/app/cover-letter/new')} className='text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-2'><WandSparkles className='size-4'/> Cover Letter</button></li>
                <li><button onClick={() => navigate('/app/portfolio')} className='text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors flex items-center gap-2'><LayoutTemplate className='size-4'/> Portfolio</button></li>
              </ul>
            </div>
          </aside>

          {/* Main Content: Colorful Resume Cards */}
          <main>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
              <h2 className='text-xl font-bold text-slate-900 flex items-center gap-2'>
                <FileText className='size-5 text-slate-400' /> Your Documents
              </h2>
              <div className='text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm'>
                <Target className='size-3.5 text-blue-500'/> 
                <span><span className='font-bold text-slate-700'>Tip:</span> Use the <span className='font-semibold text-indigo-600'>Match</span> tool to optimize your resume for specific jobs.</span>
              </div>
            </div>

            <div className='grid sm:grid-cols-2 gap-6'>
              {allResumes.length > 0 ? allResumes.map((resume, index) => {
                const theme = themeColors[index % themeColors.length];
                return (
                  <article key={resume._id} className='group bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all overflow-hidden flex flex-col'>
                    {/* Colorful Notion-style cover */}
                    <div className={`h-20 bg-gradient-to-r ${theme.from} ${theme.to} relative`}>
                      <div className='absolute -bottom-6 left-6 size-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center z-10'>
                        <FileText className={`size-6 ${theme.text}`} />
                      </div>
                      <div className='absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <button onClick={() => { setEditResumeId(resume._id); setTitle(resume.title) }} className='p-1.5 rounded-lg bg-white/20 hover:bg-white/90 text-white hover:text-slate-800 backdrop-blur-sm transition-all shadow-sm'><PencilIcon className='size-4' /></button>
                        <button onClick={() => deleteResume(resume._id)} className='p-1.5 rounded-lg bg-white/20 hover:bg-white/90 text-white hover:text-red-500 backdrop-blur-sm transition-all shadow-sm'><TrashIcon className='size-4' /></button>
                      </div>
                    </div>
                    
                    <div className='p-6 pt-10 flex-1 relative'>
                      {resume.public && <span className={`absolute top-4 right-6 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.bg} ${theme.text} ${theme.border} border`}>Public</span>}
                      
                      <h3 onClick={() => navigate(`/app/builder/${resume._id}`)} className='text-lg font-bold text-slate-900 cursor-pointer hover:underline decoration-slate-300 underline-offset-4 line-clamp-1 mb-1'>{resume.title}</h3>
                      <p className='text-xs text-slate-400 font-medium mb-4'>Updated {new Date(resume.updatedAt).toLocaleDateString()} · {resume.views || 0} views</p>

                      <div className='flex flex-wrap gap-1.5'>
                        {resume.skills?.length > 0 && <span className='text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium'>{resume.skills.length} Skills</span>}
                        {resume.project?.length > 0 && <span className='text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium'>{resume.project.length} Projects</span>}
                        {resume.certifications?.length > 0 && <span className='text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium'>{resume.certifications.length} Certs</span>}
                      </div>
                    </div>

                    <div className='grid grid-cols-4 border-t border-slate-100 bg-slate-50/50 divide-x divide-slate-100'>
                      <button onClick={() => navigate(`/app/builder/${resume._id}?tool=match`)} className='py-3 text-[11px] font-bold text-slate-500 hover:bg-white hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5'><Target className='size-3.5'/> Match</button>
                      <button onClick={() => navigate(`/app/builder/${resume._id}?tool=ats`)} className='py-3 text-[11px] font-bold text-slate-500 hover:bg-white hover:text-orange-600 transition-colors flex items-center justify-center gap-1.5'><ScanSearch className='size-3.5'/> ATS</button>
                      <button onClick={() => navigate(`/app/cover-letter/new?resumeId=${resume._id}`)} className='py-3 text-[11px] font-bold text-slate-500 hover:bg-white hover:text-emerald-600 transition-colors flex items-center justify-center gap-1.5'><BriefcaseBusiness className='size-3.5'/> Letter</button>
                      <button onClick={() => duplicateResume(resume._id)} className='py-3 text-[11px] font-bold text-slate-500 hover:bg-white hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5'><Copy className='size-3.5'/> Copy</button>
                    </div>
                  </article>
                );
              }) : (
                <div className='sm:col-span-2 border-2 border-dashed border-slate-200 bg-white rounded-2xl p-12 text-center'>
                  <div className='size-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm'>
                    <PlusIcon className='size-8 text-slate-400' />
                  </div>
                  <h3 className='text-slate-900 font-bold mb-2'>Your workspace is empty</h3>
                  <p className='text-sm text-slate-500 mb-6 max-w-md mx-auto'>Start your career journey by creating a stunning new resume or importing an existing PDF document.</p>
                  <button onClick={() => setShowCreateResume(true)} className='px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all inline-flex items-center gap-2'>
                    Create First Resume
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar: Tools & Letters */}
          <aside className='space-y-8'>
            <section className='bg-white rounded-2xl border border-slate-200 p-6 shadow-sm'>
              <div className='flex items-center gap-2 mb-5'>
                <div className='size-8 rounded-lg bg-indigo-50 flex items-center justify-center'>
                  <WandSparkles className='size-4 text-indigo-600' />
                </div>
                <h2 className='font-bold text-slate-900'>Power Tools</h2>
              </div>
              <div className='space-y-3'>
                <button onClick={() => navigate('/app/portfolio')} className='w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group flex items-start gap-3'>
                  <div className='size-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                    <LayoutTemplate className='size-4 text-orange-600' />
                  </div>
                  <div>
                    <h3 className='text-sm font-bold text-slate-900'>Portfolio Builder</h3>
                    <p className='text-[11px] text-slate-500 mt-0.5'>Publish your profile online.</p>
                  </div>
                </button>
                <button onClick={() => setShowEmailTool(true)} className='w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group flex items-start gap-3'>
                  <div className='size-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                    <Mail className='size-4 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='text-sm font-bold text-slate-900'>Quick Email Tool</h3>
                    <p className='text-[11px] text-slate-500 mt-0.5'>AI refined application drafts.</p>
                  </div>
                </button>
              </div>
            </section>

            <section className='bg-white rounded-2xl border border-slate-200 p-6 shadow-sm'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <div className='size-8 rounded-lg bg-emerald-50 flex items-center justify-center'>
                    <BriefcaseBusiness className='size-4 text-emerald-600' />
                  </div>
                  <h2 className='font-bold text-slate-900'>Cover Letters</h2>
                </div>
                <button onClick={() => navigate('/app/cover-letter/new')} className='text-xs font-bold text-emerald-600 hover:text-emerald-700'>New</button>
              </div>
              <p className='text-[11px] text-slate-500 mb-4 leading-relaxed'>Generate a tailored cover letter to accompany your resume and increase your chances of selection.</p>
              <div className='space-y-4'>
                {coverLetters.length > 0 ? coverLetters.slice(0, 4).map(cl => (
                  <article key={cl._id} className='group cursor-pointer flex justify-between items-start gap-2' onClick={() => navigate(`/app/cover-letter/new?id=${cl._id}`)}>
                    <div>
                        <h3 className='text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1'>{cl.title}</h3>
                        <p className='text-[11px] text-slate-500 mt-0.5'>
                        {[cl.jobTitle, cl.company].filter(Boolean).join(' at ') || 'General Template'}
                        </p>
                    </div>
                    <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
                        <button onClick={(e) => { e.stopPropagation(); duplicateCoverLetter(cl._id) }} className='p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100'><Copy className='size-3.5' /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteCoverLetter(cl._id) }} className='p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50'><Trash2 className='size-3.5' /></button>
                    </div>
                  </article>
                )) : <p className='text-xs text-slate-400'>No letters generated yet.</p>}
              </div>
            </section>
          </aside>
        </div>

        {/* --- Modals (Kept clean and minimalistic) --- */}
        {showCreateResume && (
          <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200'>
            <div onClick={e => e.stopPropagation()} className='relative bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200'>
              <div className='mb-6'>
                <div className='size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4'>
                  <PlusIcon className='size-6' />
                </div>
                <h2 className='text-xl font-bold text-slate-900'>Create Resume</h2>
                <p className='text-sm text-slate-500 mt-1'>Start with a fresh professional document.</p>
              </div>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='e.g. Senior Software Engineer' className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all mb-4' required autoFocus />
              <button className='w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all'>Initialize Workspace</button>
              <button type="button" onClick={() => setShowCreateResume(false)} className='absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors'><XIcon className='size-4' /></button>
            </div>
          </form>
        )}

        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200'>
            <div onClick={e => e.stopPropagation()} className='relative bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200'>
              <div className='mb-6'>
                <div className='size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4'>
                  <UploadCloudIcon className='size-6' />
                </div>
                <h2 className='text-xl font-bold text-slate-900'>Import PDF</h2>
                <p className='text-sm text-slate-500 mt-1'>We'll use AI to extract data from your resume.</p>
              </div>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Document title' className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-4' required />
              <label htmlFor='resume-input' className='block'>
                <div className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 mb-6 transition-all cursor-pointer ${resume ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
                  {resume ? <div className='text-center'><FileText className='size-10 mx-auto mb-2' /><p className='text-xs font-bold truncate max-w-[200px]'>{resume.name}</p></div> : <><UploadCloud className='size-10' /><p className='text-xs font-bold'>Click to browse PDF</p></>}
                </div>
              </label>
              <input type='file' id='resume-input' accept='.pdf' onChange={(e) => setResume(e.target.files[0])} hidden />
              <button disabled={!resume || isLoading} className='w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex justify-center items-center gap-2'>
                {isLoading ? <><WandSparkles className='size-4 animate-pulse'/> Processing with AI...</> : 'Begin Import'}
              </button>
              <button type="button" onClick={() => setShowUploadResume(false)} className='absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors'><XIcon className='size-4' /></button>
            </div>
          </form>
        )}

        {editResumeId && (
          <form onSubmit={editTitle} onClick={() => setEditResumeId('')} className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200'>
            <div onClick={e => e.stopPropagation()} className='relative bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200'>
              <div className='mb-6'>
                <h2 className='text-xl font-bold text-slate-900'>Rename Document</h2>
              </div>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all mb-4' required autoFocus />
              <button className='w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all'>Save Changes</button>
              <button type="button" onClick={() => setEditResumeId('')} className='absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors'><XIcon className='size-4' /></button>
            </div>
          </form>
        )}

        {showEmailTool && (
          <div onClick={() => setShowEmailTool(false)} className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200'>
            <div onClick={e => e.stopPropagation()} className='relative bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200'>
              <div className='p-6 border-b border-slate-100 flex items-center justify-between bg-white'>
                <div className='flex items-center gap-3'>
                  <div className='size-10 rounded-xl bg-emerald-50 flex items-center justify-center'>
                    <Mail className='size-5 text-emerald-600' />
                  </div>
                  <div>
                    <h2 className='font-bold text-slate-900'>Email Refiner</h2>
                    <p className='text-xs text-slate-500'>AI-Powered Communication</p>
                  </div>
                </div>
                <button onClick={() => setShowEmailTool(false)} className='p-2 hover:bg-slate-100 rounded-full transition-colors'><XIcon className='size-5 text-slate-500' /></button>
              </div>

              <div className='grid md:grid-cols-[240px_1fr] h-[550px]'>
                <div className='bg-slate-50/50 p-6 border-r border-slate-100 overflow-y-auto'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4'>Preset Drafts</p>
                  <div className='space-y-2'>
                    {emailTemplates.map((tmp, i) => (
                      <button key={i} onClick={() => setEmailContent(tmp.content)} className={`w-full text-left p-3.5 rounded-xl text-xs font-bold transition-all ${emailContent === tmp.content ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'}`}>
                        {tmp.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='flex flex-col h-full bg-white relative'>
                  <div className='flex-1 p-8'>
                    <textarea value={emailContent} onChange={(e) => setEmailContent(e.target.value)} placeholder='Compose your message here...' className='w-full h-full resize-none border-0 focus:ring-0 text-[14px] text-slate-700 font-medium leading-relaxed' />
                  </div>

                  <div className='p-6 bg-white border-t border-slate-100'>
                    <div className='flex gap-3 mb-4'>
                      <div className='relative flex-1'>
                        <WandSparkles className='absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500' />
                        <input value={refinePrompt} onChange={(e) => setRefinePrompt(e.target.value)} type='text' placeholder='Instruction (e.g. "make it sound more humble and excited")' className='w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400' />
                      </div>
                      <button onClick={refineEmail} disabled={isRefining || !emailContent} className='px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20'>
                        {isRefining ? 'Processing...' : 'Refine'}
                      </button>
                    </div>
                    <div className='flex items-center justify-between'>
                      <p className='text-[11px] font-medium text-slate-400 flex items-center gap-1.5'><Activity className='size-3'/> AI maintains context while enhancing tone.</p>
                      <button onClick={() => { navigator.clipboard.writeText(emailContent); toast.success('Copied to clipboard!') }} className='shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors'>
                        <Copy className='size-3.5' /> Copy Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard