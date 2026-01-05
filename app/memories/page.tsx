'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MemoryStorage } from '@/utils/memoryStorage';
import { Memory } from '@/types/memory';
import {
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  PlayIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function MemoriesPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = () => {
    const loaded = MemoryStorage.getMemories();
    setMemories(loaded);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      MemoryStorage.deleteMemory(id);
      loadMemories();
    }
  };

  const handleStartExercise = (memoryId: string) => {
    router.push(`/exercise?memory=${memoryId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 acrylic border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0078D4] flex items-center justify-center shadow-lg">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Memories</h1>
                <p className="text-xs text-gray-500">Walk through your memories</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/memories/new')}
              className="px-4 py-2 bg-[#0078D4] text-white rounded-xl hover:bg-[#106EBE] transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>New Memory</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {memories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <PhotoIcon className="w-12 h-12 text-[#0078D4]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No memories yet</h2>
            <p className="text-gray-600 mb-8">
              Create your first memory world to walk through during exercises
            </p>
            <button
              onClick={() => router.push('/memories/new')}
              className="px-6 py-3 bg-[#0078D4] text-white rounded-xl hover:bg-[#106EBE] transition-all"
            >
              Create Memory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="ms-card p-6 hover:scale-[1.02] transition-transform cursor-pointer"
                onClick={() => handleStartExercise(memory.id)}
              >
                {memory.photos.length > 0 && (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                    <img
                      src={memory.photos[0]}
                      alt={memory.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(memory.id);
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{memory.name}</h3>
                {memory.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {memory.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {memory.photos.length} photo{memory.photos.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartExercise(memory.id);
                    }}
                    className="px-4 py-2 bg-[#0078D4] text-white rounded-lg hover:bg-[#106EBE] transition-all flex items-center gap-2 text-sm"
                  >
                    <PlayIcon className="w-4 h-4" />
                    <span>Start Exercise</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

