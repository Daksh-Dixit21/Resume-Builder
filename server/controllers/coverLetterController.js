import CoverLetter from "../models/CoverLetter.js";

export const getCoverLetters = async (req, res) => {
    try {
        const userId = req.userId;
        const coverLetters = await CoverLetter.find({ userId }).sort({ updatedAt: -1 });
        return res.status(200).json({ coverLetters });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getCoverLetterById = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const coverLetter = await CoverLetter.findOne({ userId, _id: id });
        if (!coverLetter) {
            return res.status(404).json({ message: 'Cover letter not found' });
        }
        return res.status(200).json({ coverLetter });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const deleteCoverLetter = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        await CoverLetter.findOneAndDelete({ userId, _id: id });
        return res.status(200).json({ message: 'Cover letter deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const duplicateCoverLetter = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const coverLetter = await CoverLetter.findOne({ userId, _id: id }).lean();

        if (!coverLetter) {
            return res.status(404).json({ message: 'Cover letter not found' });
        }

        const { _id, createdAt, updatedAt, ...copyData } = coverLetter;
        const duplicate = await CoverLetter.create({
            ...copyData,
            title: `${coverLetter.title || 'Cover Letter'} Copy`,
        });

        return res.status(201).json({ message: 'Cover letter duplicated successfully', coverLetter: duplicate });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
export const updateCoverLetter = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { title, content, hiringManager, company } = req.body;
        
        const coverLetter = await CoverLetter.findOneAndUpdate(
            { userId, _id: id },
            { title, content, hiringManager, company },
            { new: true }
        );

        if (!coverLetter) {
            return res.status(404).json({ message: 'Cover letter not found' });
        }

        return res.status(200).json({ message: 'Cover letter updated successfully', coverLetter });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
