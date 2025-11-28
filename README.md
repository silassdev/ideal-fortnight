# Resume App

A modern, feature-rich resume builder application built with Next.js 16, TypeScript, and Tailwind CSS. This application allows users to create, preview, and download professional resumes in PDF format.

##  Features

-   **Interactive Resume Builder**: Real-time resume editing and preview.
-   **PDF Export**: High-quality PDF generation using `html2canvas` and `jspdf`.
-   **Authentication**: Secure user authentication via `next-auth`.
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS.
-   **Modern Tech Stack**: Built on the latest Next.js App Router.

##  Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **PDF Generation**: [html2canvas](https://html2canvas.hertzen.com/) & [jspdf](https://github.com/parallax/jsPDF)
-   **Icons**: [Lucide React](https://lucide.dev/) (assumed based on common usage, or standard SVGs)

##  Project Structure

```bash
resume-app/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # API endpoints (Auth, Resume)
│   ├── dashboard/        # User dashboard
│   ├── resume/           # Resume builder pages
│   └── ...
├── components/           # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── pdf/              # PDF generation components
│   ├── resume/           # Resume specific components
│   └── ui/               # Generic UI elements
├── lib/                  # Library configurations (NextAuth, MongoDB, etc.)
├── models/               # Database models
├── public/               # Static assets
├── styles/               # Global styles
└── utils/                # Helper functions
```

##  Getting Started

### Prerequisites

-   Node.js 18.17 or later
-   npm or yarn


## PDF Generation

The PDF generation logic is handled in `components/pdf/DownloadPDFButton.tsx`. It captures the resume preview element as a canvas and converts it to a PDF document, handling pagination automatically.

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

