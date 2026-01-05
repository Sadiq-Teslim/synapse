'use client';

import { useRouter } from 'next/navigation';
import MemoryUpload from '@/components/MemoryUpload';
import { Memory } from '@/types/memory';
import { MemoryStorage } from '@/utils/memoryStorage';

export default function NewMemoryPage() {
  const router = useRouter();

  const handleComplete = (memory: Memory) => {
    MemoryStorage.saveMemory(memory);
    router.push('/memories');
  };

  const handleSkip = () => {
    router.push('/memories');
  };

  return <MemoryUpload onComplete={handleComplete} onSkip={handleSkip} />;
}

