import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js"
import resumeRouter from "./routes/resumeRoutes.js"
import aiRouter from "./routes/aiRoutes.js"
import coverLetterRouter from "./routes/coverLetterRoutes.js"
import portfolioRouter from "./routes/portfolioRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

app.get('/', (req, res)=>{
  res.send("Server is live...")
})
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/cover-letters', coverLetterRouter)
app.use('/api/portfolio', portfolioRouter)

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
});