import mongoose from "mongoose";

const CoverLetterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    title: { type: String, default: 'Untitled Cover Letter' },
    company: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    hiringManager: { type: String, default: '' },
    jobDescription: { type: String, default: '' },
    content: { type: String, default: '' },
    template: { type: String, default: 'professional', enum: ['professional', 'casual', 'creative', 'executive', 'startup', 'referral'] },
}, { timestamps: true });

const CoverLetter = mongoose.model('CoverLetter', CoverLetterSchema);

export default CoverLetter;
