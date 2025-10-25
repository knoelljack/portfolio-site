'use client';

import { NeuralBackground } from '@/components/ui/neural-background';

export function BackgroundWrapper() {
  return <NeuralBackground hue={30} saturation={0.9} chroma={0.7} />;
}
