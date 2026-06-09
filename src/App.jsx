import React, { useState, useEffect, useRef } from 'react';
import { Send, Trophy, MessageSquare, Users, LogOut, Plus, Zap } from 'lucide-react';

const App = () => {
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [cpuMessages, setCpuMessages] = useState([]);
  const [showAsciiArt, setShowAsciiArt] = useState(false);
  const [asciiArt, setAsciiArt] = useState('');
  const messagesEndRef = useRef(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {isMounted.current = false;}
  }, []);

  // Mock users
  const mockUsers = [
    { id: 'user1', name: 'あなた', avatar: '👤', color: '#00ff00' },
    { id: 'user2', name: 'ともだちA', avatar: '👥', color: '#00ffff' },
    { id: 'user3', name: 'ともだちB', avatar: '👨', color: '#ffff00' },
  ];

  // CPU character
  const cpuName = 'CPU野郎';
  const cpuLines = [
    'ちょっと黙れよ',
    '何その話題',
    'それ昨日も言ってた',
    'わろた',
    'まじで？',
    '知らんがな',
    'ウケるw',
  ];

  // Achievement definitions
  const allAchievements = [
    { id: 'first_message', title: '初投稿', description: '初めてメッセージを送った', icon: '📝', unlocked: false },
    { id: 'chikuwa_unlocked', title: 'ちくわ大明神', description: '"ちくわ大明神"と呟いて"なんだ今の"と返した', icon: '🍢', unlocked: false },
    { id: 'thread_creator', title: 'スレッド職人', description: '5つ以上のスレッドを作成した', icon: '🔨', unlocked: false },
    { id: 'chatty', title: 'チャットの鬼', description: '100件以上のメッセージを送った', icon: '💬', unlocked: false },
    { id: 'ascii_artist', title: 'AAアート師', description: 'アスキーアートを5回生成した', icon: '🎨', unlocked: false },
    { id: 'five_people', title: '大人数スレッド', description: '5人以上が参加したスレッドを作った', icon: '👥', unlocked: false },
  ];

  // Initialize
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedThreads = localStorage.getItem('threads');
    const savedAchievements = localStorage.getItem('achievements');

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedThreads) {
      const parsed = JSON.parse(savedThreads);
      setThreads(parsed);
      if (parsed.length > 0) setCurrentThread(parsed[0]);
    }
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      setAchievements(allAchievements);
    }

    setIsInitialized(true); //読み込み完了フラグを立てる
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentThread]);

  // Save state
  useEffect(() => {
    if (!isInitialized) return; //初期化完了前は保存処理をスキップ

    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    if (threads.length > 0) localStorage.setItem('threads', JSON.stringify(threads));
    if (achievements.length > 0) localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [currentUser, threads, achievements, isInitialized]);

  // Login
  const handleLogin = (user) => {
    setCurrentUser(user);
    // Create initial thread if none exists
    if (threads.length === 0) {
      const newThread = {
        id: Date.now(),
        title: 'ようこそ！',
        members: [user.id, 'user2'],
        messages: [
          {
            id: 1,
            userId: 'user2',
            text: 'へい、書き込みテスト。',
            timestamp: Date.now(),
          },
        ],
      };
      setThreads([newThread]);
      setCurrentThread(newThread);
    }
  };

  // Create new thread
  const createNewThread = () => {
    const title = prompt('スレッドのタイトルを入力してください:');
    if (!title) return;

    const memberCount = prompt('メンバー数を入力（1-3）:', '1');
    const count = Math.min(Math.max(parseInt(memberCount) || 1, 1), 3);

    const members = [currentUser.id];
    for (let i = 0; i < count - 1; i++) {
      const otherUser = mockUsers.find((u) => u.id !== currentUser.id && !members.includes(u.id));
      if (otherUser) members.push(otherUser.id);
    }

    const newThread = {
      id: Date.now(),
      title: title,
      members: members,
      messages: [],
    };

    const updatedThreads = [newThread, ...threads];
    setThreads(updatedThreads);
    setCurrentThread(newThread);

    if (updatedThreads.length >= 5) {
      unlockAchievement('thread_creator');
    }
  };

  // Unlock achievement
  const unlockAchievement = (achievementId) => {
    setAchievements((prevAchievements) =>
      prevAchievements.map((a) =>
        a.id === achievementId ? { ...a, unlocked: true } : a
      )
    );
  };

  // Generate ASCII art
  const generateAsciiArt = () => {
    if(!currentThread) return;

    const arts = [
      '　　　　　 ∧_∧\n　　　　　( ´∀`)\n　　　　　(　つ つ\n　　　　　｜ ｜ ｜\n　　　　　(＿)＿)',
      '　　　　　  ／＠＠＼\n　　　　　（　´・ω・`）\n　　　　　／つ⊂　 ＼\n　　　　　｜　　　　　｜\n　　　　　｜　　　　　｜',
      '　　∧_∧　\n　　(´・ω・`)　ﾀﾀﾀｯ\n　　⊃━⊃\n　　　く',
    ];
    const random = arts[Math.floor(Math.random() * arts.length)];

    // AAを「メッセージ」オブジェクトとして作成
    const newAaMessage = {
      id: Date.now(),
      userId: currentUser.id,
      text: random,
      timestamp: Date.now(),
      isAsciiArt: true, // 実績判定用のフラグ
    };

    // 現在のスレッドにAAメッセージを追加
    const updatedThread = {
      ...currentThread,
      messages: [...currentThread.messages, newAaMessage],
    };

    // Stateの更新
    setCurrentThread(updatedThread);
    setThreads((prevThreads) =>
      prevThreads.map((t) => (t.id === currentThread.id ? updatedThread : t))
    );

    // 4. AA実績のカウントと判定（最新のメッセージから件数を数える）
    const totalAscii = updatedThread.messages.filter((m) => m.isAsciiArt).length;
    if (totalAscii >= 5) {
      unlockAchievement('ascii_artist');
    }

    // 初投稿実績もついでにケア
    unlockAchievement('first_message');
  };

  // Handle message send
  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentThread) return;

    const newMessage = {
      id: Date.now(),
      userId: currentUser.id,
      text: messageInput,
      timestamp: Date.now(),
    };

    let updatedMessages = [...currentThread.messages, newMessage];
    //影のCPU
    let shadowCpuTriggered = false;
    let shadowCpuMsg = null;
    if(Math.random() < 0.01){
      shadowCpuTriggered = true;
      shadowCpuMsg = {
        id: Date.now() + 1,
        userId: 'ちくわ大明神',
        text: 'ちくわ大明神',
        timestamp: Date.now() + 1,
      };
    }

// --- 🏆 「ちくわ大明神」の実績解除判定 ---
    // 今回送信した文字が「誰だ今の」であり、かつ、直前の書き込み（配列の最後）が
    // 影のCPU（shadow_cpu）による「ちくわ大明神」だった場合、実績を解除！
    if (messageInput.includes('誰だ今の')) {
      const lastMessage = currentThread.messages[currentThread.messages.length - 1];
      if (lastMessage && lastMessage.userId === 'shadow_cpu' && lastMessage.text === 'ちくわ大明神') {
        unlockAchievement('chikuwa_unlocked');
      }
    }

    // 影のCPUが発動していたら、配列の末尾に「ちくわ大明神」を追記
    if (shadowCpuTriggered && shadowCpuMsg) {
      updatedMessages.push(shadowCpuMsg);
    }

    // --- 🤖 通常の「CPU野郎」のランダム野次馬処理 ---
    // （こちらは既存の仕様通り15%の確率で、少し遅れて発言）
    if (Math.random() < 0.15) {
      const randomLine = cpuLines[Math.floor(Math.random() * cpuLines.length)];
      setTimeout(() => {
        if (!isMounted.current) return;
        const cpuMsg = {
          id: Date.now() + 10,
          userId: 'cpu',
          text: randomLine,
          timestamp: Date.now() + 10,
        };

        setCurrentThread((prev) =>
          prev ? { ...prev, messages: [...prev.messages, cpuMsg] } : prev
        );
        setThreads((prevThreads) =>
          prevThreads.map((t) =>
            t.id === currentThread.id
              ? { ...t, messages: [...t.messages, cpuMsg] }
              : t
          )
        );
      }, 800);
    }

    // スレッドの状態を確定させて反映
    const updatedThread = {
      ...currentThread,
      messages: updatedMessages,
    };

    setCurrentThread(updatedThread);
    setThreads((prevThreads) =>
      prevThreads.map((t) => (t.id === currentThread.id ? updatedThread : t))
    );
    setMessageInput('');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 overflow-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');
          
          * {
            font-family: 'JetBrains Mono', monospace;
          }
          
          .title {
            font-family: 'Syne', sans-serif;
            letter-spacing: -2px;
            font-weight: 800;
          }

          @keyframes flicker {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }

          @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
          }

          .glitch-text {
            animation: glitch 0.3s infinite;
          }

          .login-btn {
            transition: all 0.3s ease;
          }

          .login-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
          }
        `}</style>

        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="title text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400">
              ちくわ
            </h1>
            <p className="text-green-400 text-lg glitch-text">[ CHAT SYSTEM ]</p>
            <p className="text-gray-400 text-sm mt-4 font-mono">
              2ch風スレッド式チャットアプリ v1.0
            </p>
          </div>

          <div className="space-y-3">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className="login-btn w-full p-4 border-2 border-green-400 hover:border-cyan-400 bg-gray-900 bg-opacity-50 text-green-400 hover:text-cyan-400 rounded transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-2xl mb-2">{user.avatar}</div>
                <div className="font-bold">{user.name}として参加</div>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 border border-gray-700 bg-black bg-opacity-30 rounded text-gray-400 text-xs">
            <p className="font-bold text-green-400 mb-2">💡 遊び方</p>
            <ul className="space-y-1 text-gray-500">
              <li>• メッセージを送信してチャットを楽しむ</li>
              <li>• 「ちくわ大明神」と呟いてイースターエッグ</li>
              <li>• 実績をコンプリートしよう！</li>
              <li>• CPUがランダムに野次馬コメント</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');
        
        * {
          font-family: 'JetBrains Mono', monospace;
        }

        .title {
          font-family: 'Syne', sans-serif;
          letter-spacing: -2px;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-bubble {
          animation: slideIn 0.3s ease;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 136, 0.3); }
          50% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.6); }
        }

        .achievement-unlock {
          animation: pulse-glow 1s infinite;
        }

        .thread-item {
          transition: all 0.2s ease;
        }

        .thread-item:hover {
          transform: translateX(4px);
          border-left-color: #00ffff;
        }

        .cpu-message {
          color: #ff6b6b;
          font-weight: bold;
          border-left: 3px solid #ff6b6b;
        }

        scrollbar-width: thin;
        scrollbar-color: #00ff00 #1a1a1a;
      `}</style>

      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-green-400 border-opacity-30 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-green-400 border-opacity-30">
          <div className="title text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 mb-2">
            ちくわ
          </div>
          <div className="text-xs text-slate-400">Logged in: {currentUser.name}</div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <button
            onClick={createNewThread}
            className="w-full p-3 bg-green-400/10 border border-green-400/30 text-green-400 rounded hover:bg-green-400/20 transition text-sm font-bold flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            新規スレッド作成
          </button>

          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setCurrentThread(thread)}
              className={`thread-item p-3 rounded border-l-4 cursor-pointer transition ${
              currentThread?.id === thread.id
              ? 'bg-green-400/20 border-l-green-400' // bg-green-400 bg-opacity-20 から書き換え
              : 'bg-gray-900 border-l-gray-700 hover:bg-gray-800'
}`}
            >
              <div className="text-sm font-bold text-green-400 truncate">
                {thread.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {thread.messages.length}件 / {thread.members.length}人
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="p-4 border-t border-green-400 border-opacity-30 space-y-3">
          <div className="bg-gray-900 p-3 rounded border border-gray-700">
            <div className="text-xs text-gray-400 mb-2">📊 統計</div>
            <div className="text-xs text-green-400 space-y-1">
              <div>スレッド: {threads.length}</div>
              <div>
                投稿: {threads.reduce((sum, t) => sum + t.messages.length, 0)}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentUser(null);
              localStorage.removeItem('currentUser');
            }}
            className="w-full p-2 bg-red-600/20 border border-red-600 text-red-400 rounded hover:bg-opacity-40 transition text-sm font-bold flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            ログアウト
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentThread ? (
          <>
            {/* Thread Header */}
            <div className="bg-gray-900 border-b border-green-400 border-opacity-30 p-4">
              <h2 className="title text-2xl font-bold text-cyan-400 mb-2">
                {currentThread.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {currentThread.members.length}人
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {currentThread.messages.length}件
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentThread.messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📝</div>
                    <p>このスレッドにはまだメッセージがありません</p>
                    <p className="text-xs mt-2">何か投稿してみましょう！</p>
                  </div>
                </div>
              ) : (
                currentThread.messages.map((msg) => {
                  const user = msg.userId === 'cpu' ? cpuName : mockUsers.find((u) => u.id === msg.userId);
                  const isCpu = msg.userId === 'cpu';

                  return (
                    <div key={msg.id} className="message-bubble">
                      <div className={`flex gap-2 ${isCpu ? 'cpu-message' : ''}`}>
                        <div className="text-xl flex-shrink-0">
                          {isCpu ? '🤖' : user?.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-xs font-bold mb-1 ${
                              isCpu ? 'text-red-400' : 'text-green-400'
                            }`}
                          >
                            {isCpu ? `${cpuName}` : user?.name}
                          </div>
                          <div
                            className={`p-3 rounded border ${
                              isCpu
                                ? 'bg-red-900 bg-opacity-20 border-red-600 text-red-200'
                                : 'bg-gray-800 border-gray-700 text-gray-100'
                            } text-sm whitespace-pre-wrap break-words`}
                          >
                            {msg.text}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {cpuMessages.length > 0 && (
                <div className="cpu-message flex gap-2">
                  <div className="text-xl">💭</div>
                  <div>
                    <div className="text-xs font-bold text-red-400 mb-1">
                      システムメッセージ
                    </div>
                    <div className="bg-red-900 bg-opacity-20 border border-red-600 text-red-200 p-2 rounded text-sm">
                      {cpuMessages.join(' ')}
                    </div>
                  </div>
                </div>
              )}

              {showAsciiArt && (
                <div className="bg-yellow-900 bg-opacity-10 border border-yellow-600 p-4 rounded text-yellow-300 text-xs whitespace-pre font-mono overflow-x-auto">
                  {asciiArt}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-gray-900 border-t border-green-400 border-opacity-30 p-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="メッセージを入力..."
                  className="flex-1 bg-gray-800 border border-green-400 border-opacity-30 rounded px-4 py-2 text-green-400 placeholder-gray-600 focus:outline-none focus:border-green-400 focus:border-opacity-100"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-green-600 bg-opacity-80 hover:bg-opacity-100 rounded text-black font-bold transition"
                >
                  <Send size={20} />
                </button>
              </div>

              <button
                onClick={generateAsciiArt}
                className="w-full p-2 bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-400 rounded hover:bg-opacity-40 transition text-sm font-bold flex items-center justify-center gap-2"
              >
                🎨 AAアート生成
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-5xl mb-4">📭</div>
              <p>スレッドを選択してください</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Achievements */}
      <div className="w-80 bg-black border-l border-green-400 border-opacity-30 flex flex-col">
        <div className="p-4 border-b border-green-400 border-opacity-30">
          <div className="flex items-center gap-2 title text-xl font-bold text-green-400">
            <Trophy size={24} />
            実績
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded border ${
                achievement.unlocked
                  ? 'achievement-unlock bg-green-900 bg-opacity-30 border-green-500'
                  : 'bg-gray-900 bg-opacity-50 border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-bold text-sm ${
                      achievement.unlocked
                        ? 'text-green-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {achievement.title}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      achievement.unlocked
                        ? 'text-green-300'
                        : 'text-gray-600'
                    }`}
                  >
                    {achievement.description}
                  </div>
                  {achievement.unlocked && (
                    <div className="text-xs text-green-500 mt-2 font-bold">
                      ✓ 達成済み
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="p-4 border-t border-green-400 border-opacity-30">
          <div className="text-xs text-gray-400 mb-2">
            実績進捗:{' '}
            {achievements.filter((a) => a.unlocked).length} /{achievements.length}
          </div>
          <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-cyan-400 h-full transition-all duration-500"
              style={{
                width: `${
                  (achievements.filter((a) => a.unlocked).length / achievements.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
