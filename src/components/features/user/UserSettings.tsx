'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/common/Tabs';
import { Heading } from '@/components/ui/elements/Heading';
import { useTranslations } from 'next-intl';

export function UserSettings() {
  const t = useTranslations('dashboard.settings');

  return (
    <div className="lg:px-10">
      <Heading
        title={t('header.heading')}
        description={t('header.description')}
        size="lg"
      />
      <Tabs defaultValue="profile" className="mt-3 w-full">
        <TabsList className="grid w-4xl grid-cols-5">
          <TabsTrigger value="profile">{t('header.profile')}</TabsTrigger>
          <TabsTrigger value="account">{t('header.account')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('header.appearance')}</TabsTrigger>
          <TabsTrigger value="notifications">
            {t('header.notifications')}
          </TabsTrigger>
          <TabsTrigger value="sessions">{t('header.sessions')}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile"></TabsContent>
        <TabsContent value="account"></TabsContent>
        <TabsContent value="appearance"></TabsContent>
        <TabsContent value="notifications"></TabsContent>
        <TabsContent value="sessions"></TabsContent>
      </Tabs>
    </div>
  );
}
