import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
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
        <div className="max-w-5xl mx-auto bg-white text-zinc-800">
            <div className="grid grid-cols-3">

                <div className="col-span-1  py-10">
                    {/* Image */}
                    {data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
                        <div className="mb-6">
                            <img src={data.personal_info.image} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" style={{ background: accentColor+'70' }} />
                        </div>
                    ) : (
                        data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
                            <div className="mb-6">
                                <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" />
                            </div>
                        ) : null
                    )}
                </div>

                {/* Name + Title */}
                <div className="col-span-2 flex flex-col justify-center py-10 px-8">
                    <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
                        {data?.personal_info?.profession || "Profession"}
                    </p>
                </div>

                {/* Left Sidebar */}
                <aside className="col-span-1 border-r border-zinc-400 p-6 pt-0">


                    {/* Contact */}
                    <section className="mb-8" aria-label="Contact Information">
                        <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                            CONTACT
                        </h2>
                        <div className="space-y-1 text-xs">
                            {data.personal_info?.phone && (
                                <a 
                                    href={`tel:${data.personal_info.phone}`}
                                    aria-label="Phone Number"
                                    title="Phone"
                                    className="flex items-center gap-1"
                                >
                                    <Phone size={12} style={{ color: accentColor }} aria-label="Phone Logo" role="img" />
                                    <span>{data.personal_info.phone}</span>
                                </a>
                            )}
                            {data.personal_info?.email && (
                                <a 
                                    href={`mailto:${data.personal_info.email}`}
                                    aria-label="Email Address"
                                    title="Email"
                                    className="flex items-center gap-1"
                                >
                                    <Mail size={12} style={{ color: accentColor }} aria-label="Email Logo" role="img" />
                                    <span>{data.personal_info.email}</span>
                                </a>
                            )}
                            {data.personal_info?.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin size={12} style={{ color: accentColor }} aria-label="Location Logo" role="img" />
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
                                    <Linkedin size={12} style={{ color: accentColor }} aria-label="LinkedIn Logo" role="img" />
                                    <span className="break-all">{getDisplayUsername(data.personal_info.linkedin)}</span>
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
                                    <Github size={12} style={{ color: accentColor }} aria-label="GitHub Logo" role="img" />
                                    <span className="break-all">{getDisplayUsername(data.personal_info.github)}</span>
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
                                    <Globe size={12} style={{ color: accentColor }} aria-label="Website Logo" role="img" />
                                    <span className="break-all">{getDisplayUsername(data.personal_info.website)}</span>
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section className="mb-8" aria-labelledby="education-heading">
                            <h2 id="education-heading" className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                EDUCATION
                            </h2>
                            <div className="space-y-4 text-sm">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <p className="font-semibold uppercase">{edu.degree}</p>
                                        <p className="text-zinc-600">{edu.institution}</p>
                                        <p className="text-xs text-zinc-500" aria-label={`Graduated in ${formatDateForAria(edu.graduation_date)}`}>
                                            {formatDate(edu.graduation_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section aria-labelledby="skills-heading">
                            <h2 id="skills-heading" className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                SKILLS
                            </h2>
                            <ul className="space-y-1 text-sm list-none p-0">
                                {data.skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* Right Content */}
                <main className="col-span-2 p-8 pt-0">

                    {/* Summary */}
                    {data.professional_summary && (
                        <section className="mb-8" aria-labelledby="summary-heading">
                            <h2 id="summary-heading" className="text-sm font-semibold tracking-widest mb-3" style={{ color: accentColor }} >
                                SUMMARY
                            </h2>
                            <p className="text-zinc-700 leading-relaxed">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section aria-labelledby="experience-heading">
                            <h2 id="experience-heading" className="text-sm font-semibold tracking-widest mb-4 text-zinc-800" style={{ color: accentColor }} >
                                PROFESSIONAL EXPERIENCE
                            </h2>
                            <div className="space-y-6 mb-8">
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-zinc-900">
                                                {exp.position}
                                            </h3>
                                            <span className="text-xs text-zinc-500" aria-label={`From ${formatDateForAria(exp.start_date)} to ${exp.is_current ? "Present" : formatDateForAria(exp.end_date)}`}>
                                                {formatDate(exp.start_date)} -{" "}
                                                {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        <p className="text-sm mb-2" style={{ color: accentColor }} >
                                            {exp.company}
                                        </p>
                                        {exp.description && (
                                            <ul className="list-disc list-inside text-sm text-zinc-700 leading-relaxed space-y-1">
                                                {exp.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.project && data.project.length > 0 && (
                        <section aria-labelledby="projects-heading">
                            <h2 id="projects-heading" className="text-sm uppercase tracking-widest font-semibold text-zinc-800" style={{ color: accentColor }}>
                                KEY PROJECTS
                            </h2>
                            <div className="space-y-4">
                                {data.project.map((project, index) => (
                                    <div key={index}>
                                        <h3 className="text-md font-medium text-zinc-800 mt-3 flex items-center gap-2">
                                            {project.name}
                                            {project.link && (
                                                <a 
                                                    href={project.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    aria-label={`View project ${project.name}`}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            )}
                                        </h3>
                                        <p className="text-sm mb-1" style={{ color: accentColor }} >
                                            {project.type}
                                        </p>
                                        {project.description && (
                                            <ul className="list-disc list-inside text-sm text-zinc-700  space-y-1">
                                                {project.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}


export default MinimalImageTemplate;
