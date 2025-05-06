declare module '@react-three/postprocessing' {
  import { ReactNode } from 'react';

  export interface BloomProps {
    intensity?: number;
    luminanceThreshold?: number;
    luminanceSmoothing?: number;
    [key: string]: number | string | boolean | ReactNode | undefined;
  }

  export interface EffectComposerProps {
    children?: ReactNode;
    [key: string]: number | string | boolean | ReactNode | undefined;
  }

  export const Bloom: React.FC<BloomProps>;
  export const EffectComposer: React.FC<EffectComposerProps>;
} 