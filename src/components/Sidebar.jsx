import React from 'react';
import { Plus, LogOut } from 'lucide-react';

const Sidebar = ({ currentUser, threads, currentThread, setCurrentThread, setThreads, onLogout }) => {
  const createNewThread = () => {
    const title = prompt('スレッドのタイトルを入力してください:');
    if (!title) return;

    const memberCount = prompt('メンバー数を入力（1-5）:', '1');
    const count = Math.min(Math.max(parseInt(memberCount) || 1, 1), 5);

    const members = [currentUser.id];
    for (let i = 1; i < count; i++) {
      members.push(`user_${members.length + 1}`);
    }

    const newThread = { id: Date.now(), title, members, messages: [] };
    setThreads([newThread, ...threads]);
    setCurrentThread(newThread);
  };

  return (
    <div className="w-64 bg-black border-r border-green-400/20 flex flex-col font-mono">
      <div className="p-4 border-b border-green-400/20">
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 mb-1">ちくわ</div>
        <div className="text-xs text-slate-400">Logged in: {currentUser.name}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <button onClick={createNewThread} className="w-full p-3 bg-green-400/10 border border-green-400/30 text-green-400 rounded hover:bg-green-400/20 transition text-sm font-bold flex items-center justify-center gap-2">
          <Plus size={16} /> 新規スレッド作成
        </button>

        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => setCurrentThread(thread)}
            className={`p-3 rounded border-l-4 cursor-pointer transition ${currentThread?.id === thread.id ? 'bg-green-400/20 border-l-green-400' : 'bg-gray-900 border-l-gray-700 hover:bg-gray-800'}`}
          >
            <div className="text-sm font-bold text-green-400 truncate">{thread.title}</div>
            <div className="text-xs text-gray-500 mt-1">{thread.messages.length}件 / {thread.members.length}人</div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-green-400/20 space-y-3">
        <div className="bg-gray-900 p-3 rounded border border-gray-700 text-xs text-green-400 space-y-1">
          <div className="text-gray-400 mb-1">📊 統計</div>
          <div>スレッド: {threads.length}</div>
          <div>投稿: {threads.reduce((sum, t) => sum + t.messages.length, 0)}</div>
        </div>
        <button onClick={onLogout} className="w-full p-2 bg-red-600/20 border border-red-600 text-red-400 rounded hover:bg-opacity-40 transition text-sm font-bold flex items-center justify-center gap-2">
          <LogOut size={14} /> ログアウト
        </button>
      </div>
    </div>
  );
};

export default Sidebar;