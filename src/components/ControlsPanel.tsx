import { useStore } from '../store';
import { ColorTheme } from '../types';
import { useEffect } from 'react';

export function ControlsPanel() {
  const { treeState, toggleState, colorTheme, setColorTheme } = useStore();

  // 键盘快捷键：空格键切换状态
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggleState();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleState]);

  return (
    <div className="fixed top-4 left-4 z-10 bg-black/60 backdrop-blur-md rounded-lg p-6 text-white border border-luxury-gold/30 shadow-2xl">
      {/* 标题 */}
      <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-luxury-gold to-yellow-500 bg-clip-text text-transparent">
        Grand Luxury
      </h1>
      <h2 className="text-xl font-semibold mb-4 text-emerald-deep">
        Christmas Tree
      </h2>

      {/* 状态显示 */}
      <div className="mb-4 pb-4 border-b border-gray-600">
        <div className="text-sm text-gray-400 mb-1">Current State</div>
        <div className="text-lg font-mono">
          {treeState === 'CHAOS' ? (
            <span className="text-red-400">🌌 CHAOS</span>
          ) : (
            <span className="text-green-400">🎄 FORMED</span>
          )}
        </div>
      </div>

      {/* 切换状态按钮 */}
      <button
        onClick={toggleState}
        className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-bold rounded-lg hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-luxury-gold/50"
      >
        {treeState === 'CHAOS' ? '✨ Form Tree' : '💥 Break Apart'}
      </button>

      {/* 颜色主题选择 */}
      <div className="mb-4 pb-4 border-b border-gray-600">
        <div className="text-sm text-gray-400 mb-2">Color Theme</div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setColorTheme('luxury')}
            className={`px-3 py-2 rounded text-sm font-medium transition-all ${
              colorTheme === 'luxury'
                ? 'bg-luxury-gold text-black'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            💎 Luxury Gold
          </button>
          <button
            onClick={() => setColorTheme('classic')}
            className={`px-3 py-2 rounded text-sm font-medium transition-all ${
              colorTheme === 'classic'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            🎅 Classic Red
          </button>
          <button
            onClick={() => setColorTheme('techBlue')}
            className={`px-3 py-2 rounded text-sm font-medium transition-all ${
              colorTheme === 'techBlue'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            ❄️ Tech Blue
          </button>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="text-xs text-gray-400 space-y-1">
        <div>💡 Press SPACE to toggle</div>
        <div>🖱️ Drag to rotate view</div>
        <div>🔍 Scroll to zoom</div>
      </div>

      {/* 音乐控制预留接口 */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <button
          className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-all"
          onClick={() => {
            // 预留：播放/暂停圣诞音乐
            // Example: audioRef.current?.play() or pause()
            alert('🎵 Music feature - Connect your audio file here!');
          }}
        >
          🎵 Music (Coming Soon)
        </button>
      </div>
    </div>
  );
}
