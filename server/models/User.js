import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  name: {type: String, required: true },
  email: {type: String, required: true, unique: true },
  password: {type: String, required: true },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  bio: { type: String, default: '' },
  portfolioImage: { type: String, default: '' },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  portfolioStyle: {
    template: { type: String, default: 'bento' },
    accentColor: { type: String, default: '#10b981' },
    fontFamily: { type: String, default: 'Outfit' },
    backgroundStyle: { type: String, default: 'mesh' },
    glassmorphism: { type: Boolean, default: false },
    borderRadius: { type: String, default: '0px' },
    showResumeDownload: { type: Boolean, default: true },
    visibleSections: {
      about: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      certifications: { type: Boolean, default: true },
      languages: { type: Boolean, default: true },
    },
  },
  portfolioResumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
}, {timestamps: true })

UserSchema.methods.comparePassword = function (password){
  return bcrypt.compareSync(password, this.password)
}
const User = mongoose.model("User", UserSchema)

export default User;
