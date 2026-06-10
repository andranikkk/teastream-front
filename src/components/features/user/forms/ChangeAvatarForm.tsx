// src/components/features/user/forms/ChangeAvatarForm.tsx
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useChangeAvatar } from '@/hooks/useChangeAvatar';
import {
  type TypeChangeAvatarSchema,
  changeAvatarSchema
} from '@/schemas/user/change-avatar.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldLabel
} from '@/components/ui/common/Field';
import { Button } from '@/components/ui/common/Button';
import { Loader, Upload, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/tw-merge';
import { useRouter } from 'next/navigation';

interface ChangeAvatarFormProps {
  onSuccess?: () => void;
}

export function ChangeAvatarForm({ onSuccess }: ChangeAvatarFormProps) {
  const t = useTranslations('dashboard.settings.changeAvatar');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { loading, changeAvatar } = useChangeAvatar();

  const form = useForm<TypeChangeAvatarSchema>({
    resolver: zodResolver(changeAvatarSchema),
    mode: 'onChange' // Валидируем при изменении
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Обновляем поле формы
    form.setValue('file', file, { shouldValidate: true });

    // Создаем preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: TypeChangeAvatarSchema) => {
    try {
      await changeAvatar(data.file);
      toast.success(t('successMessage'));

      // Сбрасываем форму
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      form.reset();

      router.refresh();
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('errorMessage');
      toast.error(errorMessage);
    }
  };

  const selectedFile = form.watch('file');
  const hasError = !!form.formState.errors.file;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader className="size-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Avatar Preview */}
          <Field>
            <FieldLabel>{t('label')}</FieldLabel>

            <div className="flex gap-6">
              {/* Preview Image */}
              <div
                className={cn(
                  'relative h-36 w-36 flex-shrink-0 overflow-hidden rounded-lg',
                  'border-2 border-dashed',
                  'flex cursor-pointer items-center justify-center',
                  'transition-colors',
                  hasError
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-100 hover:border-gray-400'
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <Image
                    src={preview!}
                    alt="user's avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Upload className="size-6" />
                    <span className="text-center text-xs">
                      {t('clickToUpload')}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <FieldDescription>{t('description')}</FieldDescription>

                  {/* Error Messages */}
                  {form.formState.errors.file && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                      <AlertCircle className="mt-0.5 size-4 flex-shrink-0" />
                      <span>{form.formState.errors.file.message}</span>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex w-1/2 flex-col gap-2">
                  {selectedFile ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                    >
                      {t('changeImage')}
                    </Button>
                  ) : preview ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                    >
                      {t('changeImage')}
                    </Button>
                  ) : null}
                  {selectedFile && form.formState.isValid && (
                    <Button type="submit" disabled={loading}>
                      {t('submitButton')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Field>

          {/* File Input (hidden) */}
          <Controller
            control={form.control}
            name="file"
            render={() => (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleFileSelect}
                disabled={loading}
                className="hidden"
                aria-label="Avatar file input"
              />
            )}
          />
        </>
      )}
    </form>
  );
}
