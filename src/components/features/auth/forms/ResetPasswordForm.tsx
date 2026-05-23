'use client';

import { useResetPasswordMutation } from '@/graphql/generated/output';
import {
  resetPasswordSchema,
  type TypeResetPasswordSchema
} from '@/schemas/auth/reset-password.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AuthWrapper } from '../AuthWrapper';
import {
  Field,
  FieldDescription,
  FieldLabel
} from '@/components/ui/common/Field';
import { Input } from '@/components/ui/common/Input';
import { Button } from '@/components/ui/common/Button';
import { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/common/Alert';
import { CircleCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ResetPasswordForm() {
  const t = useTranslations('auth.resetPassword');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<TypeResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const [resetPassword, { loading }] = useResetPasswordMutation({
    onCompleted() {
      setIsSuccess(true);
      toast.success(t('successMessage'));
    },
    onError() {
      toast.error(t('errorMessage'));
    }
  });

  const { isValid } = form.formState;

  function onSubmit(data: TypeResetPasswordSchema) {
    resetPassword({ variables: { data } });
  }

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref="/account/login"
    >
      {isSuccess ? (
        <Alert>
          <CircleCheck className="size-4" />
          <AlertTitle>{t('successAlertTitle')}</AlertTitle>
          <AlertDescription>{t('successAlertDescription')}</AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <Field>
                <FieldLabel>{t('emailLabel')}</FieldLabel>
                <Input
                  placeholder="john.doe@example.com"
                  {...field}
                  type="email"
                  disabled={loading}
                />
                <FieldDescription>{t('emailDescription')}</FieldDescription>
              </Field>
            )}
          />
          <Button
            className="mt-2 w-full"
            disabled={!isValid || loading}
            type="submit"
          >
            {t('submitButton')}
          </Button>
        </form>
      )}
    </AuthWrapper>
  );
}
