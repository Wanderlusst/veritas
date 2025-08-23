# Veritas

A modern, production-grade platform for sharing truth, knowledge, and authentic stories built with Next.js 14, MongoDB Atlas, NextAuth.js, and Tailwind CSS.

## Features

- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Authentication**: Secure user authentication with NextAuth.js
- **Database**: MongoDB Atlas for scalable data storage
- **Rich Text Editor**: Tiptap-based editor for creating authentic content
- **Responsive Design**: Mobile-first, responsive design
- **SEO Optimized**: Built-in SEO features and meta tags
- **Dark/Light Mode**: Theme switching capability
- **User Management**: User profiles, registration, and login
- **Content Management**: Create, edit, delete, and manage authentic stories

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd veritas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veritas?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
veritas/
├── src/
│   ├── app/                 # Next.js 14 app directory
│   │   ├── (auth)/         # Authentication routes
│   │   ├── (dashboard)/    # Dashboard routes
│   │   ├── (public)/       # Public content routes
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   ├── lib/               # Utility functions
│   ├── models/            # Database models
│   └── types/             # TypeScript types
├── public/                # Static assets
└── package.json
```

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js
- **Database**: MongoDB Atlas
- **Rich Text Editor**: Tiptap
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## Features in Detail

### Authentication System
- User registration and login
- Secure password hashing with bcrypt
- JWT-based sessions
- Protected routes

### Content Management
- Create, edit, and delete authentic stories
- Rich text editor with formatting options
- Image upload support
- Draft and publish functionality

### User Dashboard
- Personal content management
- User profile editing
- Password change functionality

### Public Platform
- Responsive content listing
- Individual story views
- Search and filtering (coming soon)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for the database service
- Tiptap for the rich text editor
