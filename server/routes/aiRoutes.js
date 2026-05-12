import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { analyzeResume, enhanceJobDescription, enhanceProfessionalSummary, uploadResume, generateCoverLetter, matchJobDescription, refineEmail } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRouter.post('/upload-resume', protect, uploadResume);
aiRouter.post('/analyze-resume', protect, analyzeResume);
aiRouter.post('/generate-cover-letter', protect, generateCoverLetter);
aiRouter.post('/match-job', protect, matchJobDescription);
aiRouter.post('/refine-email', protect, refineEmail);

export default aiRouter;