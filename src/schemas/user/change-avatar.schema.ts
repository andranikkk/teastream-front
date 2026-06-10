// src/schemas/user/change-avatar.schema.ts
import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

export const changeAvatarSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please select a file' })
    .refine((file) => file.size > 0, 'File is required')
    .refine(
      (file) => ALLOWED_TYPES.includes(file.type),
      'File format is not supported. Allowed: JPEG, JPG, WebP, GIF'
    )
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'File size is too large. Maximum 10MB'
    )
});

export type TypeChangeAvatarSchema = z.infer<typeof changeAvatarSchema>;
