import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getCoverLetters, getCoverLetterById, deleteCoverLetter, duplicateCoverLetter, updateCoverLetter } from "../controllers/coverLetterController.js";

const coverLetterRouter = express.Router();

coverLetterRouter.get('/', protect, getCoverLetters);
coverLetterRouter.post('/duplicate/:id', protect, duplicateCoverLetter);
coverLetterRouter.get('/:id', protect, getCoverLetterById);
coverLetterRouter.put('/:id', protect, updateCoverLetter);
coverLetterRouter.delete('/:id', protect, deleteCoverLetter);

export default coverLetterRouter;
