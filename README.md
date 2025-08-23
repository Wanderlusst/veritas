# FairCode Blog

A modern, production-grade blog application built with Next.js 14, MongoDB Atlas, NextAuth.js, and Tailwind CSS.

## 🚀 Features

- **Authentication & User Management**
  - User registration and login with NextAuth.js
  - Role-based access control (Admin/User)
  - Secure password hashing with bcrypt
  - JWT-based sessions

- **Blog Management**
  - Full CRUD operations for blog posts
  - Rich text content support
  - Author attribution and timestamps
  - Automatic excerpt generation

- **User Experience**
  - Responsive design with Tailwind CSS
  - Search and filter functionality
  - Pagination for blog listings
  - Clean, modern UI

- **Security**
  - Protected API routes
  - Session-based authentication
  - Role-based permissions
  - Input validation and sanitization

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Credentials provider
- **Database**: MongoDB with Mongoose ODM
- **Password Hashing**: bcryptjs
- **Deployment**: Vercel (Frontend) + MongoDB Atlas (Database)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── dashboard/     # Main dashboard
│   │   ├── new-post/      # Create new post
│   │   └── edit-post/     # Edit existing post
│   ├── (public)/          # Public pages
│   │   └── blog/          # Blog listing and detail
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── posts/         # Blog post CRUD
│   │   └── users/         # User management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── layouts/           # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # UI components
├── lib/                   # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # MongoDB connection
│   └── utils.ts           # Helper functions
├── models/                 # Mongoose models
│   ├── User.ts            # User schema
│   └── Post.ts            # Post schema
└── types/                  # TypeScript definitions
    └── next-auth.d.ts     # NextAuth types
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd faircode-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/faircode-blog?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Generate NextAuth secret**
   ```bash
   openssl rand -base64 32
   ```
   Use this output as your `NEXTAUTH_SECRET`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. Create a MongoDB Atlas account at [mongodb.com](https://mongodb.com)
2. Create a new cluster (free tier available)
3. Set up database access with a username and password
4. Configure network access (allow all IPs for development: 0.0.0.0/0)
5. Get your connection string and add it to `.env.local`

### Database Models

The application uses two main models:

- **User**: Stores user authentication and profile information
- **Post**: Stores blog post content with author references

## 🔐 Authentication

### User Roles

- **User**: Can create, edit, and delete their own posts
- **Admin**: Can manage all posts and users

### Security Features

- Password hashing with bcrypt (12 rounds)
- JWT-based sessions
- Protected API routes
- Role-based access control
- Input validation and sanitization

## 📝 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Users
- `POST /api/users/register` - User registration
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password

### Posts
- `GET /api/posts` - Get all posts (public)
- `POST /api/posts` - Create new post (authenticated)
- `GET /api/posts/[id]` - Get single post (public)
- `PUT /api/posts/[id]` - Update post (author/admin only)
- `DELETE /api/posts/[id]` - Delete post (author/admin only)
- `GET /api/posts/my-posts` - Get user's posts (authenticated)

## 🎨 Styling

The application uses Tailwind CSS for styling with:

- Responsive design
- Modern UI components
- Consistent color scheme
- Hover effects and transitions
- Mobile-first approach

## 🚀 Deployment

### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Database (MongoDB Atlas)

- Use the same MongoDB Atlas cluster
- Ensure network access allows Vercel's IP ranges
- Monitor database performance and usage

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Create, edit, and delete blog posts
- [ ] Role-based access control
- [ ] Profile updates
- [ ] Password changes
- [ ] Search and pagination
- [ ] Responsive design
- [ ] Error handling

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent folder structure
- Reusable components

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Considerations

- All API routes are protected where necessary
- User input is validated and sanitized
- Passwords are hashed using industry-standard bcrypt
- JWT tokens are used for session management
- Role-based access control prevents unauthorized actions

## 🚀 Performance Optimizations

- Server-side rendering with Next.js
- Optimized database queries
- Efficient pagination
- Lazy loading where appropriate
- Optimized images and assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas is accessible
4. Check network connectivity

## 🎯 Roadmap

Future enhancements could include:

- [ ] Comment system
- [ ] Rich text editor
- [ ] Image uploads
- [ ] Social media integration
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] User avatars
- [ ] Blog categories and tags

---

**Built with ❤️ using Next.js, MongoDB, and NextAuth.js**
