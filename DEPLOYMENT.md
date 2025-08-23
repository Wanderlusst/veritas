# 🚀 Veritas - Production Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `env.production.example` to `.env.local`
- [ ] Set `MONGODB_URI` to your production database
- [ ] Generate a strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Configure OAuth providers if using social login

### 2. Database Setup
- [ ] MongoDB Atlas cluster configured
- [ ] Database user with proper permissions
- [ ] Network access configured (IP whitelist)
- [ ] Connection string tested

### 3. Domain & SSL
- [ ] Domain configured and pointing to your server
- [ ] SSL certificate installed (Let's Encrypt recommended)
- [ ] HTTPS redirect configured

## 🏗️ Build Process

### Local Build (for testing)
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test production build locally
npm run start
```

### Production Build
```bash
# Clean install
rm -rf node_modules package-lock.json
npm ci --only=production

# Build for production
npm run build
```

## 🐳 Docker Deployment (Recommended)

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
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
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🌐 Nginx Configuration

### Nginx Config
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Security Checklist

### Environment Security
- [ ] All sensitive data in environment variables
- [ ] No hardcoded secrets in code
- [ ] Production database credentials secure
- [ ] OAuth secrets properly configured

### Application Security
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms

### Server Security
- [ ] Firewall configured
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Monitoring and logging enabled

## 📊 Performance Optimization

### Build Optimizations
- [ ] Bundle analyzer run (`npm run build --analyze`)
- [ ] Image optimization enabled
- [ ] Code splitting configured
- [ ] Tree shaking enabled

### Runtime Optimizations
- [ ] Database indexes created
- [ ] Caching strategy implemented
- [ ] CDN configured for static assets
- [ ] Compression enabled

## 🚀 Deployment Commands

### Quick Deploy
```bash
# Build and deploy
npm run build
npm run start

# Or with PM2
pm2 start npm --name "veritas" -- start
pm2 save
pm2 startup
```

### Docker Deploy
```bash
# Build and run
docker build -t veritas .
docker run -d -p 3000:3000 --env-file .env.local veritas

# Or with docker-compose
docker-compose up -d
```

## 📝 Post-Deployment Checklist

- [ ] Application accessible via domain
- [ ] HTTPS working correctly
- [ ] Database connection successful
- [ ] Authentication working
- [ ] Rich text editor functional
- [ ] Mobile navigation working
- [ ] All forms submitting correctly
- [ ] Error pages displaying properly
- [ ] Performance metrics acceptable
- [ ] Monitoring alerts configured

## 🆘 Troubleshooting

### Common Issues
1. **Build fails**: Check Node.js version (18+ required)
2. **Database connection**: Verify MongoDB URI and network access
3. **Authentication errors**: Check NEXTAUTH_SECRET and OAuth config
4. **Performance issues**: Run bundle analyzer and optimize imports

### Support
- Check application logs: `docker logs <container_id>`
- Monitor server resources: `htop`, `df -h`
- Test database connection: `mongosh <connection_string>`

## 🎯 Production Ready Features

✅ **Security Headers** - XSS protection, frame options, content type  
✅ **Image Optimization** - WebP/AVIF support, caching  
✅ **Bundle Optimization** - Code splitting, tree shaking  
✅ **Performance** - Compression, standalone output  
✅ **Monitoring** - Health checks, logging  
✅ **Scalability** - Docker ready, environment configurable  

Your Veritas application is now production-ready! 🚀✨
