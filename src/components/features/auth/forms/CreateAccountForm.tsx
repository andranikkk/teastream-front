'use client';

import {
  Field,
  FieldDescription,
  FieldLabel
} from '@/components/ui/common/Field';
import { AuthWrapper } from '../AuthWrapper';
import {
  createAccountSchema,
  TypeCreateAccountSchema
} from '@/schemas/auth/create-account.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/common/Input';
import { Button } from '@/components/ui/common/Button';
import { useCreateUserMutation } from '@/graphql/generated/output';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function CreateAccountForm() {
  const t = useTranslations('auth.register');
  const router = useRouter();

  const form = useForm<TypeCreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  const [create, { loading }] = useCreateUserMutation({
    onCompleted() {
      toast.success(t('successAlertTitle'));
      router.push('/account/verify');
    },
    onError() {
      toast.error(t('errorMessage'));
    }
  });

  const { isValid } = form.formState;

  function onSubmit(data: TypeCreateAccountSchema) {
    create({ variables: { data } });
  }

  return (
    <AuthWrapper
      heading={t('heading')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref="/account/login"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
        <Controller
          control={form.control}
          name="username"
          render={({ field }) => (
            <Field>
              <FieldLabel>{t('usernameLabel')}</FieldLabel>
              <Input placeholder="John Doe" {...field} disabled={loading} />
              <FieldDescription>{t('usernameDescription')}</FieldDescription>
            </Field>
          )}
        />
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
        <Controller
          control={form.control}
          name="password"
          render={({ field }) => (
            <Field>
              <FieldLabel>{t('passwordLabel')}</FieldLabel>
              <Input
                placeholder="********"
                type="password"
                {...field}
                disabled={loading}
              />
              <FieldDescription>{t('passwordDescription')}</FieldDescription>
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
