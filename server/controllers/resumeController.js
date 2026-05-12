import Resume from "../models/Resume.js";
import User from "../models/User.js";
import Imagekit from "../configs/imageKit.js";
import fs from "fs";
import puppeteer from "puppeteer";

export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;
        const newResume = await Resume.create({ userId, title });
        return res.status(201).json({ message: 'Resume created successfully', resume: newResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;
        await Resume.findOneAndDelete({ userId, _id: resumeId });
        return res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const duplicateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ userId, _id: resumeId }).lean();

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const { _id, createdAt, updatedAt, views, viewHistory, ...copyData } = resume;
        const duplicate = await Resume.create({
            ...copyData,
            userId,
            title: `${resume.title || 'Untitled Resume'} Copy`,
            public: false,
            views: 0,
            viewHistory: [],
        });

        return res.status(201).json({ message: 'Resume duplicated successfully', resume: duplicate });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getResumebyId = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ userId, _id: resumeId });

        if (!resume) {
            return res.status(400).json({ message: 'Resume not found' });
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        const owner = await User.findById(resume.userId).select('username portfolioResumeId');
        const portfolioUsername = owner?.username || null;

        return res.status(200).json({ resume, portfolioUsername });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOneAndUpdate(
            { public: true, _id: resumeId },
            { $inc: { views: 1 }, $push: { viewHistory: { date: new Date() } } },
            { new: true }
        );
        if (!resume) {
            return res.status(400).json({ message: 'Resume not found' });
        }
        const owner = await User.findById(resume.userId).select('username');
        return res.status(200).json({ resume, portfolioUsername: owner?.username || null });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getResumeAnalytics = async (req, res) => {
    try {
        const userId = req.userId;
        const resumes = await Resume.find({ userId }).select('title views viewHistory public');

        const totalViews = resumes.reduce((sum, r) => sum + (r.views || 0), 0);

        // Most viewed resume
        const mostViewed = resumes.reduce((top, r) => (r.views > (top?.views || 0) ? r : top), null);

        // Views in last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentViews = resumes.reduce((count, r) => {
            const recent = (r.viewHistory || []).filter(v => new Date(v.date) >= sevenDaysAgo);
            return count + recent.length;
        }, 0);

        // Daily breakdown for last 7 days
        const dailyViews = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date();
            dayStart.setHours(0, 0, 0, 0);
            dayStart.setDate(dayStart.getDate() - i);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);

            const count = resumes.reduce((sum, r) => {
                return sum + (r.viewHistory || []).filter(v => {
                    const d = new Date(v.date);
                    return d >= dayStart && d < dayEnd;
                }).length;
            }, 0);

            dailyViews.push({
                date: dayStart.toISOString().split('T')[0],
                views: count
            });
        }

        return res.status(200).json({
            analytics: {
                totalViews,
                recentViews,
                mostViewed: mostViewed ? { title: mostViewed.title, views: mostViewed.views, id: mostViewed._id } : null,
                dailyViews,
                resumeCount: resumes.length,
                publicCount: resumes.filter(r => r.public).length,
            }
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;
        let resumeDataCopy = JSON.parse(resumeData);

        if (image) {
            const imageBufferData = fs.createReadStream(image.path);
            const response = await Imagekit.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300, h-300, fo-face, z-0.75' + (removeBackground ? ',e-bgremove' : '')
                }
            });
            resumeDataCopy.personal_info.image = response.url;
        }

        await Resume.findOneAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true });

        return res.status(200).json({ message: 'Resume updated successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const downloadPdf = async (req, res) => {
    let browser;
    try {
        const { html, css } = req.body;

        if (!html) {
            return res.status(400).json({ message: "HTML content is required" });
        }

        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // critical for docker
                '--disable-gpu'
            ]
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120000);
        
        // Set viewport to standard A4 resolution at 96 DPI
        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 1,
        });

        // Construct the full HTML document with a robust font stack and Google Fonts
        const fullHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Resume</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    ${css || ''}
                    @page { 
                        size: A4; 
                        margin: 0; 
                    }
                    body { 
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact; 
                        margin: 0;
                        padding: 0;
                        font-family: 'Outfit', 'Montserrat', 'Raleway', 'Playfair Display', ui-sans-serif, system-ui, sans-serif;
                    }
                    #resume-preview {
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                    }
                </style>
            </head>
            <body>
                <div id="pdf-content">
                    ${html}
                </div>
            </body>
            </html>
        `;

        await page.setContent(fullHtml, { 
            waitUntil: 'domcontentloaded', 
            timeout: 120000 
        });
        
        // Ensure all fonts are loaded
        await page.evaluate(async () => {
            await document.fonts.ready;
        });
        
        // Small delay to ensure layout engine catches up with fonts
        await page.waitForTimeout(1000);
        
        await page.emulateMediaType('print');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': 'attachment; filename="resume.pdf"'
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.error("PDF Generation Error:", error);
        return res.status(500).json({ message: "Failed to generate PDF" });
    } finally {
        if (browser) {
            await browser.close().catch(() => {});
        }
    }
};
