'use client';
import css from '@/components/EditProfilePage/EditProfilePage.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const EditProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<User>();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    getMe()
      .then((user) => setUserData(user))
      .catch(() => setError('Unable to load profile'));
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setError('');
    const username = formData.get('username') as string;
    if (!username || !userData) return;

    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push('/profile');
    } catch {
      setError('Unable to save changes');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {userData?.avatar && (
          <Image
            src={userData.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={userData?.username}
            />
          </div>

          <p>Email: {userData?.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;
