import React from 'react';

const mockUsers = [
  { id: 'user1', name: 'あなた', avatar: '👤', color: '#00ff00' },
  { id: 'user2', name: 'ともだちA', avatar: '👥', color: '#00ffff' },
  { id: 'user3', name: 'ともだちB', avatar: '👨', color: '#ffff00' },
];

const Login = ({ onLogin, threadsLength, setThreads, setCurrentThread }) => {
  const handleLoginAction = (user) => {
    onLogin(user);
    if (threadsLength === 0) {
      const newThread = {
        id: Date.now(),
        title: 'ようこそ！',
        members: [user.id, 'user2'],
        messages: [{ id: 1, userId: 'user2', text: 'へい、書き込みテスト。', timestamp: Date.now() }],
      };
      setThreads([newThread]);
      setCurrentThread(newThread);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 tracking-tighter">
            ちくわ
          </h1>
          <p className="text-green-400 text-lg font-mono">[ CHAT SYSTEM ]</p>
        </div>

        {/* 🚀 今後ここに本物の Google 認証ボタンを設置します */}
        <div className="mb-6">
          <button 
            onClick={() => alert("今後ここにSupabaseのGoogle認証を繋ぎます！")}
            className="w-full p-4 bg-white hover:bg-gray-100 text-gray-900 rounded font-bold flex items-center justify-center gap-2 transition"
          >
            🔑 Googleアカウントでサインイン
          </button>
        </div>

        <div className="border-t border-gray-800 my-6 pt-6">
          <p className="text-xs text-gray-400 mb-3 text-center">またはテストユーザーとして開発を続行</p>
          <div className="space-y-3">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLoginAction(user)}
                className="w-full p-3 border border-green-500/30 bg-gray-900/50 hover:border-cyan-400 text-green-400 rounded transition font-bold"
              >
                {user.avatar} {user.name}として参加
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;