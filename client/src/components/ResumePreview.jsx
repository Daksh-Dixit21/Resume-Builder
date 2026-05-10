import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ProfessionalTemplate from './templates/ProfessionalTemplate'
import PageBreakIndicator from './PageBreakIndicator'

const ResumePreview = ({data, template, accentColor, classes = ""}) => {
 

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
            default:
                return <ClassicTemplate data={data} accentColor={accentColor}/>
        }
    }
 return (
    <div className='w-full bg-gray-100'>
        <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none " + classes}>
            <PageBreakIndicator>
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
            `}
        </style>
    </div>
  )
}

export default ResumePreview