/**
 * World Generator - Free alternatives for 3D world generation
 * 
 * Options:
 * 1. Direct 360° image upload (no API needed) - RECOMMENDED
 * 2. Replicate API (free tier available)
 * 3. Hugging Face Inference API (free tier available)
 */

const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN || '';
const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || '';

export interface WorldGenerationResult {
  success: boolean;
  worldUrl?: string;
  error?: string;
  type: 'panorama' | '3d-scene';
}

/**
 * Generate a 360° panorama using Replicate API (free tier available)
 * Uses Stable Diffusion for panorama generation
 */
export async function generateWorldFromPrompt(
  prompt: string
): Promise<WorldGenerationResult> {
  // Option 1: Replicate API (free tier available)
  if (REPLICATE_API_TOKEN) {
    return generateWithReplicate(prompt);
  }
  
  // Option 2: Hugging Face (free tier available)
  if (HUGGINGFACE_API_KEY) {
    return generateWithHuggingFace(prompt);
  }

  // No API keys - return error with helpful message
  return {
    success: false,
    error: 'No API key configured. You can upload a 360° image directly instead.',
    type: 'panorama',
  };
}

/**
 * Generate using Replicate API (free tier: ~$5 credit)
 * Get token from: https://replicate.com/account/api-tokens
 */
async function generateWithReplicate(prompt: string): Promise<WorldGenerationResult> {
  try {
    // Using Stable Diffusion XL for panoramas
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: {
          prompt: `${prompt}, 360 panorama, equirectangular, 2:1 aspect ratio`,
          negative_prompt: 'low quality, distorted, blurry',
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Replicate API error');
    }

    const data = await response.json();
    const predictionId = data.id;

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          },
        }
      );

      const statusData = await statusResponse.json();

      if (statusData.status === 'succeeded' && statusData.output?.[0]) {
        return {
          success: true,
          worldUrl: statusData.output[0],
          type: 'panorama',
        };
      }

      if (statusData.status === 'failed') {
        throw new Error('Generation failed');
      }

      attempts++;
    }

    throw new Error('Generation timed out');
  } catch (error) {
    console.error('Replicate API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: 'panorama',
    };
  }
}

/**
 * Generate using Hugging Face Inference API (free tier available)
 * Get key from: https://huggingface.co/settings/tokens
 */
async function generateWithHuggingFace(prompt: string): Promise<WorldGenerationResult> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${prompt}, 360 panorama, equirectangular, 2:1 aspect ratio`,
          parameters: {
            num_inference_steps: 50,
            guidance_scale: 7.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${errorText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    return {
      success: true,
      worldUrl: imageUrl,
      type: 'panorama',
    };
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: 'panorama',
    };
  }
}

/**
 * Create a prompt from photo description
 */
export function createPromptFromDescription(
  description: string,
  location?: string,
  era?: string
): string {
  let prompt = description;
  
  if (location) {
    prompt += ` in ${location}`;
  }
  
  if (era) {
    prompt += `, ${era}`;
  }
  
  prompt += ', peaceful, nostalgic, photorealistic, 360 panorama, equirectangular';
  
  return prompt;
}

/**
 * Validate if an uploaded file is a 360° panorama
 * Checks file type and optionally dimensions
 */
export function validatePanoramaImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please upload an image file' };
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'Image size must be less than 10MB' };
  }

  return { valid: true };
}

/**
 * Convert uploaded image to data URL for storage
 */
export function imageToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
