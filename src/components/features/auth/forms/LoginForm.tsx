'use client';

import { useLoginUserMutation } from '@/graphql/generated/output';
import { loginSchema, type TypeLoginSchema } from '@/schemas/auth/login.schema';
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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/common/Input-OTP';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const [isShowTwoFactor, setIsShowTwoFactor] = useState(false);
  const router = useRouter();

  const t = useTranslations('auth.login');

  const { auth } = useAuth();

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: ''
    }
  });

  const [login, { loading: isLoadingLogin }] = useLoginUserMutation({
    onCompleted(data) {
      if (data.loginUser.message) {
        setIsShowTwoFactor(true);
      } else {
        auth();
        toast.success(t('successMessage'));
        router.push('/dashboard/settings');
      }
    },
    onError() {
      toast.error(t('errorMessage'));
    }
  });

  const { isValid } = form.formState;

  function onSubmit(data: TypeLoginSchema) {
    login({
      variables: {
        data
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
        {isShowTwoFactor ? (
          <Controller
            control={form.control}
            name="pin"
            render={({ field }) => (
              <Field className="flex w-full justify-center text-center">
                <FieldLabel>{t('pinLabel')}</FieldLabel>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription>{t('pinDescription')}</FieldDescription>
              </Field>
            )}
          />
        ) : (
          <>
            <Controller
              control={form.control}
              name="login"
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t('loginLabel')}</FieldLabel>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isLoadingLogin}
                  />
                  <FieldDescription>{t('loginDescription')}</FieldDescription>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>{t('passwordLabel')}</FieldLabel>
                    <Link
                      href="/account/recovery"
                      className="ml-auto inline-block text-sm"
                    >
                      {t('forgotPassword')}
                    </Link>
                  </div>
                  <Input
                    placeholder="********"
                    {...field}
                    type="password"
                    disabled={isLoadingLogin}
                  />
                  <FieldDescription>
                    {t('passwordDescription')}
                  </FieldDescription>
                </Field>
              )}
            />
          </>
        )}
        <Button
          className="mt-2 w-full"
          disabled={!isValid || isLoadingLogin}
          type="submit"
        >
          {t('submitButton')}
        </Button>
      </form>
    </AuthWrapper>
  );
}
