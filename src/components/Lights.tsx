import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Lights() {
  const pointLight1Ref = useRef<THREE.PointLight>(null);
  const pointLight2Ref = useRef<THREE.PointLight>(null);
  const pointLight3Ref = useRef<THREE.PointLight>(null);

  // 让点光源围绕树旋转
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (pointLight1Ref.current) {
      pointLight1Ref.current.position.x = Math.cos(time * 0.5) * 5;
      pointLight1Ref.current.position.z = Math.sin(time * 0.5) * 5;
    }

    if (pointLight2Ref.current) {
      pointLight2Ref.current.position.x = Math.cos(time * 0.5 + Math.PI * 2 / 3) * 5;
      pointLight2Ref.current.position.z = Math.sin(time * 0.5 + Math.PI * 2 / 3) * 5;
    }

    if (pointLight3Ref.current) {
      pointLight3Ref.current.position.x = Math.cos(time * 0.5 + Math.PI * 4 / 3) * 5;
      pointLight3Ref.current.position.z = Math.sin(time * 0.5 + Math.PI * 4 / 3) * 5;
    }
  });

  return (
    <>
      {/* 环境光 - 冷色调平衡 */}
      <ambientLight intensity={0.3} color="#B0C4DE" />

      {/* 主方向光 - 暖色调 */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        color="#FFE4B5"
        castShadow
      />

      {/* 辅助方向光 */}
      <directionalLight
        position={[-3, 5, -3]}
        intensity={0.5}
        color="#FFF8DC"
      />

      {/* 旋转点光源 - 金色 */}
      <pointLight
        ref={pointLight1Ref}
        position={[5, 2, 0]}
        intensity={0.8}
        distance={15}
        color="#FFD700"
      />

      <pointLight
        ref={pointLight2Ref}
        position={[0, 2, 5]}
        intensity={0.8}
        distance={15}
        color="#FFA500"
      />

      <pointLight
        ref={pointLight3Ref}
        position={[-5, 2, 0]}
        intensity={0.8}
        distance={15}
        color="#FFFFE0"
      />

      {/* 顶部聚光灯 */}
      <spotLight
        position={[0, 12, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={1}
        color="#FFFFFF"
        target-position={[0, 0, 0]}
      />
    </>
  );
}
