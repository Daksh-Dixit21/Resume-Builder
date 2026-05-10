import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

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