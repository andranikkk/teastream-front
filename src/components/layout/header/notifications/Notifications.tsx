import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/common/Popover';
import { useUnreadNotificationCountQuery } from '../../../../graphql/generated/output';
import { Bell } from 'lucide-react';
import { NotificationsList } from './NotificationsList';
export function Notifications() {
  const { data, loading } = useUnreadNotificationCountQuery();
  const count = data?.unreadNotificationCount ?? 0;

  const displayCount = count > 10 ? '+9' : count;

  if (loading) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger>
        {count !== 0 && (
          <div className="bg-primary absolute top-5 right-[63px] rounded-full px-[5px] text-xs font-semibold text-blue-500">
            {displayCount}
          </div>
        )}
        <Bell className="to-foreground size-5" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[500px] w-[320px] overflow-y-auto"
      >
        <NotificationsList />
      </PopoverContent>
    </Popover>
  );
}
