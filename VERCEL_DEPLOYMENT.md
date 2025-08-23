# 🚀 Vercel Deployment Guide for Veritas

## 📋 **Prerequisites**

Before deploying to Vercel, ensure you have:

- ✅ **GitHub Repository** - Your code is pushed to [https://github.com/Wanderlusst/veritas](https://github.com/Wanderlusst/veritas)
- ✅ **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
- ✅ **MongoDB Atlas** - Database configured and accessible
- ✅ **Environment Variables** - Production secrets ready

---

## 🔧 **Step 1: Connect GitHub to Vercel**

### **1.1 Import Repository**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Choose **"Wanderlusst/veritas"** from the list
5. Click **"Import"**

### **1.2 Configure Project Settings**
```
Project Name: veritas
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm ci --only=production
```

---

## 🔐 **Step 2: Configure Environment Variables**

### **2.1 Required Environment Variables**
In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veritas?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-minimum-32-characters
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### **2.2 Environment Variable Setup**
1. **Production Environment**: Add all variables
2. **Preview Environment**: Add all variables
3. **Development Environment**: Add all variables

---

## 🚀 **Step 3: Deploy with GitHub Actions**

### **3.1 Set GitHub Secrets**
Go to your GitHub repository → **Settings → Secrets and variables → Actions** and add:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id_here
VERCEL_PROJECT_ID=your_vercel_project_id_here

# Application Secrets
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veritas?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-super-secret-key-here-minimum-32-characters
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Docker Hub (Optional)
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password

# Security (Optional)
SNYK_TOKEN=your_snyk_token_here
```

### **3.2 Get Vercel Credentials**
1. **VERCEL_TOKEN**: Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. **VERCEL_ORG_ID**: Found in project settings
3. **VERCEL_PROJECT_ID**: Found in project settings

### **3.3 Automatic Deployment**
Once secrets are configured:
- **Push to `main` branch** → Automatic deployment to production
- **Push to `develop` branch** → Automatic deployment to preview
- **Pull Request** → Automatic testing and preview deployment

---

## 🔄 **Step 4: Manual Deployment (Alternative)**

### **4.1 Install Vercel CLI**
```bash
npm i -g vercel
```

### **4.2 Login to Vercel**
```bash
vercel login
```

### **4.3 Deploy**
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 📱 **Step 5: Custom Domain Setup**

### **5.1 Add Custom Domain**
1. Go to **Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `veritas.com`)
4. Follow DNS configuration instructions

### **5.2 DNS Configuration**
Add these records to your domain provider:

```dns
# A Record
@ 76.76.19.36

# CNAME Record
www CNAME cname.vercel-dns.com

# TXT Record (for verification)
@ TXT vercel-verification=your_verification_code
```

---

## 🔍 **Step 6: Post-Deployment Verification**

### **6.1 Check Application**
- ✅ **Homepage loads** - [https://your-domain.vercel.app](https://your-domain.vercel.app)
- ✅ **Authentication works** - Login/Register functionality
- ✅ **Rich text editor** - Blog creation and editing
- ✅ **Mobile navigation** - Responsive design
- ✅ **API endpoints** - All routes working

### **6.2 Performance Check**
- ✅ **Lighthouse Score** - Run in Chrome DevTools
- ✅ **Core Web Vitals** - Check Vercel Analytics
- ✅ **Bundle Size** - Verify optimization

### **6.3 Security Check**
- ✅ **HTTPS enforced** - SSL certificate active
- ✅ **Security headers** - Check browser dev tools
- ✅ **Environment variables** - No secrets exposed

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Check build logs in Vercel dashboard
# Verify all environment variables are set
# Ensure Node.js 18+ compatibility
```

#### **Database Connection Issues**
```bash
# Verify MongoDB Atlas network access
# Check connection string format
# Ensure database user permissions
```

#### **Authentication Problems**
```bash
# Verify NEXTAUTH_SECRET is set
# Check NEXTAUTH_URL matches deployment URL
# Ensure OAuth providers are configured
```

### **Debug Commands**
```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs your-deployment-url

# Rollback to previous version
vercel rollback
```

---

## 📊 **Monitoring & Analytics**

### **Vercel Analytics**
- **Performance Metrics** - Core Web Vitals
- **Real User Monitoring** - User experience data
- **Error Tracking** - Automatic error reporting

### **Custom Monitoring**
```bash
# Health check endpoint
GET /api/health

# Performance monitoring
GET /api/performance

# Error logging
POST /api/logs
```

---

## 🔄 **Continuous Deployment Workflow**

### **Development Workflow**
1. **Create feature branch** from `develop`
2. **Make changes** and test locally
3. **Push to feature branch** → Preview deployment
4. **Create Pull Request** → Automatic testing
5. **Merge to develop** → Staging deployment
6. **Merge to main** → Production deployment

### **Deployment Pipeline**
```
Feature Branch → Develop → Main
     ↓            ↓        ↓
  Preview    → Staging → Production
```

---

## 🎯 **Success Checklist**

- ✅ **Repository connected** to Vercel
- ✅ **Environment variables** configured
- ✅ **GitHub Actions** secrets set
- ✅ **Automatic deployment** working
- ✅ **Custom domain** configured (optional)
- ✅ **SSL certificate** active
- ✅ **Application functional** in production
- ✅ **Performance optimized**
- ✅ **Security headers** active
- ✅ **Monitoring** configured

---

## 🚀 **Go Live!**

Your Veritas application is now deployed on Vercel with:

- **Automatic CI/CD** via GitHub Actions
- **Production optimization** and security
- **Global CDN** for fast loading
- **Automatic scaling** and monitoring
- **Zero-downtime deployments**

**🎉 Congratulations! Veritas is now live on Vercel!**

---

## 📚 **Additional Resources**

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/docs/deployment#vercel)
- [GitHub Actions](https://docs.github.com/en/actions)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)

**Need help?** Check the deployment logs in Vercel dashboard or GitHub Actions!
