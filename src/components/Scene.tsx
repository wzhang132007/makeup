import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { FoliagePoints } from './FoliagePoints';
import { Ornaments } from './Ornaments';
import { Lights } from './Lights';

export function Scene() {
  return (
    <Canvas
      camera={{
        position: [0, 4, 20],
        fov: 50,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      {/* 颜色管理 */}
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 10, 50]} />

      {/* 灯光系统 */}
      <Lights />

      {/* 环境贴图
          注意：这里使用preset，实际项目中可以替换为自定义HDRI路径
          例如：<Environment files="/path/to/your/hdri.hdr" />
      */}
      <Environment preset="night" />

      {/* 主要3D元素 */}
      <FoliagePoints />
      <Ornaments />

      {/* 地面反射（可选） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#111111"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* 相机控制 */}
      <OrbitControls
        enablePan={false}
        minDistance={10}
        maxDistance={40}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />

      {/* 后期处理效果 */}
      <EffectComposer>
        {/* Bloom光晕 - 可调整参数 */}
        <Bloom
          intensity={1.2} // 强度
          luminanceThreshold={0.8} // 亮度阈值
          luminanceSmoothing={0.9}
          mipmapBlur
        />

        {/* 暗角效果 */}
        <Vignette
          offset={0.3}
          darkness={0.5}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />

        {/* 色差效果（轻微） */}
        <ChromaticAberration
          offset={[0.001, 0.001]}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Canvas>
  );
}
