import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null; // Layout will handle redirect
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Update your personal information and manage your account settings.
        </p>
      </div>

      <ProfileForm user={session.user} />
    </div>
  );
}
