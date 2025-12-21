# AI Resume Builder

A modern, full-stack web application for creating, customizing, and managing professional resumes. Built with React for the frontend and Node.js/Express for the backend, featuring AI -powered content suggestions, multiple templates, and seamless deployment.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens.
- **Resume Builder**: Intuitive form-based interface to input personal, education, experience, project, and skills details.
- **Multiple Templates**: Choose from Classic, Minimal, Modern, and Minimal with Image templates.
- **AI Integration**: Generate professional summaries and suggestions using OpenAI's Gemini API.
- **Image Upload**: Upload and manage profile images via ImageKit.
- **Real-time Preview**: Live preview of the resume as you edit.
- **PDF Export**: Generate and download resumes as PDF.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Dark/Light Mode**: Toggle between themes for better user experience.

## 🛠 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Colorful** - Color picker component
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **OpenAI** - AI content generation
- **ImageKit** - Image management
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Daksh-Dixit21/resume-builder.git
   cd resume-builder
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables:**

   **Backend (.env in server/):**
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
   OPENAI_MODEL=gemini-2.5-flash
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   ```

   **Frontend (.env in client/):**
   ```env
   VITE_BASE_URL=http://localhost:3000
   ```

5. **Start MongoDB** (if running locally) or ensure your Atlas cluster is accessible.

## 🚀 Usage

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:3000`.

2. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

3. **Access the application:**
   - Open your browser and navigate to `http://localhost:5173`.
   - Register a new account or login.
   - Start building your resume!

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Resumes
- `GET /api/resumes` - Get all user resumes (protected)
- `POST /api/resumes` - Create a new resume (protected)
- `GET /api/resumes/:id` - Get a specific resume (protected)
- `PUT /api/resumes/:id` - Update a resume (protected)
- `DELETE /api/resumes/:id` - Delete a resume (protected)

### AI
- `POST /api/ai/generate-summary` - Generate professional summary (protected)

## 🌐 Deployment

### Frontend (Netlify)
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Login and deploy:
   ```bash
   netlify login
   netlify deploy --prod --dir=dist
   ```

4. Set environment variable in Netlify dashboard:
   - `VITE_BASE_URL`: Your backend's production URL

### Backend (Render)
1. Push your backend code to GitHub.
2. Create a new Web Service on Render.com.
3. Connect your GitHub repo and configure:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables in Render dashboard.
5. Deploy and get your backend URL.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the Gemini API
- ImageKit for image management services
- The open-source community for the amazing libraries used

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the maintainers.

---

Built with ❤️ by Daksh Dixit