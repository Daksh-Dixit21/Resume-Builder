import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Imagekit from "../configs/imageKit.js";
import fs from "fs";

export const getPortfolio = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        let resume = null;
        if (user.portfolioResumeId) {
            resume = await Resume.findOne({ _id: user.portfolioResumeId, public: true });
        }

        return res.status(200).json({
            portfolio: {
                name: user.name,
                username: user.username,
                bio: user.bio,
                portfolioImage: user.portfolioImage,
                socialLinks: user.socialLinks,
                portfolioStyle: user.portfolioStyle,
                resume,
            }
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const updatePortfolio = async (req, res) => {
    try {
        const userId = req.userId;
        const image = req.file;
        const username = req.body.username;
        const bio = req.body.bio;
        const portfolioResumeId = req.body.portfolioResumeId;
        const socialLinks = typeof req.body.socialLinks === 'string' ? JSON.parse(req.body.socialLinks) : req.body.socialLinks;
        const portfolioStyle = typeof req.body.portfolioStyle === 'string' ? JSON.parse(req.body.portfolioStyle) : req.body.portfolioStyle;

        // Validate username format
        if (username) {
            const usernameRegex = /^[a-z0-9_-]{3,30}$/;
            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    message: 'Username must be 3-30 characters and can only contain lowercase letters, numbers, hyphens, and underscores.'
                });
            }

            // Check uniqueness — exclude current user
            const existing = await User.findOne({ username, _id: { $ne: userId } });
            if (existing) {
                return res.status(409).json({ message: 'This username is already taken. Please choose another.' });
            }
        }

        // Validate that portfolioResumeId belongs to the user and is public
        if (portfolioResumeId) {
            const resume = await Resume.findOne({ _id: portfolioResumeId, userId });
            if (!resume) {
                return res.status(400).json({ message: 'Resume not found or does not belong to you.' });
            }
            if (!resume.public) {
                return res.status(400).json({ message: 'The selected resume must be set to public first.' });
            }
        }

        const updateData = {};
        if (username !== undefined) updateData.username = username;
        if (bio !== undefined) updateData.bio = bio;
        if (socialLinks !== undefined) updateData.socialLinks = socialLinks;
        if (portfolioResumeId !== undefined) updateData.portfolioResumeId = portfolioResumeId;
        if (portfolioStyle !== undefined) updateData.portfolioStyle = portfolioStyle;

        if (image) {
            const imageBufferData = fs.createReadStream(image.path);
            const response = await Imagekit.upload({
                file: imageBufferData,
                fileName: 'portfolio-profile.png',
                folder: 'user-portfolios',
                transformation: {
                    pre: 'w-500,h-500,fo-face,z-0.75'
                }
            });
            updateData.portfolioImage = response.url;
            fs.unlink(image.path, () => {});
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -__v');

        return res.status(200).json({ message: 'Portfolio updated successfully', user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'This username is already taken.' });
        }
        return res.status(400).json({ message: error.message });
    }
};

export const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const existing = await User.findOne({ username });
        return res.status(200).json({ available: !existing });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getPortfolioSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('username bio portfolioImage socialLinks portfolioResumeId portfolioStyle');
        return res.status(200).json({ settings: user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
