import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

const cpuLines = ['ちょっと黙れよ', '何その話題', 'それ昨日も言ってた', 'わろた', 'まじで？', '知らんがな', 'ウケるw'];

const ChatArea = ({ currentUser, currentThread, setCurrentThread, threads, setThreads, cpuMessages, setCpuMessages, isMounted, unlockAchievement }) => {
  const [messageInput, setMessageInput] = useState('');
  const [showAsciiArt, setShowAsciiArt] = useState(false);
  const [asciiArt, setAsciiArt] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentThread?.messages, cpuMessages, showAsciiArt]);

  const generateAsciiArt = () => {
    if (!currentThread) return;
    const arts = [
      '      ∧_∧\n     ( ´∀`)\n     ( つ つ\n     ｜ ｜ ｜\n     (＿)＿)',
      '       ／＠＠＼\n     （ ´・ω・`）\n     ／つ⊂  ＼\n     ｜     ｜\n     ｜     ｜'
    ];
    const random = arts[Math.floor(Math.random() * arts.length)];
    const newAaMsg = { id: Date.now(), userId: currentUser.id, text: random, timestamp: Date.now(), isAsciiArt: true };
    
    const updatedThread = { ...currentThread, messages: [...currentThread.messages, newAaMsg] };
    setCurrentThread(updatedThread);
    setThreads(prev => prev.map(t => t.id === currentThread.id ? updatedThread : t));
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentThread) return;

    const newMessage = { id: Date.now(), userId: currentUser.id, text: messageInput, timestamp: Date.now() };
    let updatedMessages = [...currentThread.messages, newMessage];

    // 🍢 影のCPU
    let shadowCpuTriggered = false;
    let shadowCpuMsg = null;
    if (Math.random() < 0.01) {
      shadowCpuTriggered = true;
      shadowCpuMsg = { id: Date.now() + 1, userId: 'shadow_cpu', text: 'ちくわ大明神', timestamp: Date.now() + 1 };
    }

    // 🏆 実績解除判定
    if (messageInput.includes('誰だ今の')) {
      const lastMessage = currentThread.messages[currentThread.messages.length - 1];
      if (lastMessage && lastMessage.userId === 'shadow_cpu' && lastMessage.text === 'ちくわ大明神') {
        unlockAchievement('chikuwa_unlocked');
      }
    }

    if (shadowCpuTriggered && shadowCpuMsg) updatedMessages.push(shadowCpuMsg);

    // 🤖 通常のCPU野郎
    if (Math.random() < 0.15) {
      const randomLine = cpuLines[Math.floor(Math.random() * cpuLines.length)];
      setTimeout(() => {
        if (!isMounted.current) return;
        const cpuMsg = { id: Date.now() + 10, userId: 'cpu', text: randomLine, timestamp: Date.now() + 10 };
        setCurrentThread(prev => prev ? { ...prev, messages: [...prev.messages, cpuMsg] } : prev);
        setThreads(prev => prev.map(t => t.id === currentThread.id ? { ...t, messages: [...t.messages, cpuMsg] } : t));
      }, 800);
    }

    const updatedThread = { ...currentThread, messages: updatedMessages };
    setCurrentThread(updatedThread);
    setThreads(prev => prev.map(t => t.id === currentThread.id ? updatedThread : t));
    setMessageInput('');
  };

  return (
    <div className="flex-1 flex flex-col font-mono">
      <div className="bg-gray-900 border-b border-green-400/20 p-4">
        <h2 className="text-2xl font-bold text-cyan-400 mb-1">{currentThread.title}</h2>
        <div className="flex gap-4 text-xs text-gray-400">
          <div>👥 {currentThread.members.length}人</div>
          <div>💬 {currentThread.messages.length}件</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentThread.messages.map((msg) => {
          let userName = msg.userId === 'shadow_cpu' ? '？？？？' : msg.userId === 'cpu' ? 'CPU野郎' : msg.userId === 'user1' ? 'あなた' : msg.userId;
          let userAvatar = msg.userId === 'shadow_cpu' ? '👻' : msg.userId === 'cpu' ? '🤖' : '👤';
          return (
            <div key={msg.id} className="message-bubble">
              <div className="flex gap-2">
                <div className="text-xl">{userAvatar}</div>
                <div>
                  <div className="text-xs font-bold text-green-400">{userName}</div>
                  <div className="p-3 bg-gray-800 border border-gray-700 rounded text-sm mt-1 max-w-xl whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-900 border-t border-green-400/20 p-4 space-y-3">
        <div className="flex gap-2">
          <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="メッセージを入力..." className="flex-1 bg-gray-800 border border-green-400/30 rounded px-4 py-2 text-white" />
          <button onClick={handleSendMessage} className="p-2 bg-green-600 rounded text-black font-bold"><Send size={20} /></button>
        </div>
        <button onClick={generateAsciiArt} className="w-full p-2 bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-400 rounded text-sm font-bold">🎨 AAアート生成</button>
      </div>
    </div>
  );
};

export default ChatArea;