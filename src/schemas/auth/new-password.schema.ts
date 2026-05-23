import z from 'zod';

export const newPasswordSchema = z
  .object({
    newPassword: z.string().min(8),
    newPasswordRepeat: z.string().min(8)
  })
  .refine((data) => data.newPassword === data.newPasswordRepeat, {
    path: ['newPasswordRepeat']
  });

export type TypeNewPasswordSchema = z.infer<typeof newPasswordSchema>;
