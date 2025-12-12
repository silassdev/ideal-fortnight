# Ultra-Modern Resume Builder

A professional, modern resume builder enhanced with AI capabilities. Build ATS-friendly resumes in minutes using smart templates, AI content suggestions, and easy import features.

![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?style=for-the-badge&logo=mongodb)

---

## ✨ Key Features

- **🤖 AI Resume Writer**: 
  - Generates professional resume content based on Role, Work Type, and Experience Level.
  - Interactive 3-step wizard to guide you to the perfect template.

- **📥 Drag & Drop Import**: 
  - Import existing resumes (JSON/TXT) easily.
  - Automatically parses and populates your profile.

- **🎨 Modern Templates**: 
  - Curated, ATS-friendly templates (Apela, Aurora, Nova, etc.).
  - Real-time preview as you edit.

- **💾 Dashboard**:
  - Manage multiple resumes.
  - Profile settings and customization.

- **🔐 Secure Authentication**:
  - Email/Password login.
  - Social Auth (Google, GitHub).
  - Secure session management with NextAuth.js.

- **📄 Export & Share**:
  - High-quality PDF export.
  - Shareable public links.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Drag & Drop**: dnd-kit

### Backend
- **Database**: MongoDB (via Mongoose)
- **Auth**: NextAuth.js v4
- **API**: Next.js API Routes

### Utilities
- **PDF Generation**: html2canvas + jsPDF / React-to-Print
- **Validation**: Zod
- **Email**: Nodemailer

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB URI (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resume-app.git
   cd resume-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/resume-app
   
   # Auth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_key
   
   # Email (Optional)
   EMAIL_SERVER=smtp://...
   EMAIL_FROM=noreply@resume-app.com
   
   # AI / Other
   # Add any specific API keys if needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
resume-app/
├── app/
│   ├── api/                  # API endpoints (auth, resume, ai)
│   ├── auth/                 # Login/Register pages
│   ├── dashboard/            # User Dashboard (AI Suggest, Import, Gallery)
│   ├── resume/               # Public resume view
│   └── page.tsx              # Homepage
├── components/
│   ├── dashboard/            # Dashboard components (SuggestResumeFlow, etc.)
│   ├── templates/            # Resume Templates (Aurora, Apela, etc.)
│   ├── ui/                   # Shared UI components
│   └── ...
├── lib/                      # Utilities (db, auth, ai)
├── models/                   # Mongoose schemas
└── public/                   # Static assets
```

---

## 🤝 Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes.
4. Push to the branch.
5. Submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
