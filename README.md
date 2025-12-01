# 🚀 Ultra-Modern Resume Builder

A feature-rich, professional resume builder application built with Next.js 16, TypeScript, and modern web technologies. Create stunning resumes with real-time preview, professional templates, and seamless PDF export.

![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

- 🎨 **Interactive Resume Builder** - Real-time editing with live preview
- 📄 **Professional Templates** - Multiple pre-designed resume templates
- 🔐 **Secure Authentication** - User authentication with NextAuth.js and MongoDB
- 📥 **PDF & Docs Export** - High-quality PDF & Docs generation with html2canvas & jsPDF
- 💾 **Cloud Storage** - Save and manage multiple resumes
- 📱 **Responsive Design** - Fully optimized for all devices
- 🎯 **Dashboard** - Personalized user dashboard to manage resumes
- ⚙️ **Settings Page** - Customize your profile and preferences
- 🔒 **Secure Routes** - Protected routes with middleware authentication
- 📧 **Email Integration** - Nodemailer for email notifications
- ⚖️ **Legal Pages** - Privacy Policy and Terms of Service pages

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.0.5](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **UI Library**: [React 19.2](https://react.dev/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **PDF Generation**: [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://github.com/parallax/jsPDF)

### Backend & Database
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Adapter**: [@next-auth/mongodb-adapter](https://authjs.dev/reference/adapter/mongodb)
- **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt)
- **JWT**: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

### Additional Tools
- **Email Service**: [Nodemailer](https://nodemailer.com/)
- **Cookie Management**: [cookie](https://www.npmjs.com/package/cookie)

---

## 📁 Project Structure

```
resume-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   └── resume/           # Resume CRUD endpoints
│   ├── auth/                 # Auth pages (login, register)
│   ├── dashboard/            # User dashboard
│   ├── resume/               # Resume builder pages
│   ├── settings/             # User settings
│   ├── templates/            # Resume templates
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
│
├── components/               # Reusable components
│   ├── providers/            # React context providers
│   ├── pdf/                  # PDF generation components
│   ├── resume/               # Resume-specific components
│   └── ui/                   # Generic UI components
│
├── lib/                      # Library configurations
│   ├── auth.ts               # Authentication utilities
│   ├── dbConnect.ts          # Database connection
│   ├── email.ts              # Email service configuration
│   ├── hash.ts               # Password hashing utilities
│   ├── jwt.ts                # JWT token management
│   ├── mongodb.ts            # MongoDB client
│   ├── nextAuth.ts           # NextAuth configuration
│   └── pdf.ts                # PDF utilities
│
├── models/                   # Mongoose models
│   ├── User.ts               # User model
│   └── Resume.ts             # Resume model
│
├── middleware.ts             # Next.js middleware (auth protection)
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript type definitions
├── utils/                    # Helper functions
├── public/                   # Static assets
└── styles/                   # Additional styles
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** or **pnpm**
- **MongoDB** database (local or cloud like MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resume-app.git
   cd resume-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   
   ```env
   EMAIL_FROM=noreply@resume-app.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server on port 3000 |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check code quality |

---

## 🔐 Authentication Flow

1. Users can register with email/password
2. Passwords are hashed using bcrypt
3. NextAuth.js handles session management
4. MongoDB stores user credentials and session data
5. Protected routes are secured via middleware
6. JWT tokens used for API authentication

---

## 📄 PDF Generation

The PDF generation is handled by combining:
- **html2canvas** - Captures the resume preview as a canvas image
- **jsPDF** - Converts the canvas to a downloadable PDF

The implementation includes:
- Automatic pagination for multi-page resumes
- High-quality rendering
- Proper formatting preservation

---

## 🎨 Features in Detail

### Resume Templates
- Multiple professional templates
- Customizable sections (Experience, Education, Skills, etc.)
- Real-time preview as you edit

### Dashboard
- View your saved resume
- Quick access to edit or download
- Resume management (create, update, delete)

### Settings
- Update profile information
- Change password
- Manage account preferences

---

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configurations in `postcss.config.mjs` and `@tailwindcss/postcss`.

### TypeScript
TypeScript is configured via `tsconfig.json` with strict type checking enabled.

### ESLint
Code quality is maintained using ESLint with Next.js recommended configuration.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Render**

Make sure to:
1. Set build command: `npm run build`
2. Set start command: `npm run start`
3. Configure all environment variables

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


## 👨‍💻 Author

**Resume Builder Team**

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- MongoDB for database solutions
- All contributors and users

---

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team

---

**⭐ If you find this project useful, please consider giving it a star!**
