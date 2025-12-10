import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { ParticleData } from '../types';

// 自定义Shader材质用于粒子针叶
const vertexShader = `
  attribute vec3 chaosPos;
  attribute vec3 targetPos;
  attribute float size;
  attribute vec3 color;

  uniform float progress;
  uniform float time;

  varying vec3 vColor;

  void main() {
    vColor = color;

    // 在chaos和target位置之间插值
    vec3 pos = mix(chaosPos, targetPos, progress);

    // 在CHAOS状态添加轻微漂浮动画
    float floatY = sin(time * 0.5 + position.x * 10.0) * 0.1 * (1.0 - progress);
    pos.y += floatY;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 根据距离调整粒子大小
    gl_PointSize = size * (300.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    // 创建圆形粒子
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    if (dist > 0.5) discard;

    // 边缘羽化效果
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

    gl_FragColor = vec4(vColor, alpha);
  }
`;

const PARTICLE_COUNT = 8000; // 可调整参数：粒子数量

// 生成圆锥形目标位置
function generateConePosition(index: number, total: number): THREE.Vector3 {
  const heightRatio = Math.pow(index / total, 0.8);
  const y = heightRatio * 6 - 1; // 树高约6单位

  // 圆锥半径随高度减小
  const radius = (1 - heightRatio) * 2.5 + 0.1;

  // 螺旋分布让树更均匀
  const angle = (index / total) * Math.PI * 20 + Math.random() * 0.5;
  const r = radius * (0.7 + Math.random() * 0.3);

  return new THREE.Vector3(
    Math.cos(angle) * r,
    y,
    Math.sin(angle) * r
  );
}

// 生成混沌球形位置
function generateChaosPosition(): THREE.Vector3 {
  const radius = 8 + Math.random() * 4;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta) - 2,
    radius * Math.cos(phi)
  );
}

export function FoliagePoints() {
  const pointsRef = useRef<THREE.Points>(null);
  const { treeState, colorTheme } = useStore();

  // 初始化粒子数据
  const particlesData = useMemo<ParticleData[]>(() => {
    const data: ParticleData[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const heightRatio = Math.pow(i / PARTICLE_COUNT, 0.8);

      // 根据主题设置颜色（祖母绿系）
      let baseColor: THREE.Color;
      if (colorTheme === 'techBlue') {
        baseColor = new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.6, 0.3 + heightRatio * 0.2);
      } else {
        // luxury 和 classic 都用绿色系
        baseColor = new THREE.Color().setHSL(0.4 + Math.random() * 0.08, 0.7, 0.2 + heightRatio * 0.3);
      }

      data.push({
        chaosPosition: generateChaosPosition(),
        targetPosition: generateConePosition(i, PARTICLE_COUNT),
        size: 3 + Math.random() * 2,
        color: baseColor,
      });
    }

    return data;
  }, [colorTheme]);

  // 创建geometry和material
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // 创建属性数组
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const chaosPositions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    particlesData.forEach((p, i) => {
      // position（初始设为chaos位置）
      positions[i * 3] = p.chaosPosition.x;
      positions[i * 3 + 1] = p.chaosPosition.y;
      positions[i * 3 + 2] = p.chaosPosition.z;

      // chaosPos attribute
      chaosPositions[i * 3] = p.chaosPosition.x;
      chaosPositions[i * 3 + 1] = p.chaosPosition.y;
      chaosPositions[i * 3 + 2] = p.chaosPosition.z;

      // targetPos attribute
      targetPositions[i * 3] = p.targetPosition.x;
      targetPositions[i * 3 + 1] = p.targetPosition.y;
      targetPositions[i * 3 + 2] = p.targetPosition.z;

      // size attribute
      sizes[i] = p.size;

      // color attribute
      colors[i * 3] = p.color.r;
      colors[i * 3 + 1] = p.color.g;
      colors[i * 3 + 2] = p.color.b;
    });

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('chaosPos', new THREE.BufferAttribute(chaosPositions, 3));
    geo.setAttribute('targetPos', new THREE.BufferAttribute(targetPositions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 创建ShaderMaterial
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        progress: { value: 0 },
        time: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, [particlesData]);

  // 动画循环：更新progress和time
  useFrame((state) => {
    if (!pointsRef.current) return;

    const targetProgress = treeState === 'FORMED' ? 1 : 0;
    const currentProgress = material.uniforms.progress.value;

    // Lerp平滑过渡
    material.uniforms.progress.value = THREE.MathUtils.lerp(
      currentProgress,
      targetProgress,
      0.05 // 可调整参数：过渡速度
    );

    // 更新时间用于漂浮动画
    material.uniforms.time.value = state.clock.elapsedTime;
  });

  // 清理
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
