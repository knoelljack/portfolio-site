'use client';

import { NeuralBackground } from '@/components/ui/neural-background';

export function BackgroundWrapper() {
  return <NeuralBackground hue={200} saturation={0.8} chroma={0.6} />;
}
