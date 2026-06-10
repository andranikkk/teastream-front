import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/tw-merge';
import { Check } from 'lucide-react';

const channelVerifiedSizes = cva('', {
  variants: {
    size: {
      sm: 'size-3',
      default: 'size-4'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

interface ChannelVerifiedProps extends VariantProps<
  typeof channelVerifiedSizes
> {}

export function ChannelVerified({ size }: ChannelVerifiedProps) {
  return (
    <span
      className={cn(
        'bg-primary flex items-center justify-center rounded-full bg-blue-500 p-0.5',
        channelVerifiedSizes({ size })
      )}
    >
      <Check
        className={cn('stroke-[3px]', size === 'sm' ? 'size-2' : 'size-[11px]')}
      />
    </span>
  );
}
