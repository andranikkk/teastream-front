'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCurrent } from '@/hooks/useCurrent';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Loader, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/common/DropdownMenu';
import { ChannelAvatar } from '@/components/ui/elements/ChannelAvatar';
import Link from 'next/link';
import { useLogoutUserMutation } from '@/graphql/generated/output';
import { toast } from 'sonner';
import { Notifications } from './notifications/Notifications';
import { Hint } from '@/components/ui/elements/Hint';

export function ProfileMenu() {
  const t = useTranslations('layout.header.headerMenu.profileMenu');

  const router = useRouter();

  const { logout: exit } = useAuth();
  const { user, isLoadingProfile } = useCurrent();

  const [logout] = useLogoutUserMutation({
    onCompleted() {
      exit();
      toast.success(t('logoutSuccess'));
      router.push('/account/login');
    },
    onError() {
      toast.error(t('logoutError'));
    }
  });

  return isLoadingProfile || !user ? (
    <Loader className="text-muted-foreground size-6 animate-spin" />
  ) : (
    <>
      <Notifications />
      <DropdownMenu>
        <Hint label={user.displayName} side="bottom">
          <DropdownMenuTrigger>
            <ChannelAvatar channel={user} />
          </DropdownMenuTrigger>
        </Hint>
        <DropdownMenuContent align="end" className="w-[230px]">
          <div className="flex items-center gap-x-3 p-2">
            <ChannelAvatar channel={user} />
            <h2 className="text-foreground font-medium">{user.username}</h2>
          </div>
          <DropdownMenuSeparator />
          <Link href={`/${user.username}`}>
            <DropdownMenuItem>
              <User className="mr-2 size-4" />
              {t('channel')}
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/settings">
            <DropdownMenuItem>
              <LayoutDashboard className="mr-2 size-4" />
              {t('dashboard')}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => logout()}>
            <LogOut className="mr-2 size-4" />
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
