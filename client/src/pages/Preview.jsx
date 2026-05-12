import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import Loader from '../components/Loader'
import { ArrowLeftIcon, Download, UserRound } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const Preview = () => {
    const { resumeId } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [isDownloading, setIsDownloading] = useState(false)
    const [resumeData, setResumeData] = useState(null)
    const [portfolioUsername, setPortfolioUsername] = useState('')

    const loadResume = async () => {
        try {
            const response = await api.get(`/api/resumes/public/${resumeId}`);
            setResumeData(response.data.resume);
            setPortfolioUsername(response.data.portfolioUsername || '');
        } catch (error) {
            console.error("Failed to load resume", error);
            setResumeData(null);
        } finally {
            setIsLoading(false);
        }
    }

    const downloadResume = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            const resumeElement = document.getElementById('resume-preview');
            if (!resumeElement) return toast.error('Resume preview not found');

            const clone = resumeElement.cloneNode(true);
            let styles = '';
            try {
                styles = Array.from(document.styleSheets)
                    .map((styleSheet) => {
                        try {
                            return Array.from(styleSheet.cssRules).map((rule) => rule.cssText).join('\n');
                        } catch {
                            return '';
                        }
                    })
                    .join('\n');
            } catch {
                styles = Array.from(document.querySelectorAll('style')).map(style => style.innerHTML).join('\n');
            }

            const response = await api.post('/api/resumes/download-pdf', {
                html: clone.outerHTML,
                css: styles,
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${resumeData?.title || 'resume'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download PDF', error);
            toast.error('Failed to download PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    }

    useEffect(() => {
        loadResume()
    }, [resumeId])

    return (
        <div className='bg-slate-100 min-h-screen relative'>
            <Link to='/' className='fixed top-3 right-3 z-20 rounded-full bg-white/95 border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm hover:text-emerald-600 transition-colors'>
                Create your resume
            </Link>

            {isLoading ? (
                <Loader />
            ) : resumeData ? (
                <div className='max-w-4xl mx-auto px-4 py-8'>
                    <div className='flex flex-wrap items-center justify-end gap-2 mb-4'>
                        {portfolioUsername && (
                            <Link to={`/portfolio/${portfolioUsername}`} className='inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors'>
                                <UserRound className='size-4 text-emerald-600' /> Profile
                            </Link>
                        )}
                        <button onClick={downloadResume} disabled={isDownloading} className='inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-lg text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-70 transition-colors'>
                            <Download className='size-4' /> {isDownloading ? 'Downloading...' : 'Download'}
                        </button>
                    </div>
                    <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='bg-white' fontFamily={resumeData.font_family} />
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center h-screen'>
                    <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found.</p>
                    <a href="/" className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'>
                        <ArrowLeftIcon className="mr-2 size-4" />
                        Go To Home Page
                    </a>
                </div>
            )}
        </div>
    )
}

export default Preview;
