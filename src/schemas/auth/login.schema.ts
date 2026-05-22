import z from 'zod';

export const loginSchema = z.object({
  login: z.string().min(1, 'Login is required'),
  password: z.string().min(1, 'Password is required'),
  pin: z.string().optional()
});

export type TypeLoginSchema = z.infer<typeof loginSchema>;
