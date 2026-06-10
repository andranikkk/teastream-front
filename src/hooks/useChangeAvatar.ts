import { useState } from 'react';

interface UseChangeAvatarReturn {
  loading: boolean;
  changeAvatar: (file: File) => Promise<boolean>;
}

export const useChangeAvatar = (): UseChangeAvatarReturn => {
  const [loading, setLoading] = useState(false);

  const changeAvatar = async (file: File): Promise<boolean> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';

        try {
          const errorData = await response.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Если не смогли распарсить JSON, используем дефолтное сообщение
          errorMessage = `Upload failed with status ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      await response.json(); // Читаем успешный ответ
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Avatar upload error:', message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, changeAvatar };
};
