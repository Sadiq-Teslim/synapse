'use client';

import { FormQuality } from '@/types';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface FeedbackIndicatorProps {
  formQuality: FormQuality;
  message: string;
}

export default function FeedbackIndicator({ formQuality, message }: FeedbackIndicatorProps) {
  const config = {
    [FormQuality.EXCELLENT]: {
      bg: 'from-green-500 to-emerald-600',
      Icon: CheckCircleIcon,
      label: 'Excellent',
    },
    [FormQuality.GOOD]: {
      bg: 'from-amber-500 to-orange-600',
      Icon: ExclamationTriangleIcon,
      label: 'Good',
    },
    [FormQuality.POOR]: {
      bg: 'from-red-500 to-rose-600',
      Icon: ExclamationCircleIcon,
      label: 'Adjust',
    },
  };

  const { bg, Icon, label } = config[formQuality];

  return (
    <div className={`inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r ${bg} text-white rounded-xl shadow-lg backdrop-blur-sm`}>
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-medium opacity-80">{label}</p>
        <p className="font-semibold">{message}</p>
      </div>
    </div>
  );
}
