'use client';

import { useNewPasswordMutation } from '@/graphql/generated/output';
import {
  newPasswordSchema,
  type TypeNewPasswordSchema
} from '@/schemas/auth/new-password.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AuthWrapper } from '../AuthWrapper';
import {
  Field,
  FieldDescription,
  FieldLabel
} from '@/components/ui/common/Field';
import Link from 'next/link';
import { Input } from '@/components/ui/common/Input';
import { Button } from '@/components/ui/common/Button';

export function NewPasswordForm() {
  const t = useTranslations('auth.newPassword');
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const form = useForm<TypeNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: '',
      newPasswordRepeat: ''
    }
  });

  const [setNewPassword, { loading }] = useNewPasswordMutation({
    onCompleted() {
      toast.success(t('successMessage'));
      router.push('/account/login');
    },
    onError() {
      toast.error(t('errorMessage'));
    }
  });

  const { isValid } = form.formState;

  function onSubmit(data: TypeNewPasswordSchema) {
    setNewPassword({
      variables: {
        data: {
          ...data,
          token: params.token
        }
      }
    });
  }

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref={'/account/create'}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
        <Controller
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>{t('passwordLabel')}</FieldLabel>
              </div>
              <Input
                placeholder="********"
                {...field}
                type="password"
                disabled={loading}
              />
              <FieldDescription>{t('passwordDescription')}</FieldDescription>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="newPasswordRepeat"
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>{t('passwordRepeatLabel')}</FieldLabel>
              </div>
              <Input
                placeholder="********"
                {...field}
                type="password"
                disabled={loading}
              />
              <FieldDescription>
                {t('passwordRepeatDescription')}
              </FieldDescription>
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
    </AuthWrapper>
  );
}
