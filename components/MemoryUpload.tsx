'use client';

import { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon, SparklesIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Memory } from '@/types/memory';
import { v4 as uuidv4 } from 'uuid';
import { 
  generateWorldFromPrompt, 
  createPromptFromDescription,
  validatePanoramaImage,
  imageToDataURL
} from '@/utils/worldGenerator';

interface MemoryUploadProps {
  onComplete: (memory: Memory) => void;
  onSkip?: () => void;
}

export default function MemoryUpload({ onComplete, onSkip }: MemoryUploadProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [panoramaImage, setPanoramaImage] = useState<string | null>(null);
  const [generationMethod, setGenerationMethod] = useState<'upload' | 'ai'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panoramaInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPhotos(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handlePanoramaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePanoramaImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const dataUrl = await imageToDataURL(file);
      setPanoramaImage(dataUrl);
      setGenerationMethod('upload');
    } catch (error) {
      console.error('Error loading panorama:', error);
      alert('Error loading image');
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim() || photos.length === 0) {
      alert('Please provide a name and at least one photo');
      return;
    }

    setIsGenerating(true);

    const memory: Memory = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim() || undefined,
      photos,
      createdAt: new Date(),
    };

    // Option 1: Use uploaded 360° panorama (FREE, NO API NEEDED)
    if (panoramaImage) {
      memory.worldUrl = panoramaImage;
    } 
    // Option 2: Generate using AI (requires API key)
    else if (generationMethod === 'ai' && description.trim()) {
      try {
        const prompt = createPromptFromDescription(description.trim());
        const worldResult = await generateWorldFromPrompt(prompt);
        
        if (worldResult.success && worldResult.worldUrl) {
          memory.worldUrl = worldResult.worldUrl;
        } else {
          console.warn('World generation failed:', worldResult.error);
          // Continue without world URL
        }
      } catch (error) {
        console.error('Error generating world:', error);
        // Continue without world URL
      }
    }

    setIsGenerating(false);
    onComplete(memory);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0078D4]">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full">
          <div className="fluent-card bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0078D4] flex items-center justify-center">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Your Memory World</h2>
                <p className="text-gray-600">Upload photos of a meaningful place to walk through during exercises</p>
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memory Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Childhood Village"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this place... (helps AI generate a better 3D world)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Photo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos <span className="text-red-500">*</span> (5-10 recommended)
              </label>
              
              {photos.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#0078D4] hover:bg-blue-50/50 transition-all"
                >
                  <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Click to upload photos</p>
                  <p className="text-sm text-gray-500">Upload 5-10 photos of the same location</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 10 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#0078D4] transition-all flex items-center justify-center"
                    >
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {/* Generation Method Toggle (if no panorama uploaded) */}
            {!panoramaImage && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  World Generation Method
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setGenerationMethod('upload')}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                      generationMethod === 'upload'
                        ? 'border-[#0078D4] bg-[#0078D4] text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">Skip for Now</div>
                    <div className="text-xs opacity-80">Add manually later</div>
                  </button>
                  <button
                    onClick={() => setGenerationMethod('ai')}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                      generationMethod === 'ai'
                        ? 'border-[#0078D4] bg-[#0078D4] text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">AI Generate</div>
                    <div className="text-xs opacity-80">Needs API key</div>
                  </button>
                </div>
                {generationMethod === 'ai' && (
                  <p className="text-xs text-gray-600 mt-3">
                    💡 <strong>Free option:</strong> Use Replicate API (free tier available) or Hugging Face (free tier)
                  </p>
                )}
              </div>
            )}

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-gray-700">
                <strong>💡 Recommended:</strong> Upload a 360° panorama image directly (FREE, no API needed). 
                You can find free panoramas at 360Cities.net or create one with apps like Google Street View.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="flex-1 px-6 py-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Skip for now
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || photos.length === 0 || isGenerating}
                className="flex-1 px-6 py-4 bg-[#0078D4] text-white rounded-xl hover:bg-[#106EBE] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isGenerating ? 'Creating World...' : 'Create Memory World'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

