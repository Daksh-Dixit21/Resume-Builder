import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createResume, deleteResume, getPublicResumeById, getResumebyId, updateResume, downloadPdf } from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumebyId);
resumeRouter.get('/public/:resumeId', getPublicResumeById);
resumeRouter.put('/update', protect, upload.single('image'), updateResume);
resumeRouter.post('/download-pdf', downloadPdf);

export default resumeRouter;