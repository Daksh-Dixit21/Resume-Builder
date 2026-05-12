import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createResume, deleteResume, duplicateResume, getPublicResumeById, getResumebyId, updateResume, downloadPdf, getResumeAnalytics } from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.post('/duplicate/:resumeId', protect, duplicateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/analytics', protect, getResumeAnalytics);
resumeRouter.get('/get/:resumeId', protect, getResumebyId);
resumeRouter.get('/public/:resumeId', getPublicResumeById);
resumeRouter.put('/update', protect, upload.single('image'), updateResume);
resumeRouter.post('/download-pdf', downloadPdf);

export default resumeRouter;
