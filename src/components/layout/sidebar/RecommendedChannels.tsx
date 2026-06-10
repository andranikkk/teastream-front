'use client';

import { Separator } from '@/components/ui/common/Separator';
import { useFindRecommendedChannelsQuery } from '@/graphql/generated/output';
import { useSidebar } from '@/hooks/useSidebar';
import { useTranslations } from 'next-intl';
import { ChannelItem, ChannelItemSkeleton } from './ChannelItem';

export function RecommendedChannels() {
  const t = useTranslations('layout.sidebar.recommended');

  const { data, loading } = useFindRecommendedChannelsQuery();
  const channels = data?.findRecommendedChannels ?? [];

  const { isCollapsed } = useSidebar();

  return (
    <div className="">
      <Separator className="mb-3" />
      {!isCollapsed && (
        <h2 className="text-foreground mb-2 px-3 text-lg font-semibold">
          {t('heading')}
        </h2>
      )}
      {loading
        ? Array.from({ length: 7 }).map((_, index) => (
            <ChannelItemSkeleton key={index} />
          ))
        : channels.map((channel, index) => (
            <ChannelItem key={index} channel={channel} />
          ))}
    </div>
  );
}
