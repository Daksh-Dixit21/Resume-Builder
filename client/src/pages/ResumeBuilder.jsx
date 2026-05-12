import React, { useEffect, useState, useCallback } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Activity, AlertCircle, ArrowLeftIcon, Award, Briefcase, CheckCircle2, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Info, Languages, Loader2, Share2Icon, Sparkles, User, X, Undo2, Redo2, Target, Check } from 'lucide-react'
import Confetti from 'react-confetti'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import FontPicker from '../components/FontPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import CertificationForm from '../components/CertificationForm'
import LanguageForm from '../components/LanguageForm'
import api from '../configs/api'
import useUndoRedo from '../hooks/useUndoRedo'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {
  const {resumeId} = useParams()
  const location = useLocation()
  
  const initialState = {
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    certifications: [],
    languages: [],
    template: "classic",
    accent_color: "#3B82F6",
    font_family: "Outfit",
    public: false,
  };

  const { state: resumeData, set: setResumeData, undo, redo, canUndo, canRedo, reset, pushToHistory } = useUndoRedo(initialState);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isEditMode, setIsEditMode] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [atsAnalysis, setAtsAnalysis] = useState(null)
  const [showAtsModal, setShowAtsModal] = useState(false)

  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchJobDescription, setMatchJobDescription] = useState('')
  const [isMatching, setIsMatching] = useState(false)
  const [matchAnalysis, setMatchAnalysis] = useState(null)

  const sections = [
    {id: "personal", name: "Personal Info", icon: User},
    {id: "summary", name: "Summary", icon: FileText},
    {id: "experience", name: "Experience", icon: Briefcase},
    {id: "education", name: "Education", icon: GraduationCap},
    {id: "project", name: "Project", icon: FolderIcon},
    {id: "skills", name: "Skills", icon: Sparkles},
    {id: "certifications", name: "Certifications", icon: Award},
    {id: "languages", name: "Languages", icon: Languages},
  ]

  const activeSection = sections[activeSectionIndex]

  const loadExistingResume = async () => {
    try {
      const response = await api.get(`/api/resumes/get/${resumeId}`);
      const resume = response.data.resume;
      if (resume) {
        reset(resume);
        document.title = resume.title;
      }
    } catch (error) {
      console.error("Failed to load resume", error);
    }
  }

  useEffect(() => {
    loadExistingResume()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tool = params.get('tool')
    if (tool === 'match') {
      setShowMatchModal(true)
      setMatchAnalysis(null)
    }
    if (tool === 'ats' && resumeData._id) {
      scanAts()
    }
  }, [location.search, resumeData._id])

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          if (canRedo) redo();
        } else {
          e.preventDefault();
          if (canUndo) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const scanAts = async () => {
    setIsAnalyzing(true);
    try {
      const response = await api.post('/api/ai/analyze-resume', { resumeData });
      setAtsAnalysis(response.data.data);
      setShowAtsModal(true);
    } catch (error) {
      console.error("Failed to analyze resume", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const matchJob = async () => {
    if (!matchJobDescription.trim()) return toast.error("Please enter a job description");
    
    setIsMatching(true);
    try {
      const response = await api.post('/api/ai/match-job', { 
        resumeData, 
        jobDescription: matchJobDescription 
      });
      setMatchAnalysis(response.data.data);
    } catch (error) {
      console.error("Failed to match job", error);
      toast.error("Failed to analyze match. Please try again.");
    } finally {
      setIsMatching(false);
    }
  }

  const changeResumeVisibility = async()=>{
    const newPublic = !resumeData.public
    // Immediate state update (not debounced)
    pushToHistory();
    setResumeData(prev => ({...prev, public: newPublic}))

    try{
      const formData = new FormData();
      formData.append('resumeId', resumeId);

      const dataToSend = { ...resumeData, public: newPublic };
      if (dataToSend.personal_info && dataToSend.personal_info.image && typeof dataToSend.personal_info.image !== 'string') {
        formData.append('image', dataToSend.personal_info.image);
        delete dataToSend.personal_info.image;
      }

      formData.append('resumeData', JSON.stringify(dataToSend));
      formData.append('removeBackground', removeBackground);

      await api.put('/api/resumes/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error('Failed to update resume visibility', error);
      toast.error('Could not update visibility. Please save changes manually.');
      setResumeData(prev => ({...prev, public: !newPublic}))
    }
  }

  const handleShare = () =>{
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;
    if (navigator.share){
      navigator.share({url: resumeUrl, text: "My Resume",})
    } else {
      navigator.clipboard.writeText(resumeUrl);
      toast.success("Link copied to clipboard!");
    }
  }

  const downloadResume = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) {
        toast.error("Resume preview not found");
        return;
      }

      const clone = resumeElement.cloneNode(true);
      const images = clone.querySelectorAll('img');
      const imagePromises = Array.from(images).map(async (img) => {
        const src = img.src;
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    img.src = reader.result;
                    resolve();
                };
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.warn("Could not convert image to base64:", src, e);
        }
      });

      await Promise.all(imagePromises);

      let styles = '';
      try {
        styles = Array.from(document.styleSheets)
          .map((styleSheet) => {
            try {
              return Array.from(styleSheet.cssRules)
                .map((rule) => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .join('\n');
      } catch (e) {
        styles = Array.from(document.querySelectorAll('style'))
          .map(style => style.innerHTML)
          .join('\n');
      }

      const response = await api.post('/api/resumes/download-pdf', {
        html: clone.outerHTML,
        css: styles
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.title || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  const saveChanges = async () => {    
    const formData = new FormData();
    formData.append("resumeId", resumeId);

    if (resumeData.personal_info.image && typeof resumeData.personal_info.image !== 'string') {
        formData.append("image", resumeData.personal_info.image);
    }

    const dataToSend = { ...resumeData };
    if (dataToSend.personal_info.image && typeof dataToSend.personal_info.image !== 'string') {
        delete dataToSend.personal_info.image;
    }

    formData.append("resumeData", JSON.stringify(dataToSend));
    formData.append("removeBackground", removeBackground);

    try {
        await api.put('/api/resumes/update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Changes saved successfully!");
    } catch (error) {
        console.error("Failed to save changes", error);
        toast.error("Error saving changes.");
    }
  }

  return (
    <div>
      {showConfetti && <Confetti recycle={false} numberOfPieces={100} gravity={0.5} />}

      <div className='max-w-7xl mx-auto px-4 py-6 flex items-center justify-between'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='size-4'/> Back to Dashboard
        </Link>
        <div className='flex items-center gap-2'>
          <button 
            onClick={undo} 
            disabled={!canUndo} 
            className={`p-2 rounded-lg transition-colors ${canUndo ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300'}`}
            title='Undo (Ctrl+Z)'
          >
            <Undo2 size={18} />
          </button>
          <button 
            onClick={redo} 
            disabled={!canRedo} 
            className={`p-2 rounded-lg transition-colors ${canRedo ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300'}`}
            title='Redo (Ctrl+Y)'
          >
            <Redo2 size={18} />
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className={`grid ${isEditMode ? 'lg:grid-cols-12' : 'grid-cols-1'} gap-8`}>
          {/* Left Panel - Form */}
          {isEditMode && (
            <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
                  <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200'/>
                  <hr className='absolute top-0 left-0 h-1 bg-linear-to-r from-green-500 to-green-600 border-none transition-all duration-300' style={{width: `${activeSectionIndex * 100 / (sections.length -1)}%`}}/>

                {/* Section Navigation */}
                <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                  <div className='flex items-center gap-2'>
                    <TemplateSelector  selectedTemplate={resumeData.template} onChange={(template)=> {pushToHistory(); setResumeData(prev => ({...prev, template}))}}/>
                    <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=> {pushToHistory(); setResumeData(prev => ({...prev, accent_color: color}))}}/>
                    <FontPicker selectedFont={resumeData.font_family} onChange={(font_family)=> {pushToHistory(); setResumeData(prev => ({...prev, font_family}))}}/>
                  </div>
                  <div className='flex items-center'>
                    {activeSectionIndex !==0 && (
                      <button onClick={()=> setActiveSectionIndex((prevIndex)=>Math.max(prevIndex -1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0} >
                        <ChevronLeft className='size-4'/> Previous
                      </button>
                    )}
                      <button onClick={()=> setActiveSectionIndex((prevIndex)=>Math.min(prevIndex +1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1} >
                        Next <ChevronRight className='size-4'/>
                      </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className='space-y-6'>
                  {activeSection.id === 'personal' && (
                    <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev => ({...prev, personal_info: data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}/>
                  )}
                  {activeSection.id === 'summary' && (
                    <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=> setResumeData(prev=>({...prev, professional_summary: data}))} setResumeData={setResumeData}/>
                  )}
                  {activeSection.id === 'experience' && (
                    <ExperienceForm data={resumeData.experience} onChange={(data)=> setResumeData(prev=>({...prev, experience: data}))}/>
                  )}
                  {activeSection.id === 'education' && (
                    <EducationForm data={resumeData.education} onChange={(data)=> setResumeData(prev=>({...prev, education: data}))}/>
                  )}
                  {activeSection.id === 'project' && (
                    <ProjectForm data={resumeData.project} onChange={(data)=> setResumeData(prev=>({...prev, project: data}))}/>
                  )}
                  {activeSection.id === 'skills' && (
                    <SkillsForm data={resumeData.skills} onChange={(data)=> setResumeData(prev => ({...prev, skills: data}))}/>
                  )}
                  {activeSection.id === 'certifications' && (
                    <CertificationForm data={resumeData.certifications} onChange={(data)=> setResumeData(prev => ({...prev, certifications: data}))}/>
                  )}
                  {activeSection.id === 'languages' && (
                    <LanguageForm data={resumeData.languages} onChange={(data)=> setResumeData(prev => ({...prev, languages: data}))}/>
                  )}
                </div>
                <div className='flex gap-3 mt-6'>
                  <button onClick={saveChanges} className='bg-linear-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 text-sm'>
                    Save Changes
                  </button>
                  {activeSection.id === 'languages' && (
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setShowConfetti(true);
                      }}
                      className='bg-linear-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 text-sm'
                    >
                      Done
                    </button>
                  )}
                </div>
                </div>
            </div>
          )}

          {/* Right Panel - Preview */}
          <div className={`${isEditMode ? 'lg:col-span-7' : 'col-span-1 max-w-4xl mx-auto'} max-lg:mt-6`}>
                <div className='relative w-full mb-4'>
                <div className='flex flex-wrap items-center justify-end gap-2'>
                  {!isEditMode && (
                    <button 
                      onClick={() => setIsEditMode(true)} 
                      className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'
                    >
                      Edit
                    </button>
                  )}
                  {resumeData.public && (
                    <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                      <Share2Icon className='size-4'/> Share
                    </button>
                  )}
                  <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                    {resumeData.public ? <EyeIcon className='size-4'/> : <EyeOffIcon className='size-4'/>}
                    {resumeData.public ? "Public" : "Private"}
                  </button>
                  
                  {/* Job Matcher Button */}
                  <button 
                    onClick={() => { setShowMatchModal(true); setMatchAnalysis(null); }}
                    className={`flex items-center gap-2 px-4 py-2 text-xs bg-linear-to-br from-indigo-100 to-indigo-200 text-indigo-600 rounded-lg ring-indigo-300 hover:ring transition-colors`}
                  >
                    <Target className='size-4'/>
                    Match Job
                  </button>

                  <button 
                    onClick={scanAts} 
                    disabled={isAnalyzing}
                    className={`flex items-center gap-2 px-4 py-2 text-xs bg-linear-to-br from-orange-100 to-orange-200 text-orange-600 rounded-lg ring-orange-300 hover:ring transition-colors ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isAnalyzing ? <Loader2 className='size-4 animate-spin'/> : <Activity className='size-4'/>}
                    Scan ATS
                  </button>
                  <button 
                    onClick={downloadResume} 
                    disabled={isDownloading}
                    className={`flex items-center gap-2 px-6 py-2 text-xs bg-linear-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isDownloading ? <Loader2 className='size-4 animate-spin'/> : <DownloadIcon className='size-4'/>}
                  </button>
                </div>
                </div>
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes={!isEditMode ? 'max-w-4xl mx-auto' : ''} showPageWarning={isEditMode} fontFamily={resumeData.font_family}/>
          </div>
        </div>
      </div>

      {/* ATS Analysis Modal */}
      {showAtsModal && atsAnalysis && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col'>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-orange-50 to-white'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-orange-100 rounded-lg text-orange-600'>
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-gray-900'>ATS Analysis Report</h2>
                  <p className='text-sm text-gray-500'>Powered by AI Analysis</p>
                </div>
              </div>
              <button onClick={() => setShowAtsModal(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                <X size={20} />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-8 space-y-8'>
              <div className='flex flex-col items-center justify-center text-center'>
                <div className='relative flex items-center justify-center mb-4'>
                  <svg className='w-32 h-32 transform -rotate-90'>
                    <circle cx='64' cy='64' r='58' stroke='currentColor' strokeWidth='8' fill='transparent' className='text-gray-100' />
                    <circle cx='64' cy='64' r='58' stroke='currentColor' strokeWidth='8' fill='transparent' strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * atsAnalysis.score) / 100} className={`${atsAnalysis.score >= 70 ? 'text-green-500' : atsAnalysis.score >= 50 ? 'text-orange-500' : 'text-red-500'} transition-all duration-1000 ease-out`} />
                  </svg>
                  <span className='absolute text-3xl font-black text-gray-900'>{atsAnalysis.score}%</span>
                </div>
                <h3 className='text-lg font-bold text-gray-800'>Overall ATS Score</h3>
                <p className='text-gray-600 mt-2 max-w-md'>{atsAnalysis.summary}</p>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='flex items-center gap-2 font-bold text-gray-900 text-sm uppercase tracking-wider'>
                    <Sparkles size={16} className='text-purple-500' /> Recommended Fixes
                  </h4>
                  <ul className='space-y-2'>
                    {atsAnalysis.improvements.map((tip, i) => (
                      <li key={i} className='flex items-start gap-2 text-sm text-gray-600'>
                        <CheckCircle2 size={14} className='text-green-500 mt-0.5 shrink-0' />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='space-y-4'>
                  <h4 className='flex items-center gap-2 font-bold text-gray-900 text-sm uppercase tracking-wider'>
                    <Info size={16} className='text-blue-500' /> Essential Keywords
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {atsAnalysis.keyword_suggestions.map((word, i) => (
                      <span key={i} className='px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100 uppercase'>
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {atsAnalysis.missing_info && atsAnalysis.missing_info.length > 0 && (
                <div className='p-4 bg-red-50 rounded-xl border border-red-100'>
                  <h4 className='flex items-center gap-2 font-bold text-red-900 text-sm uppercase tracking-wider mb-3'>
                    <AlertCircle size={16} /> Attention Required
                  </h4>
                  <ul className='space-y-2'>
                    {atsAnalysis.missing_info.map((info, i) => (
                      <li key={i} className='flex items-center gap-2 text-sm text-red-700 font-medium'>
                        <div className='w-1 h-1 bg-red-400 rounded-full' />
                        {info}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className='p-6 border-t border-gray-100 bg-gray-50 flex justify-end'>
              <button onClick={() => setShowAtsModal(false)} className='px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all'>
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Matcher Modal */}
      {showMatchModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col'>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-indigo-50 to-white'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-indigo-100 rounded-lg text-indigo-600'>
                  <Target size={24} />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-gray-900'>Job Matcher</h2>
                  <p className='text-sm text-gray-500'>Compare resume to job description</p>
                </div>
              </div>
              <button onClick={() => setShowMatchModal(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                <X size={20} />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-6'>
              {!matchAnalysis ? (
                <div className='space-y-4'>
                  <label className='block text-sm font-semibold text-slate-700'>
                    Paste Job Description
                  </label>
                  <textarea
                    value={matchJobDescription}
                    onChange={(e) => setMatchJobDescription(e.target.value)}
                    placeholder='Paste the target job description here...'
                    rows={12}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none'
                  />
                  <div className='flex justify-end'>
                    <button 
                      onClick={matchJob}
                      disabled={isMatching}
                      className={`flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors ${isMatching ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isMatching ? <Loader2 className='size-4 animate-spin'/> : <Sparkles className='size-4'/>}
                      {isMatching ? 'Analyzing Match...' : 'Analyze Match'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className='space-y-8'>
                  <div className='flex flex-col items-center justify-center text-center'>
                    <div className='relative flex items-center justify-center mb-4'>
                      <svg className='w-32 h-32 transform -rotate-90'>
                        <circle cx='64' cy='64' r='58' stroke='currentColor' strokeWidth='8' fill='transparent' className='text-gray-100' />
                        <circle cx='64' cy='64' r='58' stroke='currentColor' strokeWidth='8' fill='transparent' strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * matchAnalysis.matchScore) / 100} className={`${matchAnalysis.matchScore >= 75 ? 'text-green-500' : matchAnalysis.matchScore >= 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`} />
                      </svg>
                      <span className='absolute text-3xl font-black text-gray-900'>{matchAnalysis.matchScore}%</span>
                    </div>
                    <h3 className='text-lg font-bold text-gray-800'>Match Score</h3>
                    <p className='text-gray-600 mt-2 max-w-lg'>{matchAnalysis.gapAnalysis}</p>
                  </div>

                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='space-y-3'>
                      <h4 className='flex items-center gap-2 font-bold text-gray-900 text-sm uppercase tracking-wider'>
                        <Check size={16} className='text-green-500' /> Matched Keywords
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {matchAnalysis.matchedKeywords.length > 0 ? matchAnalysis.matchedKeywords.map((kw, i) => (
                          <span key={i} className='px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-100'>
                            {kw}
                          </span>
                        )) : <p className='text-sm text-slate-500'>No significant matches found.</p>}
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <h4 className='flex items-center gap-2 font-bold text-gray-900 text-sm uppercase tracking-wider'>
                        <AlertCircle size={16} className='text-red-500' /> Missing Keywords
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {matchAnalysis.missingKeywords.length > 0 ? matchAnalysis.missingKeywords.map((kw, i) => (
                          <span key={i} className='px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-100'>
                            {kw}
                          </span>
                        )) : <p className='text-sm text-slate-500'>You hit all the key requirements!</p>}
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4 pt-4 border-t border-slate-100'>
                    <h4 className='flex items-center gap-2 font-bold text-gray-900 text-sm uppercase tracking-wider'>
                      <Sparkles size={16} className='text-indigo-500' /> Actionable Suggestions
                    </h4>
                    <ul className='space-y-3'>
                      {matchAnalysis.suggestions.map((suggestion, i) => (
                        <li key={i} className='flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700'>
                          <div className='mt-0.5 size-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xs'>
                            {i+1}
                          </div>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className='p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3'>
              {matchAnalysis && (
                <button onClick={() => setMatchAnalysis(null)} className='px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-all'>
                  New Analysis
                </button>
              )}
              <button onClick={() => setShowMatchModal(false)} className='px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all'>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ResumeBuilder
