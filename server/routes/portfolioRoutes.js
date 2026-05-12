import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getPortfolio, updatePortfolio, checkUsername, getPortfolioSettings } from "../controllers/portfolioController.js";
import upload from "../configs/multer.js";

const portfolioRouter = express.Router();

portfolioRouter.get('/settings', protect, getPortfolioSettings);
portfolioRouter.put('/update', protect, upload.single('image'), updatePortfolio);
portfolioRouter.get('/check/:username', checkUsername);
portfolioRouter.get('/:username', getPortfolio);

export default portfolioRouter;
