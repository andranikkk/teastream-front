'use client';

import { Button } from '@/components/ui/common/Button';
import { Hint } from '@/components/ui/elements/Hint';
import { useSidebar } from '@/hooks/useSidebar';
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export function SidebarHeader() {
  const t = useTranslations('layout.sidebar.header');
  const pathName = usePathname();

  const { isCollapsed, collapse, expand } = useSidebar();
  const label = isCollapsed ? t('expand') : t('collapse');

  return isCollapsed ? (
    <div className="mb-4 hidden w-full items-center justify-center pt-4 lg:flex">
      <Hint label={label} side="right">
        <Button onClick={() => expand()} variant="ghost" size="icon">
          <ArrowRightFromLine className="size-4" />
        </Button>
      </Hint>
    </div>
  ) : (
    <div className="mb-2 flex w-full items-center justify-between p-3 pl-4">
      <h2 className="to-foreground text-lg font-semibold">{t('navigation')}</h2>
      <Hint label={label} side="right">
        <Button onClick={() => collapse()} variant="ghost" size="icon">
          <ArrowLeftFromLine className="size-4" />
        </Button>
      </Hint>
    </div>
  );
}
