import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from "lucide-react";

const ProfessionalTemplate = ({ data, accentColor }) => {
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
		<div className="w-full bg-white text-slate-900 font-sans">
			{/* Header */}
			<header className="p-8 border-b-4" style={{ borderBottomColor: accentColor }} aria-label="Personal Information">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
					<div>
						<h1 className="text-4xl font-bold tracking-tight mb-1 uppercase" style={{ color: accentColor }}>
							{data.personal_info?.full_name || "Your Name"}
						</h1>
						<p className="text-xl font-medium text-slate-600 uppercase tracking-widest">
							{data.personal_info?.profession || "Profession"}
						</p>
					</div>
					<ul className="flex flex-col items-end gap-1 text-sm text-slate-600 list-none p-0 m-0" aria-label="Contact Details">
						{data.personal_info?.email && (
							<li>
								<a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-2 hover:text-slate-900 transition-colors">
									<span>{data.personal_info.email}</span>
									<Mail className="size-4 shrink-0" style={{ color: accentColor }} />
								</a>
							</li>
						)}
						{data.personal_info?.phone && (
							<li>
								<a href={`tel:${data.personal_info.phone}`} className="flex items-center gap-2 hover:text-slate-900 transition-colors">
									<span>{data.personal_info.phone}</span>
									<Phone className="size-4 shrink-0" style={{ color: accentColor }} />
								</a>
							</li>
						)}
						{data.personal_info?.location && (
							<li className="flex items-center gap-2">
								<span>{data.personal_info.location}</span>
								<MapPin className="size-4 shrink-0" style={{ color: accentColor }} />
							</li>
						)}
					</ul>
				</div>

				<div className="mt-4 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wider border-t pt-4 border-slate-100">
					{data.personal_info?.linkedin && (
						<a href={getLoginUrl(data.personal_info.linkedin, 'linkedin')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
							<Linkedin className="size-3" style={{ color: accentColor }} />
							<span>LinkedIn</span>
						</a>
					)}
					{data.personal_info?.github && (
						<a href={getLoginUrl(data.personal_info.github, 'github')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
							<Github className="size-3" style={{ color: accentColor }} />
							<span>GitHub</span>
						</a>
					)}
					{data.personal_info?.website && (
						<a href={getLoginUrl(data.personal_info.website, 'website')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
							<Globe className="size-3" style={{ color: accentColor }} />
							<span>Portfolio</span>
						</a>
					)}
				</div>
			</header>

			<div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
				{/* Left Main Column */}
				<div className="md:col-span-8 space-y-8">
					{/* Professional Summary */}
					{data.professional_summary && (
						<section aria-labelledby="summary-heading">
							<h2 id="summary-heading" className="text-lg font-bold mb-3 border-l-4 pl-3 uppercase tracking-wider" style={{ borderLeftColor: accentColor }}>
								Executive Summary
							</h2>
							<p className="text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">{data.professional_summary}</p>
						</section>
					)}

					{/* Experience */}
					{data.experience && data.experience.length > 0 && (
						<section aria-labelledby="experience-heading">
							<h2 id="experience-heading" className="text-lg font-bold mb-4 border-l-4 pl-3 uppercase tracking-wider" style={{ borderLeftColor: accentColor }}>
								Professional History
							</h2>

							<div className="space-y-6">
								{data.experience.map((exp, index) => (
									<div key={index}>
										<div className="flex justify-between items-baseline mb-1">
											<h3 className="font-bold text-slate-900 text-base uppercase">
												{exp.position}
											</h3>
											<span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded uppercase tracking-tighter">
												{formatDate(exp.start_date)}
												{(exp.is_current || exp.end_date) && ` — ${exp.is_current ? "Present" : formatDate(exp.end_date)}`}
											</span>
										</div>
										<div className="flex items-center gap-2 mb-3">
											<span className="font-semibold text-sm" style={{ color: accentColor }}>{exp.company}</span>
											{exp.link && (
												<a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">
													<ExternalLink className="size-3" />
												</a>
											)}
										</div>
										{exp.description && (
											<div className="text-slate-700 text-sm leading-relaxed">
												{exp.description.split(/\r?\n/).filter(line => line.trim().length > 0).length > 1 ? (
													<ul className="list-disc pl-5 space-y-1.5 marker:text-slate-400">
														{exp.description.split(/\r?\n/).filter(line => line.trim().length > 0).map((line, idx) => (
															<li key={idx} className="pl-1">{line}</li>
														))}
													</ul>
												) : (
													<p className="whitespace-pre-line">{exp.description}</p>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						</section>
					)}

					{/* Projects */}
					{data.project && data.project.length > 0 && (
						<section aria-labelledby="projects-heading">
							<h2 id="projects-heading" className="text-lg font-bold mb-4 border-l-4 pl-3 uppercase tracking-wider" style={{ borderLeftColor: accentColor }}>
								Key Projects
							</h2>
							<div className="grid grid-cols-1 gap-4">
								{data.project.map((p, index) => (
									<div key={index} className="p-4 bg-slate-50 rounded-r-lg border-l-2" style={{ borderLeftColor: accentColor }}>
										<div className="flex justify-between items-start mb-1">
											<h3 className="font-bold text-slate-900 text-sm uppercase">{p.name}</h3>
											{p.link && (
												<a href={p.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">
													<ExternalLink className="size-3" />
												</a>
											)}
										</div>
										{p.type && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{p.type}</p>}
										<p className="text-slate-700 text-xs leading-relaxed">{p.description}</p>
									</div>
								))}
							</div>
						</section>
					)}
				</div>

				{/* Right Sidebar Column */}
				<div className="md:col-span-4 space-y-8">
					{/* Education */}
					{data.education && data.education.length > 0 && (
						<section aria-labelledby="education-heading">
							<h2 id="education-heading" className="text-sm font-black mb-4 uppercase tracking-[0.2em] text-slate-400 border-b pb-2">
								Education
							</h2>
							<div className="space-y-4">
								{data.education.map((edu, index) => (
									<div key={index}>
										<h3 className="text-xs font-bold text-slate-900 uppercase mb-1">
											{edu.degree}
										</h3>
										<p className="text-xs font-semibold" style={{ color: accentColor }}>{edu.institution}</p>
										<div className="flex justify-between items-center mt-1">
											<span className="text-[10px] font-bold text-slate-400">{formatDate(edu.graduation_date)}</span>
											{edu.gpa && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">GPA: {edu.gpa}</span>}
										</div>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Skills */}
					{data.skills && data.skills.length > 0 && (
						<section aria-labelledby="skills-heading">
							<h2 id="skills-heading" className="text-sm font-black mb-4 uppercase tracking-[0.2em] text-slate-400 border-b pb-2">
								Expertise
							</h2>
							<div className="flex flex-col gap-3">
								{data.skills.map((skill, index) => {
									const hasColon = skill.includes(':');
									if (hasColon) {
										const [category, items] = skill.split(/:(.+)/);
										return (
											<div key={index} className="space-y-1">
												<p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{category.trim()}</p>
												<p className="text-xs text-slate-700 font-medium leading-relaxed">{items ? items.trim() : ""}</p>
											</div>
										);
									}
									return (
										<div key={index} className="flex items-center gap-2">
											<div className="size-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
											<span className="text-xs font-semibold text-slate-700">{skill}</span>
										</div>
									);
								})}
							</div>
						</section>
					)}

					{/* Certifications */}
					{data.certifications && data.certifications.length > 0 && (
						<section aria-labelledby="certifications-heading">
							<h2 id="certifications-heading" className="text-sm font-black mb-4 uppercase tracking-[0.2em] text-slate-400 border-b pb-2">
								Certifications
							</h2>
							<div className="space-y-4">
								{data.certifications.map((cert, index) => (
									<div key={index}>
										<h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
											{formatDate(cert.date)}
										</h3>
										<p className="text-xs font-bold text-slate-900 uppercase leading-tight mb-1">{cert.name}</p>
										<p className="text-[10px] font-semibold text-slate-600" style={{ color: accentColor }}>{cert.issuer}</p>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Languages */}
					{data.languages && data.languages.length > 0 && (
						<section aria-labelledby="languages-heading">
							<h2 id="languages-heading" className="text-sm font-black mb-4 uppercase tracking-[0.2em] text-slate-400 border-b pb-2">
								Languages
							</h2>
							<div className="space-y-3">
								{data.languages.map((lang, index) => (
									<div key={index} className="flex justify-between items-center">
										<span className="text-xs font-bold text-slate-700 uppercase">{lang.name}</span>
										{lang.level && <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{lang.level}</span>}
									</div>
								))}
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}

export default ProfessionalTemplate;