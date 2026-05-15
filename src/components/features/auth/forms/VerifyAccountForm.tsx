'use client';

import { useVerifyAccountMutation } from '@/graphql/generated/output';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { AuthWrapper } from '../AuthWrapper';
import { Loader } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  TypeVerifyAccountSchema,
  verifyAccountSchema
} from '@/schemas/auth/create-account.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldDescription,
  FieldLabel
} from '@/components/ui/common/Field';
import { Input } from '@/components/ui/common/Input';
import { Button } from '@/components/ui/common/Button';

export function VerifyAccountForm() {
  const router = useRouter();

  const t = useTranslations('auth.verify');

  const form = useForm<TypeVerifyAccountSchema>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      token: ''
    }
  });

  const [verify, { loading }] = useVerifyAccountMutation({
    onCompleted() {
      toast.success(t('successMessage'));
      router.push('/dashboard/settings');
    },
    onError() {
      toast.error(t('errorMessage'));
    }
  });

  function onSubmit(data: TypeVerifyAccountSchema) {
    verify({
      variables: { data }
    });
  }

  return (
    <div className="h-screen">
      <AuthWrapper heading={t('heading')}>
        <div className="flex justify-center">
          {loading ? (
            <Loader className="size-8 animate-spin" />
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-y-3"
            >
              <Controller
                control={form.control}
                name="token"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>{t('tokenLabel')}</FieldLabel>
                    <Input placeholder={'123'} {...field} disabled={loading} />
                    <FieldDescription>{t('tokenDescription')}</FieldDescription>
                  </Field>
                )}
              />
              <Button className="mt-2 w-full" disabled={loading} type="submit">
                {t('submitButton')}
              </Button>
            </form>
          )}
        </div>
      </AuthWrapper>
    </div>
  );
}
