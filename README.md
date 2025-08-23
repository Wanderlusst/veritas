# Postify

A modern, minimalist blog platform built with Next.js, designed for writers to share their stories, insights, and perspectives with the world.

## ✨ Features

- **Modern Design**: Clean, minimalist UI inspired by Medium
- **Rich Text Editor**: Powerful Tiptap-based editor with formatting tools
- **User Authentication**: Secure login/signup with NextAuth.js
- **Responsive Design**: Mobile-optimized for all devices
- **Real-time Updates**: Instant content updates and notifications
- **Search & Discovery**: Find stories and connect with writers
- **Performance Optimized**: Fast loading with SSG and caching

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- NextAuth.js configuration

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/postify.git
cd postify
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
postify/
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── (auth)/         # Authentication routes
│   │   ├── (dashboard)/    # User dashboard routes
│   │   ├── (public)/       # Public blog routes
│   │   └── api/            # API routes
│   ├── components/          # Reusable UI components
│   ├── lib/                # Utility functions
│   ├── models/             # Database models
│   └── types/              # TypeScript type definitions
├── public/                  # Static assets
└── package.json
```

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Rich Text Editor**: Tiptap
- **Deployment**: Vercel
- **State Management**: React Hooks + SWR

## 📝 Content Management

### Creating Posts
- Navigate to Dashboard → New Post
- Use the rich text editor for content creation
- Add titles, excerpts, and formatted content
- Publish instantly to your blog

### Managing Posts
- Edit existing posts with real-time preview
- Delete posts with confirmation modals
- View post analytics and engagement

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Docker
```bash
# Build the image
docker build -t postify .

# Run the container
docker run -p 3000:3000 postify
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly navigation
- Optimized loading performance
- Mobile-first approach

## 🔒 Security Features

- Secure authentication with NextAuth.js
- CSRF protection
- Input validation and sanitization
- Secure API endpoints
- Environment variable protection

## 📊 Performance

- Static Site Generation (SSG) for blog pages
- Client-side caching with SWR
- Optimized bundle sizes
- Image optimization
- Progressive Web App (PWA) ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tiptap for the powerful rich text editor
- Tailwind CSS for the utility-first styling
- NextAuth.js for secure authentication

---

**Postify** - Where stories come to life. ✨
