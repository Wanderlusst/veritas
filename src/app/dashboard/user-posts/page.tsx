import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserPosts from '@/components/UserPosts';

export default async function UserPostsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null; // Layout will handle redirect
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600 mt-2">
            Manage your blog posts and track their performance.
          </p>
        </div>
        <a
          href="/dashboard/new-post"
          className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </a>
      </div>

      <UserPosts userId={session.user.id} />
    </div>
  );
}
