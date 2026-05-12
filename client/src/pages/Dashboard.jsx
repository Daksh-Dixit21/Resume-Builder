import React, { useEffect, useState } from 'react'
import { Activity, BarChart3, BriefcaseBusiness, Copy, Eye, FilePenLineIcon, FileText, Globe, LayoutTemplate, PencilIcon, PlusIcon, ScanSearch, Target, Trash2, TrashIcon, UploadCloud, UploadCloudIcon, WandSparkles, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const colors = ['#2563eb', '#10b981', '#f97316', '#7c3aed', '#0f766e', '#dc2626']

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
      title: 'Onboarding Email',
      content: `Subject: Welcome to the Team! 🚀\n\nHi [Candidate Name],\n\nWelcome aboard! We are thrilled to have you join us as our new [Job Title]. Your journey with [Company Name] starts on [Start Date], and we couldn't be more excited.\n\nTo get you started, here are a few things to keep in mind:\n1. Your first day schedule...\n2. Required documents...\n3. Office/Remote access details...\n\nWe'll be here to support you every step of the way. See you soon!\n\nBest regards,\n[Your Name]`
    },
    {
      title: 'Interview Details',
      content: `Subject: Interview Invitation: [Job Title] position at [Company Name]\n\nHi [Candidate Name],\n\nThank you for your interest in the [Job Title] role at [Company Name]. We were impressed with your background and would like to invite you for an interview.\n\nDetails:\n- Date: [Date]\n- Time: [Time]\n- Location/Link: [Link]\n- Interviewers: [Names]\n\nPlease confirm your availability for this slot. We look forward to speaking with you!\n\nBest,\n[Your Name]`
    },
    {
      title: 'Job Offer',
      content: `Subject: Job Offer: [Job Title] at [Company Name]\n\nDear [Candidate Name],\n\nWe are delighted to offer you the position of [Job Title] at [Company Name]! We believe your skills and experience will be a great asset to our team.\n\nAttached you will find the formal offer letter with details on:\n- Compensation and benefits\n- Start date and reporting structure\n- Next steps for acceptance\n\nPlease let us know your decision by [Date]. We are excited about the possibility of you joining us!\n\nWarmly,\n[Your Name]`
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
    { label: 'Resumes', value: analytics.resumeCount, icon: FileText, color: '#2563eb' },
    { label: 'Public', value: analytics.publicCount, icon: Globe, color: '#10b981' },
    { label: 'Views', value: analytics.totalViews, icon: Eye, color: '#f97316' },
    { label: 'Week', value: analytics.recentViews, icon: BarChart3, color: '#7c3aed' },
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
    <div className='bg-slate-50 min-h-full'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 py-6'>
        <div className='grid xl:grid-cols-[minmax(0,1fr)_280px] gap-6'>
          <main>
            <div className='bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-5'>
              <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5'>
                <div>
                  <p className='text-sm font-semibold text-emerald-600 mb-2'>Welcome back</p>
                  <h1 className='text-3xl font-bold text-slate-950'>{user?.name || 'Awesome User'}</h1>
                  <p className='text-sm text-slate-500 mt-2'>Create your resume, tailor it for roles, generate letters, and publish a portfolio.</p>
                </div>
                <div className='grid grid-cols-2 sm:flex gap-2'>
                  <button onClick={() => setShowCreateResume(true)} className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors'>
                    <PlusIcon className='size-4' /> Resume
                  </button>
                  <button onClick={() => setShowUploadResume(true)} className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors'>
                    <UploadCloudIcon className='size-4 text-blue-600' /> Upload
                  </button>
                  <button onClick={() => navigate('/app/cover-letter/new')} className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors'>
                    <WandSparkles className='size-4 text-purple-600' /> Letter
                  </button>
                  <button onClick={() => navigate('/app/portfolio')} className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors'>
                    <LayoutTemplate className='size-4' /> Portfolio
                  </button>
                </div>
              </div>
            </div>

            <div className='grid lg:grid-cols-[1fr_320px] gap-5 mb-6'>
              <section className='bg-white border border-slate-200 rounded-2xl p-5'>
                <div className='flex items-center justify-between gap-3 mb-4'>
                  <div>
                    <h2 className='font-semibold text-slate-950'>Resume workspace</h2>
                    <p className='text-xs text-slate-400 mt-1'>{allResumes.length} resumes ready</p>
                  </div>
                  <button onClick={() => setShowCreateResume(true)} className='text-sm text-emerald-600 hover:text-emerald-700 font-medium'>New</button>
                </div>

                <div className='grid sm:grid-cols-2 gap-4'>
                  {allResumes.map((resume, index) => {
                    const baseColor = colors[index % colors.length]
                    return (
                      <article key={resume._id} className='relative bg-white rounded-2xl border border-slate-200 group hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden'>
                        <div className='h-24 p-4' style={{ background: `linear-gradient(135deg, ${baseColor}18, ${baseColor}05)` }}>
                          <div className='ml-auto h-full w-28 rounded-lg bg-white/80 border border-white shadow-sm p-2'>
                            <div className='h-2 rounded-full mb-2' style={{ backgroundColor: baseColor }}></div>
                            <div className='space-y-1.5'>
                              <div className='h-1.5 rounded bg-slate-200 w-full'></div>
                              <div className='h-1.5 rounded bg-slate-100 w-4/5'></div>
                              <div className='h-1.5 rounded bg-slate-100 w-3/5'></div>
                            </div>
                            <div className='grid grid-cols-2 gap-1 mt-2'>
                              <span className='h-5 rounded bg-slate-100'></span>
                              <span className='h-5 rounded bg-slate-100'></span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => navigate(`/app/builder/${resume._id}`)} className='absolute inset-0 z-0 text-left' aria-label={`Open ${resume.title}`}></button>
                        <div className='relative pointer-events-none p-5 pb-3'>
                          <div className='flex items-start justify-between gap-3'>
                            <span className='size-12 rounded-xl flex items-center justify-center' style={{ backgroundColor: `${baseColor}16`, color: baseColor }}>
                              <FilePenLineIcon className='size-6' />
                            </span>
                            {resume.public && <span className='inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700'><Globe className='size-3' /> Public</span>}
                          </div>
                          <h3 className='text-base font-semibold text-slate-950 mt-5 line-clamp-2'>{resume.title}</h3>
                          <p className='text-xs text-slate-400 mt-2'>Updated {new Date(resume.updatedAt).toLocaleDateString()} · {resume.views || 0} views</p>
                          <div className='flex flex-wrap gap-1.5 mt-3'>
                            {(resume.skills?.length > 0) && <span className='text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-500'>{resume.skills.length} skills</span>}
                            {(resume.project?.length > 0) && <span className='text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-500'>{resume.project.length} projects</span>}
                            {(resume.certifications?.length > 0) && <span className='text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-500'>{resume.certifications.length} certs</span>}
                            {(resume.languages?.length > 0) && <span className='text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-500'>{resume.languages.length} languages</span>}
                          </div>
                        </div>

                        <div className='relative z-10 grid grid-cols-2 gap-2 p-3 bg-slate-50 border-t border-slate-100'>
                          <button onClick={() => navigate(`/app/builder/${resume._id}?tool=match`)} className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-100 bg-white px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50'>
                            <Target className='size-3.5' /> Match
                          </button>
                          <button onClick={() => navigate(`/app/builder/${resume._id}?tool=ats`)} className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-orange-100 bg-white px-3 py-2 text-xs font-medium text-orange-700 hover:bg-orange-50'>
                            <ScanSearch className='size-3.5' /> ATS
                          </button>
                          <button onClick={() => navigate(`/app/cover-letter/new?resumeId=${resume._id}`)} className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-100 bg-white px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50'>
                            <BriefcaseBusiness className='size-3.5' /> Letter
                          </button>
                          <button onClick={() => duplicateResume(resume._id)} className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100'>
                            <Copy className='size-3.5' /> Copy
                          </button>
                        </div>

                        <div className='absolute top-3 left-3 z-10 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity'>
                          <button onClick={() => { setEditResumeId(resume._id); setTitle(resume.title) }} className='p-2 rounded-lg bg-white/90 text-slate-500 hover:bg-white hover:text-slate-800 shadow-sm'><PencilIcon className='size-4' /></button>
                          <button onClick={() => deleteResume(resume._id)} className='p-2 rounded-lg bg-white/90 text-slate-500 hover:bg-white hover:text-red-500 shadow-sm'><TrashIcon className='size-4' /></button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>

              <div className='flex flex-col gap-5'>
                <section className='bg-white border border-slate-200 rounded-2xl p-5'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='font-semibold text-slate-950'>Quick Email Tool</h2>
                    <button onClick={() => setShowEmailTool(true)} className='text-sm text-blue-600 hover:text-blue-700 font-medium'>Open Tool</button>
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    {emailTemplates.slice(0, 2).map((tmp, i) => (
                      <button key={i} onClick={() => { setEmailContent(tmp.content); setShowEmailTool(true) }} className='text-left p-3 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all'>
                        <p className='text-xs font-semibold text-slate-900'>{tmp.title}</p>
                        <p className='text-[10px] text-slate-500 line-clamp-1 mt-1'>{tmp.content.split('\n')[2]}</p>
                      </button>
                    ))}
                  </div>
                </section>

                <section className='bg-white border border-slate-200 rounded-2xl p-5'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='font-semibold text-slate-950'>Cover letters</h2>
                    <button onClick={() => navigate('/app/cover-letter/new')} className='text-sm text-emerald-600 hover:text-emerald-700 font-medium'>Generate</button>
                  </div>
                  <div className='space-y-3'>
                    {coverLetters.slice(0, 4).map((cl) => (
                      <article key={cl._id} className='group rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all'>
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <h3 className='text-sm font-semibold text-slate-900 line-clamp-1'>{cl.title}</h3>
                            {(cl.jobTitle || cl.company) && <p className='text-xs text-emerald-600 mt-1'>{[cl.jobTitle, cl.company].filter(Boolean).join(' at ')}</p>}
                          </div>
                          <div className='flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity'>
                            <button onClick={() => duplicateCoverLetter(cl._id)} className='p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100'><Copy className='size-3.5' /></button>
                            <button onClick={() => deleteCoverLetter(cl._id)} className='p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50'><Trash2 className='size-3.5' /></button>
                          </div>
                        </div>
                        <p className='text-xs text-slate-500 line-clamp-2 mt-2'>{cl.content}</p>
                      </article>
                    ))}
                    {coverLetters.length === 0 && <p className='text-sm text-slate-400'>No cover letters yet.</p>}
                  </div>
                </section>
              </div>
            </div>
          </main>

          <aside className='xl:sticky xl:top-6 h-fit'>
            <div className='bg-white border border-slate-200 rounded-2xl p-4'>
              <div className='flex items-center gap-2 mb-4'>
                <Activity className='size-4 text-emerald-600' />
                <h2 className='font-semibold text-slate-950'>Metrics</h2>
              </div>
              <div className='space-y-2'>
                {statCards.map(card => (
                  <div key={card.label} className='group rounded-xl border border-slate-100 p-3 hover:border-slate-200 hover:shadow-sm transition-all'>
                    <div className='flex items-center gap-3'>
                      <span className='size-10 rounded-lg flex items-center justify-center shrink-0' style={{ color: card.color, backgroundColor: `${card.color}16` }}>
                        <card.icon className='size-4' />
                      </span>
                      <div className='min-w-0'>
                        <p className='text-xs text-slate-400'>{card.label}</p>
                        <p className='text-xl font-bold text-slate-950'>{card.value}</p>
                      </div>
                    </div>
                    {card.label === 'Week' && analytics?.dailyViews && (
                      <div className='h-8 flex items-end gap-1 mt-3 opacity-60 group-hover:opacity-100 transition-opacity'>
                        {analytics.dailyViews.map((d, i) => {
                          const max = Math.max(...analytics.dailyViews.map(v => v.views), 1)
                          return <span key={i} className='flex-1 rounded-t' style={{ height: `${Math.max((d.views / max) * 100, 10)}%`, backgroundColor: card.color }} title={`${d.views} views`} />
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {showCreateResume && (
          <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center p-4'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create Resume</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={() => { setShowCreateResume(false); setTitle('') }} />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center p-4'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
              <label htmlFor='resume-input' className='block text-sm text-slate-700'>
                Select resume file
                <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'>
                  {resume ? <p className='text-green-700'>{resume.name}</p> : <><UploadCloud className='size-14 stroke-1' /><p>Upload resume</p></>}
                </div>
              </label>
              <input type='file' id='resume-input' accept='.pdf' onChange={(e) => setResume(e.target.files[0])} hidden />
              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>{isLoading ? 'Uploading...' : 'Create Resume'}</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={() => { setShowUploadResume(false); setTitle('') }} />
            </div>
          </form>
        )}

        {editResumeId && (
          <form onSubmit={editTitle} onClick={() => setEditResumeId('')} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center p-4'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />
              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Update</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={() => { setEditResumeId(''); setTitle('') }} />
            </div>
          </form>
        )}

        {showEmailTool && (
          <div onClick={() => setShowEmailTool(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-[100] flex items-center justify-center p-4'>
            <div onClick={e => e.stopPropagation()} className='relative bg-white border shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden'>
              <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
                <h2 className='text-xl font-bold text-slate-900'>Email Generator & Refiner</h2>
                <button onClick={() => setShowEmailTool(false)} className='p-2 hover:bg-slate-100 rounded-full transition-colors'><XIcon className='size-5 text-slate-500' /></button>
              </div>

              <div className='grid md:grid-cols-[200px_1fr] h-[500px]'>
                <div className='bg-slate-50 p-4 border-r border-slate-100 overflow-y-auto'>
                  <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3'>Templates</p>
                  <div className='space-y-2'>
                    {emailTemplates.map((tmp, i) => (
                      <button key={i} onClick={() => setEmailContent(tmp.content)} className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all ${emailContent === tmp.content ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                        {tmp.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='flex flex-col h-full bg-white'>
                  <div className='flex-1 p-4'>
                    <textarea value={emailContent} onChange={(e) => setEmailContent(e.target.value)} placeholder='Select a template or start typing your email...' className='w-full h-full resize-none border-0 focus:ring-0 text-sm text-slate-700 leading-relaxed' />
                  </div>

                  <div className='p-4 bg-slate-50 border-t border-slate-100'>
                    <div className='flex gap-2 mb-3'>
                      <input value={refinePrompt} onChange={(e) => setRefinePrompt(e.target.value)} type='text' placeholder='Refine with AI (e.g. "make it more formal" or "add a reminder about ID card")' className='flex-1 text-xs border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500' />
                      <button onClick={refineEmail} disabled={isRefining || !emailContent} className='px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2'>
                        {isRefining ? 'Refining...' : <><WandSparkles className='size-3.5' /> Refine</>}
                      </button>
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                      <p className='text-[10px] text-slate-400'>Edit directly above or use AI to refine your message.</p>
                      <button onClick={() => { navigator.clipboard.writeText(emailContent); toast.success('Copied to clipboard!') }} className='shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50'>
                        <Copy className='size-3.5' /> Copy Content
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
