import React from "react";

const ATSTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    const getDisplayUsername = (url) => {
        if (!url) return "";
        return url.replace(/^https?:\/\/(www\.)?(linkedin\.com\/in\/|github\.com\/)/, '')
                  .replace(/^https?:\/\/(www\.)?/, '')
                  .replace(/\/$/, '');
    };

    const getLoginUrl = (url, type) => {
        if (!url) return "";
        let finalUrl = url.trim();
        
        // If it looks like a full URL, ensure protocol
        if (finalUrl.match(/^https?:\/\//)) return finalUrl;
        if (finalUrl.match(/^www\./)) return `https://${finalUrl}`;
        
        // If it looks like a plain username (no dots/slashes usually, but loose check)
        if (!finalUrl.includes('.com') && !finalUrl.includes('.org') && !finalUrl.includes('.net')) {
            if (type === 'linkedin') return `https://www.linkedin.com/in/${finalUrl}`;
            if (type === 'github') return `https://github.com/${finalUrl}`;
        }
        
        // Fallback for others or if it looks like a domain
        return `https://${finalUrl}`;
    };

    return (
        <div className="w-full p-10 bg-white text-slate-900 leading-normal">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-slate-600 font-medium">
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.phone && (
                        <a href={`tel:${data.personal_info.phone}`} className="hover:text-slate-900 transition-colors">{data.personal_info.phone}</a>
                    )}
                    {data.personal_info?.email && (
                        <a href={`mailto:${data.personal_info.email}`} className="hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-2">{data.personal_info.email}</a>
                    )}
                    {data.personal_info?.linkedin && (
                        <span className="flex gap-1.5">
                            <span className="text-slate-300">|</span>
                            <a href={getLoginUrl(data.personal_info.linkedin, 'linkedin')} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                                LinkedIn: {getDisplayUsername(data.personal_info.linkedin)}
                            </a>
                        </span>
                    )}
                    {data.personal_info?.github && (
                        <span className="flex gap-1.5">
                            <span className="text-slate-300">|</span>
                            <a href={getLoginUrl(data.personal_info.github, 'github')} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                                GitHub: {getDisplayUsername(data.personal_info.github)}
                            </a>
                        </span>
                    )}
                    {data.personal_info?.website && (
                        <span className="flex gap-1.5">
                            <span className="text-slate-300">|</span>
                            <a href={getLoginUrl(data.personal_info.website, 'website')} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                                Portfolio: {getDisplayUsername(data.personal_info.website)}
                            </a>
                        </span>
                    )}
                </div>
            </header>

            {/* Summary */}
            {data.professional_summary && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b border-slate-200" style={{ color: accentColor, borderBottomColor: accentColor }}>
                        Professional Profile
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-relaxed text-justify">{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1 border-b border-slate-200" style={{ color: accentColor, borderBottomColor: accentColor }}>
                        Work Experience
                    </h2>
                    <div className="space-y-5">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[15px] font-bold text-slate-900">{exp.company}</h3>
                                        {exp.link && (
                                            <a href={getLoginUrl(exp.link)} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                                                <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        )}
                                    </div>
                                    <span className="text-[12px] font-semibold text-slate-500">
                                        {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-[13px] font-semibold italic text-slate-700">{exp.position}</span>
                                    {exp.location && <span className="text-[12px] text-slate-500 italic">{exp.location}</span>}
                                </div>
                                {exp.description && (
                                    <div className="text-[13px] text-slate-700 ml-4">
                                        <ul className="list-disc space-y-1">
                                            {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                                <li key={i} className="pl-1">
                                                    {line.trim().startsWith('•') || line.trim().startsWith('-') ? line.trim().substring(1).trim() : line.trim()}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1 border-b border-slate-200" style={{ color: accentColor, borderBottomColor: accentColor }}>
                        Education
                    </h2>
                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-[14px] font-bold text-slate-900">{edu.institution}</h3>
                                    <span className="text-[12px] font-semibold text-slate-500">{formatDate(edu.graduation_date)}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[13px] text-slate-700">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</span>
                                    {edu.gpa && <span className="text-[12px] text-slate-500 italic">GPA: {edu.gpa}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b border-slate-200" style={{ color: accentColor, borderBottomColor: accentColor }}>
                        Technical Expertise
                    </h2>
                    <div className="text-[13px] text-slate-700 leading-relaxed">
                        {data.skills.map((skill, index) => {
                            const hasColon = skill.includes(':');
                            if (hasColon) {
                                const [category, items] = skill.split(/:(.+)/);
                                return (
                                    <div key={index} className="mb-1">
                                        <span className="font-bold">{category.trim()}:</span> {items ? items.trim() : ""}
                                    </div>
                                );
                            }
                            return (
                                <span key={index} className="inline-block bg-slate-50 border border-slate-200 rounded px-2 py-0.5 mr-2 mb-2 text-[11px] font-bold uppercase tracking-tight">
                                    {skill}
                                </span>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1 border-b border-slate-200" style={{ color: accentColor, borderBottomColor: accentColor }}>
                        Selected Projects
                    </h2>
                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">{proj.name}</h3>
                                        {proj.link && (
                                            <a href={getLoginUrl(proj.link)} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                                                <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        )}
                                    </div>
                                    {proj.link && (
                                        <a href={getLoginUrl(proj.link)} target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 font-medium hover:text-slate-600 transition-colors underline underline-offset-2">
                                            {getDisplayUsername(proj.link)}
                                        </a>
                                    )}
                                </div>
                                <p className="text-[13px] text-slate-700 leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications & Languages Grid */}
            <div className="grid grid-cols-2 gap-8">
                {data.certifications && data.certifications.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b border-slate-200" style={{ color: accentColor, borderBottomColor: accentColor }}>
                            Certifications
                        </h2>
                        <div className="space-y-2">
                            {data.certifications.map((cert, index) => (
                                <div key={index} className="text-[12px]">
                                    <p className="font-bold text-slate-900">{cert.name}</p>
                                    <p className="text-slate-500 italic">{cert.issuer} | {formatDate(cert.date)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.languages && data.languages.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b border-slate-200" style={{ color: accentColor, borderBottomColor: accentColor }}>
                            Languages
                        </h2>
                        <ul className="space-y-1">
                            {data.languages.map((lang, index) => (
                                <li key={index} className="text-[12px] text-slate-700">
                                    <span className="font-bold">{lang.name}</span>
                                    {lang.level && <span className="text-slate-500 italic ml-1">({lang.level})</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ATSTemplate;
