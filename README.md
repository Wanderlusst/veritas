# 🚀 Veritas - Modern Blog Platform

A beautiful, responsive blog platform built with Next.js 15, featuring a rich text editor, authentication, and modern UI design.

![Veritas](https://img.shields.io/badge/Veritas-Blog%20Platform-blue?style=for-the-badge&logo=vercel)
![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🎨 **Modern UI/UX** - Clean, minimalist design inspired by Medium
- ✍️ **Rich Text Editor** - Tiptap-powered editor with full formatting
- 🔐 **Authentication** - NextAuth.js with secure session management
- 📱 **Mobile First** - Fully responsive design for all devices
- 🚀 **Performance** - Optimized bundle size and fast loading
- 🔒 **Security** - Security headers, input validation, XSS protection
- 📊 **Dashboard** - User-friendly post management interface
- 🔍 **Search** - Fast blog post search with pagination
- 🐳 **Docker Ready** - Containerized deployment support
- ☁️ **Vercel Ready** - Optimized for Vercel deployment

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Editor**: Tiptap Rich Text Editor
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Deployment**: Vercel, Docker
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/Wanderlusst/veritas.git
cd veritas

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veritas

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# App
NODE_ENV=development
```

## 🐳 Docker Deployment

### Quick Deploy

```bash
# Build and run
docker build -t veritas .
docker run -d -p 3000:3000 --env-file .env.local veritas

# Or with docker-compose
docker-compose up -d
```

### Docker Compose

```yaml
version: '3.8'
services:
  veritas:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    restart: unless-stopped
```

## ☁️ Vercel Deployment

### Automatic Deployment

1. **Connect Repository** to Vercel
2. **Set Environment Variables** in Vercel dashboard
3. **Push to main branch** → Automatic deployment

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

### Environment Variables for Vercel

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veritas
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## 🔄 CI/CD Pipeline

### GitHub Actions

The repository includes a comprehensive CI/CD pipeline:

- ✅ **Lint & Test** - Code quality checks
- ✅ **Security Audit** - Vulnerability scanning
- ✅ **Build & Deploy** - Automatic Vercel deployment
- ✅ **Docker Build** - Container image creation
- ✅ **Health Checks** - Post-deployment verification

### Workflow Triggers

- **Push to main** → Production deployment
- **Push to develop** → Preview deployment
- **Pull Request** → Testing and validation

### Required Secrets

```bash
# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Application
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_deployment_url

# Docker (Optional)
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password
```

## 📱 Mobile Optimization

- **Responsive Design** - Works perfectly on all devices
- **Touch Optimized** - Proper touch targets and spacing
- **Mobile Navigation** - Full-width, smooth mobile menu
- **Performance** - Optimized for mobile networks

## 🔒 Security Features

- **Security Headers** - XSS protection, frame options
- **Input Validation** - Form validation and sanitization
- **Authentication** - Secure session management
- **HTTPS Enforcement** - SSL/TLS encryption
- **Rate Limiting** - API protection

## 📊 Performance

- **Bundle Size**: 136 kB (optimized)
- **Build Time**: ~2.3 seconds
- **Static Generation**: 16/16 pages
- **Code Splitting**: Automatic optimization
- **Image Optimization**: WebP/AVIF support

## 🗂️ Project Structure

```
veritas/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Dashboard pages
│   │   ├── (public)/       # Public pages
│   │   └── api/            # API routes
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   ├── models/            # Database models
│   └── types/             # TypeScript types
├── public/                # Static assets
├── .github/               # GitHub Actions
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Deployment
./deploy.sh          # Automated deployment script
docker-compose up    # Start with Docker
```

## 📚 Documentation

- [🚀 Deployment Guide](DEPLOYMENT.md)
- [☁️ Vercel Deployment](VERCEL_DEPLOYMENT.md)
- [🐳 Docker Guide](DEPLOYMENT.md#docker-deployment)
- [🔒 Security Checklist](PRODUCTION_CHECKLIST.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tiptap](https://tiptap.dev/) - Rich text editor
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Wanderlusst/veritas/issues)
- **Documentation**: Check the docs folder
- **Deployment**: See deployment guides

---

## 🎯 **Ready for Production!**

Your Veritas application is now **PRODUCTION READY** with:

- ✅ **CI/CD Pipeline** - GitHub Actions
- ✅ **Vercel Deployment** - Optimized configuration
- ✅ **Docker Support** - Containerized deployment
- ✅ **Security Hardened** - Production security
- ✅ **Performance Optimized** - Fast loading
- ✅ **Mobile Ready** - Responsive design

**🚀 Deploy to Vercel and go live!**

---

**Made with ❤️ by the Veritas Team**
