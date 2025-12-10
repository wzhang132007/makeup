import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { OrnamentData } from '../types';

// 可调整参数
const GIFTS_COUNT = 15; // 礼物盒数量
const BALLS_COUNT = 40; // 彩球数量
const LIGHTS_COUNT = 60; // 小灯泡数量

// 生成树上的目标位置（圆锥形分布）
function generateTreePosition(heightRatio: number, spread: number = 1): THREE.Vector3 {
  const y = heightRatio * 5.5 - 0.8;
  const radius = (1 - heightRatio) * 2.2 * spread;
  const angle = Math.random() * Math.PI * 2;

  return new THREE.Vector3(
    Math.cos(angle) * radius,
    y,
    Math.sin(angle) * radius
  );
}

// 生成混沌位置
function generateChaosPosition(): THREE.Vector3 {
  const radius = 6 + Math.random() * 6;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta) - 1,
    radius * Math.cos(phi)
  );
}

// 礼物盒组件
export function GiftBoxes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { treeState, colorTheme } = useStore();

  const ornamentsData = useMemo<OrnamentData[]>(() => {
    const data: OrnamentData[] = [];

    for (let i = 0; i < GIFTS_COUNT; i++) {
      // 礼物主要放在底部
      const heightRatio = Math.random() * 0.25;

      // 金色和红色混合
      const colors = [
        new THREE.Color(0xFFD700), // 金色
        new THREE.Color(0xFF0000), // 红色
        new THREE.Color(0xC41E3A), // 深红
      ];

      data.push({
        chaosPosition: generateChaosPosition(),
        targetPosition: generateTreePosition(heightRatio, 1.2),
        scale: 0.15 + Math.random() * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotationSpeed: 0.2 + Math.random() * 0.3,
        floatAmplitude: 0.3,
        floatSpeed: 0.5 + Math.random() * 0.5,
      });
    }

    return data;
  }, [colorTheme]);

  // 初始化矩阵
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const targetProgress = treeState === 'FORMED' ? 1 : 0;
    const time = state.clock.elapsedTime;

    ornamentsData.forEach((ornament, i) => {
      // 插值位置
      const currentPos = new THREE.Vector3().lerpVectors(
        ornament.chaosPosition,
        ornament.targetPosition,
        THREE.MathUtils.lerp(
          meshRef.current!.userData[`progress_${i}`] || 0,
          targetProgress,
          0.04
        )
      );

      meshRef.current!.userData[`progress_${i}`] = THREE.MathUtils.lerp(
        meshRef.current!.userData[`progress_${i}`] || 0,
        targetProgress,
        0.04
      );

      // 在CHAOS状态添加漂浮
      if (treeState === 'CHAOS') {
        currentPos.y += Math.sin(time * ornament.floatSpeed + i) * ornament.floatAmplitude;
      }

      dummy.position.copy(currentPos);
      dummy.rotation.y = time * ornament.rotationSpeed;
      dummy.scale.setScalar(ornament.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, GIFTS_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.6}
        roughness={0.3}
        emissive="#FFD700"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}

// 彩球组件
export function ColorBalls() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { treeState, colorTheme } = useStore();

  const ornamentsData = useMemo<OrnamentData[]>(() => {
    const data: OrnamentData[] = [];

    // 彩球颜色方案
    const luxuryColors = [
      new THREE.Color(0xFFD700), // 金
      new THREE.Color(0xFF4444), // 红
      new THREE.Color(0x44AAFF), // 蓝
      new THREE.Color(0xC0C0C0), // 银
      new THREE.Color(0xFF69B4), // 粉
    ];

    for (let i = 0; i < BALLS_COUNT; i++) {
      const heightRatio = 0.2 + Math.random() * 0.7;

      data.push({
        chaosPosition: generateChaosPosition(),
        targetPosition: generateTreePosition(heightRatio, 0.9),
        scale: 0.08 + Math.random() * 0.06,
        color: luxuryColors[Math.floor(Math.random() * luxuryColors.length)],
        rotationSpeed: 0.5 + Math.random() * 0.5,
        floatAmplitude: 0.2,
        floatSpeed: 0.8 + Math.random() * 0.4,
      });
    }

    return data;
  }, [colorTheme]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const targetProgress = treeState === 'FORMED' ? 1 : 0;
    const time = state.clock.elapsedTime;

    ornamentsData.forEach((ornament, i) => {
      const currentPos = new THREE.Vector3().lerpVectors(
        ornament.chaosPosition,
        ornament.targetPosition,
        THREE.MathUtils.lerp(
          meshRef.current!.userData[`progress_${i}`] || 0,
          targetProgress,
          0.045
        )
      );

      meshRef.current!.userData[`progress_${i}`] = THREE.MathUtils.lerp(
        meshRef.current!.userData[`progress_${i}`] || 0,
        targetProgress,
        0.045
      );

      if (treeState === 'CHAOS') {
        currentPos.y += Math.sin(time * ornament.floatSpeed + i * 0.5) * ornament.floatAmplitude;
        currentPos.x += Math.cos(time * ornament.floatSpeed * 0.7 + i) * 0.15;
      }

      dummy.position.copy(currentPos);
      dummy.rotation.set(
        time * ornament.rotationSpeed,
        time * ornament.rotationSpeed * 0.7,
        0
      );
      dummy.scale.setScalar(ornament.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // 设置每个实例的颜色
      meshRef.current!.setColorAt(i, ornament.color);
    });

    meshRef.current!.instanceMatrix.needsUpdate = true;
    if (meshRef.current!.instanceColor) {
      meshRef.current!.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BALLS_COUNT]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1.5}
      />
    </instancedMesh>
  );
}

// 小灯泡组件（发光）
export function LightBulbs() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { treeState, colorTheme } = useStore();

  const ornamentsData = useMemo<OrnamentData[]>(() => {
    const data: OrnamentData[] = [];

    const lightColors = [
      new THREE.Color(0xFFFFAA), // 暖黄
      new THREE.Color(0xFFAA77), // 橙
      new THREE.Color(0xFFFFFF), // 白
      new THREE.Color(0xAAFFFF), // 青
    ];

    for (let i = 0; i < LIGHTS_COUNT; i++) {
      const heightRatio = 0.1 + Math.random() * 0.85;

      data.push({
        chaosPosition: generateChaosPosition(),
        targetPosition: generateTreePosition(heightRatio, 0.95),
        scale: 0.04 + Math.random() * 0.02,
        color: lightColors[Math.floor(Math.random() * lightColors.length)],
        rotationSpeed: 0,
        floatAmplitude: 0.15,
        floatSpeed: 1 + Math.random() * 0.5,
      });
    }

    return data;
  }, [colorTheme]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const targetProgress = treeState === 'FORMED' ? 1 : 0;
    const time = state.clock.elapsedTime;

    ornamentsData.forEach((ornament, i) => {
      const currentPos = new THREE.Vector3().lerpVectors(
        ornament.chaosPosition,
        ornament.targetPosition,
        THREE.MathUtils.lerp(
          meshRef.current!.userData[`progress_${i}`] || 0,
          targetProgress,
          0.05
        )
      );

      meshRef.current!.userData[`progress_${i}`] = THREE.MathUtils.lerp(
        meshRef.current!.userData[`progress_${i}`] || 0,
        targetProgress,
        0.05
      );

      if (treeState === 'CHAOS') {
        currentPos.y += Math.sin(time * ornament.floatSpeed + i * 0.3) * ornament.floatAmplitude;
      }

      dummy.position.copy(currentPos);
      dummy.scale.setScalar(ornament.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // 闪烁效果
      const flicker = 0.8 + Math.sin(time * 3 + i * 0.5) * 0.2;
      const color = ornament.color.clone().multiplyScalar(flicker);
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current!.instanceMatrix.needsUpdate = true;
    if (meshRef.current!.instanceColor) {
      meshRef.current!.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, LIGHTS_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        emissive="#FFFFFF"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// 导出所有装饰物
export function Ornaments() {
  return (
    <group>
      <GiftBoxes />
      <ColorBalls />
      <LightBulbs />
    </group>
  );
}
