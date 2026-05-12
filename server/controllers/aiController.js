import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";
import CoverLetter from "../models/CoverLetter.js";

export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const {prompt} = req.body;
        if(!prompt){
            return res.status(400).json({message: 'Missing required fields'})
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages:[
                {role: "system", content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else."},

                {
                    role: "user",
                    content: prompt
                },
            ]
        })
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({data: enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export const enhanceJobDescription = async (req, res) => {
    try {
        const {prompt} = req.body;
        if(!prompt){
            return res.status(400).json({message: 'Missing required fields'})
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages:[
                {role: "system", content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The summary should be 1-2 sentences also highlighting key responsibilities and achievement. Make it compelling and ATS-friendly. and only return text no options or anything else."},

                {
                    role: "user",
                    content: prompt
                },
            ]
        })
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({data: enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export const uploadResume = async (req, res) => {
    try {

        const {resumeText, title} = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const systemPrompt = "You are an expert AI Agent to extract data from resume."
        const userPrompt = `extract data from this resume: ${resumeText}
        
        Provide data in the following JSON format with no additional text before or after:

        professional_summary: { type: String, default: '' },
skills: [{ type: String}],
personal_info: {
image: {type: String, default: ''},
full_name: {type: String, default: ''},
profession: {type: String, default: '' },
email: {type: String, default: '' },
phone: {type: String, default: '' },
location: {type: String, default: '' },
linkedin: {type: String, default: '' },
website: {type: String, default: '' },
},
experience: [
  {
    company: { type: String },
    position: {type: String},
    start_date: {type: String},
    end_date: {type: String},
    description: {type: String},
    is_current: { type: Boolean},
  }
  ],
  project: [
  {
    company: { type: String },
    position: {type: String},
    description: {type: String},
  }
  ],
  education: [
  {
    institution: { type: String },
    degree: {type: String},
    field: {type: String},
    graduation_date: {type: String},
    gpa: {type: String},
    }], }
        `;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages:[
                {role: "system", content: systemPrompt},
                {
                    role: "user",
                    content: userPrompt
                },
            ],
            response_format: {
                type: "json_object"
            }
        })
        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({userId, title, ...parsedData})
        return res.status(200).json({resumeId: newResume._id})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export const analyzeResume = async (req, res) => {
    try {
        const { resumeData } = req.body;
        if (!resumeData) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an AI ATS (Applicant Tracking System) Specialist. Your goal is to analyze resume data and provide an ATS score (0-100), a professional summary of the analysis, and actionable improvements. Focus on keyword optimization, content quality, and standard section inclusion."
                },
                {
                    role: "user",
                    content: `Analyze this resume data and provide a detailed ATS report:
                    ${JSON.stringify(resumeData)}
                    
                    Return a JSON object with:
                    - score: Number (0-100)
                    - summary: String (Overall feedback in 2-3 sentences)
                    - improvements: Array of Strings (At least 3 actionable tips)
                    - keyword_suggestions: Array of Strings (5-7 relevant keywords based on the profession)
                    - missing_info: Array of Strings (Sections or details that are missing but important)
                    `
                },
            ],
            response_format: { type: "json_object" }
        })

        const analysis = JSON.parse(response.choices[0].message.content);
        return res.status(200).json({ data: analysis })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const generateCoverLetter = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, jobDescription, company, jobTitle, hiringManager, template } = req.body;

        if (!resumeId || !jobDescription) {
            return res.status(400).json({ message: 'Resume and job description are required' });
        }

        // Fetch the resume data
        const resume = await Resume.findOne({ _id: resumeId, userId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const templateInstructions = {
            professional: "Use a formal, corporate tone. Be concise and direct. Focus on qualifications and measurable achievements.",
            casual: "Use a friendly yet professional tone. Show personality while maintaining professionalism. Be conversational but focused.",
            creative: "Use a compelling narrative style. Be bold and memorable. Show passion and enthusiasm while highlighting unique strengths.",
            executive: "Use a senior, strategic tone. Lead with leadership impact, business outcomes, and cross-functional judgment.",
            startup: "Use a concise, energetic tone. Highlight ownership, adaptability, speed, and hands-on problem solving.",
            referral: "Use a warm, relationship-aware tone. Mention the referred context naturally if provided and keep the letter polished.",
        };

        const tone = templateInstructions[template] || templateInstructions.professional;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are an expert cover letter writer. Write a compelling, personalized cover letter based on the candidate's resume data and the target job description. ${tone} The cover letter should be 3-4 paragraphs. Return only the cover letter text, no subject lines or additional formatting instructions.`
                },
                {
                    role: "user",
                    content: `Write a cover letter for this candidate:

Resume Data:
- Name: ${resume.personal_info?.full_name || 'Candidate'}
- Profession: ${resume.personal_info?.profession || 'Professional'}
- Summary: ${resume.professional_summary || 'N/A'}
- Experience: ${JSON.stringify(resume.experience || [])}
- Skills: ${(resume.skills || []).join(', ')}
- Education: ${JSON.stringify(resume.education || [])}
- Projects: ${JSON.stringify(resume.project || [])}

Target Company: ${company || 'the company'}
Target Role: ${jobTitle || 'the open role'}
Hiring Manager: ${hiringManager || 'Not provided'}
Job Description: ${jobDescription}

Template Style: ${template || 'professional'}`
                },
            ],
        });

        const content = response.choices[0].message.content;

        // Save the cover letter
        const coverLetter = await CoverLetter.create({
            userId,
            resumeId,
            title: `Cover Letter - ${jobTitle || company || 'Untitled'}`,
            company: company || '',
            jobTitle: jobTitle || '',
            hiringManager: hiringManager || '',
            jobDescription,
            content,
            template: template || 'professional',
        });

        return res.status(201).json({ coverLetter });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const matchJobDescription = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;

        if (!resumeData || !jobDescription) {
            return res.status(400).json({ message: 'Resume data and job description are required' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert job-resume matching analyst. Compare a candidate's resume against a job description and provide a detailed gap analysis. Be specific and actionable in your feedback."
                },
                {
                    role: "user",
                    content: `Compare this resume against the job description and provide a detailed match analysis:

Resume Data:
${JSON.stringify(resumeData)}

Job Description:
${jobDescription}

Return a JSON object with:
- matchScore: Number (0-100, how well the resume matches the job)
- matchedKeywords: Array of Strings (skills/keywords found in both resume and job description)
- missingKeywords: Array of Strings (important skills/keywords in the job description but missing from the resume)
- suggestions: Array of Strings (specific, actionable suggestions to improve the match, at least 4)
- gapAnalysis: String (2-3 sentence overview of the biggest gaps)
- strengths: Array of Strings (what the candidate does well for this role)`
                },
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(response.choices[0].message.content);
        return res.status(200).json({ data: analysis });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const refineEmail = async (req, res) => {
    try {
        const { content, prompt } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Email content is required' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert professional communicator. Your task is to refine and improve email drafts. Maintain the core message but enhance the tone, clarity, and professionalism. If a specific prompt is provided, follow it strictly. Return only the refined email text."
                },
                {
                    role: "user",
                    content: `Original Email Content:
${content}

Refinement Request:
${prompt || "Improve the overall tone and professionalism."}`
                },
            ],
        });

        const refinedContent = response.choices[0].message.content;
        return res.status(200).json({ data: refinedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
