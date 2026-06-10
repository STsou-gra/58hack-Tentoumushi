import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Achievements from './components/Achievements';

const allAchievements = [
  { id: 'first_message', title: '初投稿', description: '初めてメッセージを送った', icon: '📝', unlocked: false },
  { id: 'chikuwa_unlocked', title: 'ちくわ大明神', description: '"ちくわ大明神"と呟いて"誰だ今の"と返した', icon: '🍢', unlocked: false },
  { id: 'thread_creator', title: 'スレッド職人', description: '5つ以上のスレッドを作成した', icon: '🔨', unlocked: false },
  { id: 'chatty', title: 'チャットの鬼', description: '100件以上のメッセージを送った', icon: '💬', unlocked: false },
  { id: 'ascii_artist', title: 'AAアート師', description: 'アスキーアートを5回生成した', icon: '🎨', unlocked: false },
  { id: 'five_people', title: '大人数スレッド', description: '5人以上が参加したスレッドを作った', icon: '👥', unlocked: false },
];

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [cpuMessages, setCpuMessages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; }
  }, []);

  // Load state
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedThreads = localStorage.getItem('threads');
    const savedAchievements = localStorage.getItem('achievements');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
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
    setIsInitialized(true);
  }, []);

  // Save state
  useEffect(() => {
    if (!isInitialized) return;
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    if (threads.length > 0) localStorage.setItem('threads', JSON.stringify(threads));
    if (achievements.length > 0) localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [currentUser, threads, achievements, isInitialized]);

  // 🏆 全自動・実績監視システム
  useEffect(() => {
    if (!isInitialized || achievements.length === 0) return;

    const totalMessages = threads.reduce((sum, t) => sum + t.messages.length, 0);
    const totalAA = threads.reduce((sum, t) => sum + t.messages.filter(m => m.isAsciiArt).length, 0);
    const maxMembers = threads.length > 0 ? Math.max(...threads.map(t => t.members.length)) : 0;

    const conditions = {
      first_message: totalMessages > 0,
      thread_creator: threads.length >= 5,
      chatty: totalMessages >= 100,
      ascii_artist: totalAA >= 5,
      five_people: maxMembers >= 5
    };

    const hasNewUnlock = achievements.some(a => conditions[a.id] && !a.unlocked);

    if (hasNewUnlock) {
      setAchievements(prev =>
        prev.map(a => conditions[a.id] ? { ...a, unlocked: true } : a)
      );
    }
  }, [threads, isInitialized]);

  const unlockAchievement = (achievementId) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === achievementId ? { ...a, unlocked: true } : a))
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} threadsLength={threads.length} setThreads={setThreads} setCurrentThread={setCurrentThread} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex overflow-hidden text-white">
      <Sidebar 
        currentUser={currentUser} 
        threads={threads} 
        currentThread={currentThread} 
        setCurrentThread={setCurrentThread} 
        setThreads={setThreads}
        onLogout={handleLogout}
      />
      <ChatArea 
        currentUser={currentUser}
        currentThread={currentThread}
        setCurrentThread={setCurrentThread}
        threads={threads}
        setThreads={setThreads}
        cpuMessages={cpuMessages}
        setCpuMessages={setCpuMessages}
        isMounted={isMounted}
        unlockAchievement={unlockAchievement}
      />
      <Achievements 
        achievements={achievements} 
        setAchievements={setAchievements}
        currentThread={currentThread}
        setCurrentThread={setCurrentThread}
        setThreads={setThreads}
        setCpuMessages={setCpuMessages}
        isMounted={isMounted}
      />
    </div>
  );
};

export default App;