import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

const MinimalTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    const formatDateForAria = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long"
        });
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

    const getDisplayUsername = (url) => {
        if (!url) return "";
        return url.replace(/^https?:\/\/(www\.)?(linkedin\.com\/in\/|github\.com\/)/, '')
                  .replace(/^https?:\/\/(www\.)?/, '')
                  .replace(/\/$/, '');
    };

    return (
        <div className="w-full p-6 bg-white text-gray-900 font-light">
            {/* Header */}
            <header className="mb-6" aria-label="Personal Information">
                <h1 className="text-3xl font-thin mb-1 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                    <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-[0.2em]">{data.personal_info.profession}</p>
                )}

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                    {data.personal_info?.email && (
                        <a 
                            href={`mailto:${data.personal_info.email}`} 
                            aria-label="Email Address"
                            title="Email"
                            className="flex items-center gap-1"
                        >
                            <Mail size={12} aria-label="Email Logo" role="img" />
                            <span>{data.personal_info.email}</span>
                        </a>
                    )}
                    {data.personal_info?.phone && (
                        <a 
                            href={`tel:${data.personal_info.phone}`}
                            aria-label="Phone Number"
                            title="Phone"
                            className="flex items-center gap-1"
                        >
                            <Phone size={12} aria-label="Phone Logo" role="img" />
                            <span>{data.personal_info.phone}</span>
                        </a>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin size={12} aria-label="Location Logo" role="img" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <a 
                            href={getLoginUrl(data.personal_info.linkedin, 'linkedin')}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="LinkedIn Profile"
                            title="LinkedIn"
                            className="flex items-center gap-1"
                        >
                            <Linkedin size={12} aria-label="LinkedIn Logo" role="img" />
                            <span>{getDisplayUsername(data.personal_info.linkedin)}</span>
                        </a>
                    )}
                    {data.personal_info?.github && (
                        <a 
                            href={getLoginUrl(data.personal_info.github, 'github')} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="GitHub Profile"
                            title="GitHub"
                            className="flex items-center gap-1"
                        >
                            <Github size={12} aria-label="GitHub Logo" role="img" />
                            <span>{getDisplayUsername(data.personal_info.github)}</span>
                        </a>
                    )}
                    {data.personal_info?.website && (
                        <a 
                            href={getLoginUrl(data.personal_info.website, 'website')} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Personal Website"
                            title="Website"
                            className="flex items-center gap-1"
                        >
                            <Globe size={12} aria-label="Website Logo" role="img" />
                            <span>{getDisplayUsername(data.personal_info.website)}</span>
                        </a>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-6" aria-labelledby="summary-heading">
                     <h2 id="summary-heading" className="sr-only">Professional Summary</h2>
                    <p className=" text-gray-700">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6" aria-labelledby="experience-heading">
                    <h2 id="experience-heading" className="text-sm uppercase tracking-widest mb-4 font-semibold text-gray-800" style={{ color: accentColor }}>
                        Professional Experience
                    </h2>

                    <div className="space-y-4">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-medium">{exp.position}</h3>
                                    <span className="text-sm text-gray-500" aria-label={`From ${formatDateForAria(exp.start_date)}${exp.is_current ? " to Present" : exp.end_date ? ` to ${formatDateForAria(exp.end_date)}` : ""}`}>
                                        {formatDate(exp.start_date)}
                                        {(exp.is_current || exp.end_date) && ` - ${exp.is_current ? "Present" : formatDate(exp.end_date)}`}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2 flex items-center gap-2">
                                    {exp.company}
                                    {exp.link && (
                                        <a 
                                            href={exp.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            aria-label={`Visit ${exp.company} website`}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <ExternalLink className="size-3" />
                                        </a>
                                    )}
                                </p>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-6" aria-labelledby="projects-heading">
                    <h2 id="projects-heading" className="text-sm uppercase tracking-widest mb-4 font-semibold text-gray-800" style={{ color: accentColor }}>
                        Projects
                    </h2>

                    <div className="space-y-3">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-1 justify-between items-baseline">
                                <h3 className="text-sm font-medium flex items-center gap-2">
                                    {proj.name}
                                    {proj.link && (
                                        <a 
                                            href={proj.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            aria-label={`View project ${proj.name}`}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <ExternalLink className="size-3" />
                                        </a>
                                    )}
                                </h3>
                                <p className="text-gray-600">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-6" aria-labelledby="education-heading">
                    <h2 id="education-heading" className="text-sm uppercase tracking-widest mb-4 font-semibold text-gray-800" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-3">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="text-sm font-medium">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-sm text-gray-500" aria-label={`Graduated in ${formatDateForAria(edu.graduation_date)}`}>
                                    {formatDate(edu.graduation_date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-6" aria-labelledby="skills-heading">
                    <h2 id="skills-heading" className="text-sm uppercase tracking-widest mb-4 font-semibold text-gray-800" style={{ color: accentColor }}>
                        Skills
                    </h2>

                    <ul className="text-gray-700 text-sm list-none p-0">
                        {data.skills.map((skill, index) => (
                            <li key={index} className="inline">
                                {index > 0 && " • "}
                                {skill}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <section className="mb-6" aria-labelledby="certifications-heading">
                    <h2 id="certifications-heading" className="text-sm uppercase tracking-widest mb-4 font-semibold text-gray-800" style={{ color: accentColor }}>
                        Certifications
                    </h2>
                    <div className="space-y-2">
                        {data.certifications.map((cert, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">{cert.name}</span> — {cert.issuer}
                                </p>
                                <span className="text-xs text-gray-500">{formatDate(cert.date)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
                <section className="mb-6" aria-labelledby="languages-heading">
                    <h2 id="languages-heading" className="text-sm uppercase tracking-widest mb-4 font-semibold text-gray-800" style={{ color: accentColor }}>
                        Languages
                    </h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {data.languages.map((lang, index) => (
                            <div key={index} className="text-sm text-gray-700">
                                <span className="font-medium">{lang.name}</span>
                                {lang.level && <span className="text-gray-500 ml-1.5">({lang.level})</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default MinimalTemplate;