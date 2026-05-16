import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ProfessionalTemplate from './templates/ProfessionalTemplate'
import ATSTemplate from './templates/ATSTemplate'
import PageBreakIndicator from './PageBreakIndicator'

const ResumePreview = ({data, template, accentColor, classes = "", showPageWarning = false, fontFamily = "Outfit"}) => {
 

    const renderTemplate = () => {
        switch(template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor}/>
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor}/>
            case "minimal image":
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>
            case "professional":
                return <ProfessionalTemplate data={data} accentColor={accentColor}/>
            case "ats":
                return <ATSTemplate data={data} accentColor={accentColor}/>
            default:
                return <ClassicTemplate data={data} accentColor={accentColor}/>
        }
    }
 return (
    <div className='w-full bg-gray-100'>
        <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none " + classes} style={{ fontFamily: `"${fontFamily}", sans-serif` }}>
            <PageBreakIndicator enabled={showPageWarning}>
                {renderTemplate()}
            </PageBreakIndicator>
        </div>
        <style>{`
            @page {
            size: A4;
            margin: 0;
            }
            @media print {
                html, body {
                width: 8.27in;
                height: 11.69in;
                overflow: hidden;
                margin: 0;
                padding: 0;
                }
            body * {
            visibility: hidden;
            }
#resume-preview, #resume-preview * {
                visibility: visible;
            }

                #resume-preview{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none !important;
                border: none !important;
                }
                /* Force background colors to print */
                #resume-preview * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }

            /* Smart Fit - Dynamic Spacing Adjustment */
            #resume-preview.smart-fit {
                line-height: 1.35 !important;
            }
            #resume-preview.smart-fit section {
                margin-bottom: 0.5rem !important; 
            }
            #resume-preview.smart-fit .experience-item,
            #resume-preview.smart-fit .education-item,
            #resume-preview.smart-fit .project-item {
                margin-bottom: 0.5rem !important;
            }
            #resume-preview.smart-fit header {
                padding-top: 0.75rem !important;
                padding-bottom: 0.75rem !important;
            }
            #resume-preview.smart-fit .p-5, 
            #resume-preview.smart-fit .p-6, 
            #resume-preview.smart-fit .p-8 {
                padding: 1.25rem !important; /* Shorter overall padding */
            }
            #resume-preview.smart-fit h1 {
                font-size: 1.875rem !important; /* 3xl -> approx 2xl */
                margin-bottom: 0.25rem !important;
            }
            #resume-preview.smart-fit h2 {
                font-size: 1.125rem !important; /* text-xl -> text-lg */
                margin-bottom: 0.5rem !important;
                padding-bottom: 0.25rem !important;
            }
            #resume-preview.smart-fit .space-y-6 > *,
            #resume-preview.smart-fit .space-y-4 > *,
            #resume-preview.smart-fit .space-y-3 > * {
                margin-top: 0.5rem !important; /* Tighter spacing in lists */
            }
            
            /* Global Stability Fixes */
            #resume-preview {
                word-break: break-word;
            }
            #resume-preview .flex.flex-wrap {
                row-gap: 4px !important;
            }
            `}
        </style>
    </div>
  )
}

export default ResumePreview
