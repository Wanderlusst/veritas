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

### Quick Start for Admins

**Want to get admin access quickly?**

1. **Deploy the application** following the installation steps below
2. **Register your first account** at `/register`
3. **Setup admin privileges** at `/admin-setup`
4. **Access admin panel** at `/admin`
5. **Start managing your platform!**

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

## 👑 Admin Management

### Initial Admin Setup
**First-time setup only** - Use this when deploying for the first time:

1. **Register your first user account** at `/register`
2. **Visit admin setup page** at `/admin-setup`
3. **Click "Setup Admin"** button
4. **Your user will be promoted to admin** automatically
5. **Redirected to admin dashboard** at `/admin`

### Admin Panel Features
**Access**: `/admin` (Admin users only)

- **User Management**: Promote/demote users, delete accounts
- **Post Management**: View all posts, manage content
- **System Tools**: Regenerate post excerpts, maintenance utilities
- **Statistics**: User counts, post counts, admin counts

### Creating Additional Admins
**From Admin Panel** (`/admin` → User Management):

1. Navigate to Admin Panel → User Management
2. Find the user you want to promote
3. Click "Make Admin" button
4. User role will be updated immediately

### Admin API Endpoints
```
POST /api/admin/setup          # Initial admin setup
GET  /api/admin/users          # List all users
PATCH /api/admin/users/[id]/role  # Update user role
DELETE /api/admin/users/[id]   # Delete user
GET  /api/admin/posts          # List all posts
GET  /api/admin/stats          # System statistics
POST /api/posts/regenerate-excerpts  # Clean HTML from excerpts
```

### Security Features
- **Role-based access**: Only admins can access admin features
- **Self-protection**: Admins cannot remove their own admin role
- **Session validation**: All admin actions require valid admin session
- **One-time setup**: Initial admin setup can only be used once

## 📱 Mobile Optimization

## 🔒 Security Features

- Secure authentication with NextAuth.js
- CSRF protection
- Input validation and sanitization
- Secure API endpoints
- Environment variable protection
- Role-based access control (Admin/User)
- Protected admin routes and APIs

## 📊 Performance

- Static Site Generation (SSG) for blog pages
- Client-side caching with SWR
- Optimized bundle sizes
- Image optimization
- Progressive Web App (PWA) ready

## 🔧 Troubleshooting

### Common Admin Issues

**"Admin users already exist" error:**
- This means admin setup has already been completed
- Use the admin panel (`/admin`) to manage users instead
- Cannot use `/admin-setup` more than once

**"Forbidden: Admin access required" error:**
- Your user account doesn't have admin privileges
- Follow the initial admin setup process above
- Or ask an existing admin to promote your account

**Admin panel not accessible:**
- Ensure you're logged in with an admin account
- Check that your user role is set to "admin" in the database
- Clear browser cache and try again

**User role update fails:**
- Ensure you're logged in as an admin
- Check that the target user exists
- Verify the role value is either "user" or "admin"

### Database Issues

**Reset admin setup (emergency only):**
```javascript
// In MongoDB shell - DANGER: This removes all admin users!
db.users.updateMany({}, { $set: { role: "user" } })
```

**Check user roles:**
```javascript
// In MongoDB shell
db.users.find({}, { email: 1, role: 1, createdAt: 1 })
```

## 🤝 Contributing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tiptap for the powerful rich text editor
- Tailwind CSS for the utility-first styling
- NextAuth.js for secure authentication

---

**Postify** - Where stories come to life. ✨
