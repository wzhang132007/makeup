import { Scene } from './components/Scene';
import { ControlsPanel } from './components/ControlsPanel';

function App() {
  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      {/* 3D场景 */}
      <Scene />

      {/* UI控制面板 */}
      <ControlsPanel />

      {/* 右下角版权信息 */}
      <div className="fixed bottom-4 right-4 z-10 text-white/50 text-xs">
        <p>Grand Luxury Christmas Tree</p>
        <p className="text-luxury-gold/70">Interactive 3D Experience</p>
      </div>

      {/* 加载提示（可选） */}
      <div className="fixed bottom-4 left-4 z-10 text-white/30 text-xs">
        <p>💻 Built with React Three Fiber</p>
        <p>🎨 Powered by WebGL</p>
      </div>
    </div>
  );
}

export default App;
