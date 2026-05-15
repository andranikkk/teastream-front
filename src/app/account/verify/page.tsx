import { VerifyAccountForm } from '@/components/features/auth/forms/VerifyAccountForm';
import { redirect } from 'next/navigation';

export default async function VerifyAccountPage() {
  return (
    <div>
      <VerifyAccountForm />
    </div>
  );
}
