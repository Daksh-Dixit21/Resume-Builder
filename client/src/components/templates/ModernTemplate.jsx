import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
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
		<div className="max-w-4xl mx-auto bg-white text-gray-800">
			{/* Header */}
			<header className="pb-5 pt-6 pl-6 pr-6 text-white" style={{ backgroundColor: accentColor }} aria-label="Personal Information">
				<h1 className="text-3xl font-light mb-4">
					{data.personal_info?.full_name || "Your Name"}
				</h1>

				<div className="flex flex-wrap gap-3 text-sm">
					{data.personal_info?.email && (
						<a 
							href={`mailto:${data.personal_info.email}`}
							aria-label="Email Address"
							title="Email"
							className="flex items-center gap-1"
						>
							<Mail className="size-3" aria-label="Email Logo" role="img" />
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
							<Phone className="size-3" aria-label="Phone Logo" role="img" />
							<span>{data.personal_info.phone}</span>
						</a>
					)}
					{data.personal_info?.location && (
						<div className="flex items-center gap-1">
							<MapPin className="size-3" aria-label="Location Logo" role="img" />
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
							<Linkedin className="size-3" aria-label="LinkedIn Logo" role="img" />
							<span className="break-all text-xs">{getDisplayUsername(data.personal_info.linkedin)}</span>
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
							<Github className="size-3" aria-label="GitHub Logo" role="img" />
							<span className="break-all text-xs">{getDisplayUsername(data.personal_info.github)}</span>
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
							<Globe className="size-3" aria-label="Website Logo" role="img" />
							<span className="break-all text-xs">{getDisplayUsername(data.personal_info.website)}</span>
						</a>
					)}
				</div>
			</header>

			<div className="p-6">
				{/* Professional Summary */}
				{data.professional_summary && (
					<section className="mb-6" aria-labelledby="summary-heading">
						<h2 id="summary-heading" className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800" style={{ borderColor: accentColor }}>
							Professional Summary
						</h2>
						<p className="text-gray-700 text-sm text-justify">{data.professional_summary}</p>
					</section>
				)}

				{/* Experience */}
				{data.experience && data.experience.length > 0 && (
					<section className="mb-6" aria-labelledby="experience-heading">
						<h2 id="experience-heading" className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800" style={{ borderColor: accentColor }}>
							Professional Experience
						</h2>

						<div className="space-y-3">
							{data.experience.map((exp, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200">

									<div className="flex justify-between items-start mb-2">
										<div>
											<h3 className="font-medium text-gray-900">
												{exp.position} <span className="text-gray-600">|</span> <span style={{ color: accentColor }}>{exp.company}</span>
											</h3>
										</div>
										<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                                            <span aria-label={`From ${formatDateForAria(exp.start_date)} to ${exp.is_current ? "Present" : formatDateForAria(exp.end_date)}`}>
											    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
										</div>
									</div>
									{exp.description && (
										<div className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line text-sm text-justify">
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
						<h2 id="projects-heading" className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800" style={{ borderColor: accentColor }}>
							Projects
						</h2>

						<div className="space-y-4">
							{data.project.map((p, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200" style={{borderLeftColor: accentColor}}>


									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                {p.name}
                                                {p.link && (
                                                    <a 
                                                        href={p.link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        aria-label={`View project ${p.name}`}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        <ExternalLink className="size-3" />
                                                    </a>
                                                )}
                                            </h3>
											{p.type && <p className="text-xs font-bold mt-1" style={{ color: accentColor }}>{p.type}</p>}
										</div>
									</div>
									{p.description && (
										<div className="text-gray-700 leading-relaxed text-sm mt-1.5 text-justify">
											{p.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className="grid sm:grid-cols-2 gap-6 print:break-inside-avoid">
					{/* Education */}
					{data.education && data.education.length > 0 && (
						<section aria-labelledby="education-heading">
							<h2 id="education-heading" className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800" style={{ borderColor: accentColor }}>
								Education
							</h2>

							<div className="space-y-3">
								{data.education.map((edu, index) => (
									<div key={index}>
										<h3 className="text-sm font-semibold text-gray-900">
											{edu.degree} {edu.field && `in ${edu.field}`}
										</h3>
										<p className="text-sm" style={{ color: accentColor }}>
											{edu.institution} <span className="text-gray-600 ml-1.5 mr-1.5">•</span>
                                            <span className="text-gray-600" aria-label={`Graduated in ${formatDateForAria(edu.graduation_date)}`}>
                                                {formatDate(edu.graduation_date)}
                                            </span>
										</p>
										{edu.gpa && (
											<div className="text-sm text-gray-600">
												GPA: {edu.gpa}
											</div>
										)}
									</div>
								))}
							</div>
						</section>
					)}

					{/* Skills */}
					{data.skills && data.skills.length > 0 && (
						<section aria-labelledby="skills-heading">
							<h2 id="skills-heading" className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800" style={{ borderColor: accentColor }}>
								Skills & Technologies
							</h2>

							<ul className="flex flex-wrap gap-2 list-none p-0">
								{data.skills.map((skill, index) => (
									<li
										key={index}
										className="px-2 py-1 text-xs text-white rounded-full"
										style={{ backgroundColor: accentColor }}
									>
										{skill}
									</li>
								))}
							</ul>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}

export default ModernTemplate;