import React from 'react';
import { Trophy } from 'lucide-react';

const Achievements = ({ 
  achievements, 
  setAchievements, 
  currentThread, 
  setCurrentThread, 
  setThreads, 
  setCpuMessages, // App.jsxから正しく受け取る
  isMounted 
}) => {

  // 🛠️ デバッグ・テスト用チート関数
  const runDebugCommand = (type) => {
    if (!currentThread) {
      alert('スレッドを選択するか、新規作成してから実行してください。');
      return;
    }

    if (type === 'add_100_messages') {
      // 一瞬でメッセージを100件生成してスレッドに叩き込む
      const dummyMessages = Array.from({ length: 100 }).map((_, i) => ({
        id: Date.now() + i,
        userId: 'user2',
        text: `テスト用自動生成書き込み ${i + 1}`,
        timestamp: Date.now() + i
      }));

      const updatedThread = {
        ...currentThread,
        messages: [...currentThread.messages, ...dummyMessages]
      };
      
      setCurrentThread(updatedThread);
      setThreads(prev => prev.map(t => t.id === currentThread.id ? updatedThread : t));
    }

    if (type === 'trigger_chikuwa') {
      // 影のCPU「ちくわ大明神」を強制的に目の前に召喚する
      setCpuMessages(['ちくわ大明神']);
      setTimeout(() => {
        if (isMounted.current) setCpuMessages(['...？']);
      }, 500);

      const chikuwaMsg = {
        id: Date.now(),
        userId: 'shadow_cpu', // handleSendMessageの判定と一致させる
        text: 'ちくわ大明神',
        timestamp: Date.now()
      };

      const updatedThread = {
        ...currentThread,
        messages: [...currentThread.messages, chikuwaMsg]
      };
      
      setCurrentThread(updatedThread);
      setThreads(prev => prev.map(t => t.id === currentThread.id ? updatedThread : t));
    }

    if (type === 'clear_storage') {
      // 実績やスレッドのセーブデータを一発で消去してリロード
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="w-80 bg-black border-l border-green-400/20 flex flex-col font-mono">
      <div className="p-4 border-b border-green-400/20 flex items-center gap-2 text-xl font-bold text-green-400">
        <Trophy size={24} /> 実績
      </div>

      {/* 実績リスト */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {achievements.map((a) => (
          <div 
            key={a.id} 
            className={`p-3 rounded border transition-all duration-300 ${
              a.unlocked 
                ? 'bg-green-900/30 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                : 'bg-gray-900/50 border-gray-700 text-gray-500'
            }`}
          >
            <div className="flex gap-3">
              <div className="text-2xl">{a.icon}</div>
              <div>
                <div className={`font-bold text-sm ${a.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                  {a.title}
                </div>
                <div className="text-xs mt-1 text-gray-500">{a.description}</div>
                {a.unlocked && <div className="text-[10px] text-green-500 font-bold mt-1">✓ 達成済み</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 進捗バー */}
      <div className="p-4 border-t border-green-400/20">
        <div className="text-xs text-gray-400 mb-2">
          実績進捗: {achievements.filter((a) => a.unlocked).length} / {achievements.length}
        </div>
        <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-cyan-400 h-full transition-all duration-500"
            style={{ width: `${(achievements.filter((a) => a.unlocked).length / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 🛠️ デバッグパネル */}
      <div className="p-4 border-t border-red-500/30 bg-red-950/10 space-y-2">
        <div className="text-xs font-bold text-red-400 font-mono">🚨 DEBUG PANEL</div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => runDebugCommand('trigger_chikuwa')} 
            className="p-1.5 bg-purple-900/40 border border-purple-500/40 text-purple-300 rounded text-[10px] font-bold hover:bg-purple-900/60 transition"
          >
            ちくわ大明神召喚
          </button>
          <button 
            onClick={() => runDebugCommand('add_100_messages')} 
            className="p-1.5 bg-blue-900/40 border border-blue-500/40 text-blue-300 rounded text-[10px] font-bold hover:bg-blue-900/60 transition"
          >
            ログ100件増幅
          </button>
        </div>
        <button 
          onClick={() => runDebugCommand('clear_storage')} 
          className="w-full p-1.5 bg-red-900/30 border border-red-500/30 text-red-400 rounded text-[10px] font-bold hover:bg-red-900/50 transition"
        >
          セーブデータ消去＆リロード
        </button>
      </div>
    </div>
  );
};

export default Achievements;