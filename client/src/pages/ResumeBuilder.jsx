import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Loader2, Share2Icon, Sparkles, User } from 'lucide-react'
import Confetti from 'react-confetti'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import api from '../configs/api'

const ResumeBuilder = () => {
  const {resumeId} = useParams()
  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  })

  const loadExistingResume = async () => {
    try {
      const response = await api.get(`/api/resumes/get/${resumeId}`);
      const resume = response.data.resume;
      if (resume) {
        setResumeData(resume);
        document.title = resume.title;
      }
    } catch (error) {
      console.error("Failed to load resume", error);
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isEditMode, setIsEditMode] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  const sections = [
    {id: "personal", name: "Personal Info", icon: User},
    {id: "summary", name: "Summary", icon: FileText},
    {id: "experience", name: "Experience", icon: Briefcase},
    {id: "education", name: "Education", icon: GraduationCap},
    {id: "project", name: "Project", icon: FolderIcon},
    {id: "skills", name: "Skills", icon: Sparkles},
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
  }, [])
  
const changeResumeVisibility = async()=>{
  const newPublic = !resumeData.public
  setResumeData(prev => ({...prev, public: newPublic}))

  // Persist the visibility change to the server
  try{
    const formData = new FormData();
    formData.append('resumeId', resumeId);

    // Prepare resume data copy and avoid sending file twice
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
    alert('Could not update visibility. Please save changes manually.');
    // revert UI change on failure
    setResumeData(prev => ({...prev, public: !newPublic}))
  }
}

  const handleShare = () =>{
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;
    if (navigator.share){
      navigator.share({url: resumeUrl, text: "My Resume",})
    } else {
      alert("Share not supported on this browser.")
    }
  }

  const downloadResume = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) {
        alert("Resume preview not found");
        return;
      }

      // Clone the element to modify it without affecting the UI
      const clone = resumeElement.cloneNode(true);

      // Process images to ensure they render in Puppeteer
      const images = clone.querySelectorAll('img');
      const imagePromises = Array.from(images).map(async (img) => {
        const src = img.src;
        // Convert blob URLs and local relative paths to Base64
        // We do this by fetching the resource (which works in the browser context)
        // and converting to a data URL.
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
            // If fetch fails (e.g. CORS on external image), we leave it as is.
            // Puppeteer might still be able to load it if it's a public URL.
        }
      });
      
      await Promise.all(imagePromises);

      // Collect styles from all style tags
      const styles = Array.from(document.querySelectorAll('style'))
        .map(style => style.innerHTML)
        .join('\n');

      const response = await api.post('/api/resumes/download-pdf', {
        html: clone.outerHTML,
        css: styles
      }, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.title || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  const saveChanges = async () => {    const formData = new FormData();
    formData.append("resumeId", resumeId);
    
    // Check if a new image is selected
    if (resumeData.personal_info.image && typeof resumeData.personal_info.image !== 'string') {
        formData.append("image", resumeData.personal_info.image);
    }

    // Create a copy of resumeData and remove the image if it's a file object
    const dataToSend = { ...resumeData };
    if (dataToSend.personal_info.image && typeof dataToSend.personal_info.image !== 'string') {
        // We are sending the image as a file, so we don't need it in the JSON
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
        alert("Changes saved successfully!");
    } catch (error) {
        console.error("Failed to save changes", error);
        alert("Error saving changes.");
    }
}

  return (
    <div>
      {showConfetti && <Confetti recycle={false} numberOfPieces={100} gravity={0.5} />}

      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='size-4'/> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className={`grid ${isEditMode ? 'lg:grid-cols-12' : 'grid-cols-1'} gap-8`}>
          {/* Left Panel - Form */}
          {isEditMode && (
            <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
                  {/* progress bar using activeSectionIndex */}
                  <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200'/>
                  <hr className='absolute top-0 left-0 h-1 bg-linear-to-r from-green-500 to-green-600 border-none transaction-all duration-2000' style={{width: `${activeSectionIndex * 100 / (sections.length -1)}%`}}/>
                
                {/* Section Navigation */}
                <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                  <div className='flex items-center gap-2'>
                    <TemplateSelector  selectedTemplate={resumeData.template} onChange={(template)=> setResumeData(prev => ({...prev, template}))}/>
                    <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev => ({...prev, accent_color: color}))}/>
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
                    <SkillsForm data={resumeData.skills} onChange={(data)=> setResumeData(prev=>({...prev, skills: data}))}/>
                  )}
                </div>
                <div className='flex gap-3 mt-6'>
                  <button onClick={saveChanges} className='bg-linear-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 text-sm'>
                    Save Changes
                  </button>
                  {activeSection.id === 'skills' && (
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
                <div className='relative w-full'>
                <div className='absolute bottom-3 right-3 flex items-center gap-2'>
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
                  <button 
                    onClick={downloadResume} 
                    disabled={isDownloading}
                    className={`flex items-center gap-2 px-6 py-2 text-xs bg-linear-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isDownloading ? <Loader2 className='size-4 animate-spin'/> : <DownloadIcon className='size-4'/>}
                  </button>
                </div>
                </div>
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes={!isEditMode ? 'max-w-4xl mx-auto' : ''}/>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ResumeBuilder