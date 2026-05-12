import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getCoverLetters, getCoverLetterById, deleteCoverLetter, duplicateCoverLetter } from "../controllers/coverLetterController.js";

const coverLetterRouter = express.Router();

coverLetterRouter.get('/', protect, getCoverLetters);
coverLetterRouter.post('/duplicate/:id', protect, duplicateCoverLetter);
coverLetterRouter.get('/:id', protect, getCoverLetterById);
coverLetterRouter.delete('/:id', protect, deleteCoverLetter);

export default coverLetterRouter;
