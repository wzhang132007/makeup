# 🎄 Grand Luxury Interactive Christmas Tree

一个使用 React Three Fiber 构建的高级交互式 3D 圣诞树 Web 应用。

![Status](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)
![Three.js](https://img.shields.io/badge/three.js-0.160-green.svg)

## ✨ 特性

- 🌟 **双状态系统**：在混沌（CHAOS）和成型（FORMED）状态之间平滑切换
- 💎 **奢华视觉**：土豪金 + 祖母绿色系，PBR 材质，电影级后期效果
- 🎨 **粒子系统**：8000+ 个粒子构成树的主体，使用自定义 Shader
- 🎁 **装饰物系统**：包含礼物盒、彩球、发光灯泡三类装饰
- 🌈 **多主题支持**：奢华金、经典红、科技蓝三种配色方案
- ✨ **后期处理**：Bloom 光晕、色差、暗角等电影级效果
- 🎮 **交互控制**：鼠标拖拽旋转、滚轮缩放、空格键切换状态

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
grand-luxury-christmas-tree/
├── src/
│   ├── components/
│   │   ├── Scene.tsx           # 主场景组件（包含后期处理）
│   │   ├── FoliagePoints.tsx   # 粒子针叶系统
│   │   ├── Ornaments.tsx       # 装饰物系统
│   │   ├── Lights.tsx          # 灯光系统
│   │   └── ControlsPanel.tsx   # UI 控制面板
│   ├── types.ts                # TypeScript 类型定义
│   ├── store.ts                # Zustand 状态管理
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 应用入口
│   └── index.css               # 全局样式
├── public/                     # 静态资源目录
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎮 使用说明

### 键盘控制

- **空格键**：切换 CHAOS/FORMED 状态
- **鼠标拖拽**：旋转视角
- **滚轮**：缩放视角

### UI 面板

左上角控制面板提供以下功能：
- 状态显示与切换按钮
- 三种颜色主题选择
- 音乐播放控制（预留接口）

## 🎨 技术栈

- **React 19** - 前端框架
- **TypeScript** - 类型安全
- **React Three Fiber** - Three.js 的 React 渲染器
- **@react-three/drei** - R3F 实用工具库
- **@react-three/postprocessing** - 后期处理效果
- **Zustand** - 轻量级状态管理
- **Tailwind CSS** - UI 样式
- **Vite** - 构建工具

## 🔧 可调整参数

### 粒子系统 (`FoliagePoints.tsx`)

```typescript
const PARTICLE_COUNT = 8000;  // 粒子数量
// Lerp 速度：0.05（第191行）
```

### 装饰物系统 (`Ornaments.tsx`)

```typescript
const GIFTS_COUNT = 15;   // 礼物盒数量
const BALLS_COUNT = 40;   // 彩球数量
const LIGHTS_COUNT = 60;  // 灯泡数量
```

### 后期效果 (`Scene.tsx`)

```typescript
<Bloom
  intensity={1.2}              // 光晕强度
  luminanceThreshold={0.8}     // 亮度阈值
  luminanceSmoothing={0.9}
/>
```

## 🎯 核心实现逻辑

### 双坐标系统

每个元素（粒子、装饰物）都拥有两套坐标：
- `chaosPosition`：混沌状态下的球形随机位置
- `targetPosition`：成型状态下的圆锥形树结构位置

切换状态时，通过 `useFrame` 在两个坐标之间进行 Lerp 插值，实现平滑过渡。

### 自定义 Shader

针叶粒子系统使用自定义 GLSL Shader：
- **Vertex Shader**：在两个位置之间插值，添加漂浮动画
- **Fragment Shader**：创建圆形粒子，边缘羽化效果

### 状态管理

使用 Zustand 管理全局状态：
- `treeState`：CHAOS | FORMED
- `progress`：过渡进度（0-1）
- `colorTheme`：当前配色主题

## 🌟 扩展建议

### 1. 添加自定义 HDRI 环境贴图

在 `Scene.tsx` 中替换：

```typescript
<Environment files="/path/to/your/hdri.hdr" />
```

### 2. 添加背景音乐

在 `ControlsPanel.tsx` 的音乐按钮中：

```typescript
const audioRef = useRef<HTMLAudioElement>(null);

// 在按钮点击事件中
audioRef.current?.play();
```

### 3. 添加物理引擎

可以集成 `@react-three/cannon` 或 `@react-three/rapier` 实现更真实的物理效果。

### 4. 添加点击彩蛋

在 `Ornaments.tsx` 中为装饰物添加 `onClick` 事件，实现点击礼物盒时弹出祝福语等互动效果。

## 📝 许可

MIT License

## 🙏 致谢

- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Pmndrs](https://pmnd.rs/) - 优秀的 R3F 生态系统

---

**Merry Christmas! 🎅🎄✨**
