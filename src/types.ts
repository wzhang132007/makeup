import * as THREE from 'three';

export type TreeState = 'CHAOS' | 'FORMED';

export type ColorTheme = 'classic' | 'techBlue' | 'luxury';

export interface ParticleData {
  chaosPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  size: number;
  color: THREE.Color;
}

export interface OrnamentData {
  chaosPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  scale: number;
  color: THREE.Color;
  rotationSpeed: number;
  floatAmplitude: number;
  floatSpeed: number;
}

export interface AppState {
  treeState: TreeState;
  progress: number;
  isTransitioning: boolean;
  colorTheme: ColorTheme;
  toggleState: () => void;
  setColorTheme: (theme: ColorTheme) => void;
}
