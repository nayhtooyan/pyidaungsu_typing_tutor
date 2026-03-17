import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Keyboard from './components/Keyboard';
import { myanmarKeyMap, myanmarCurriculum, totalLevels, getCharFromKey } from './data/myanmarLayout';
import { englishCurriculum, totalLevels as engLevels } from './data/englishLessons';
import { validateMyanmarInput, calculateStats } from './engine/typingLogic';

// --- USER MANAGEMENT HELPERS ---
const STORAGE_KEY = 'cute_typing_users_v1';

const loadUsers = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const createUser = (name) => {
  const users = loadUsers();
  if (users.find(u => u.name.toLowerCase() === name.toLowerCase())) {
    return null; // User exists
  }
  const newUser = {
    id: Date.now().toString(),
    name,
    myanmar: { levelIndex: 0, lessonIndex: 0 },
    english: { levelIndex: 0, lessonIndex: 0 }
  };
  const updated = [...users, newUser];
  saveUsers(updated);
  return newUser;
};

const deleteUser = (id) => {
  const users = loadUsers();
  const updated = users.filter(u => u.id !== id);
  saveUsers(updated);
};

const updateUserProgress = (userId, mode, levelIndex, lessonIndex) => {
  const users = loadUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return;
  
  users[userIndex][mode] = { levelIndex, lessonIndex };
  saveUsers(users);
};

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [error, setError] = useState('');

  // Game State
  const [mode, setMode] = useState(null); // 'myanmar' | 'english'
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonActive, setLessonActive] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [shake, setShake] = useState(false);
  const [activeKey, setActiveKey] = useState('');

  const inputRef = useRef(null);

  // Load users on start
  useEffect(() => {
    setUsers(loadUsers());
  }, []);

  // Sync state with current user's progress when logging in
  useEffect(() => {
    if (currentUser && mode) {
      const progress = currentUser[mode];
      setCurrentLevelIndex(progress.levelIndex);
      setCurrentLessonIndex(progress.lessonIndex);
      startLesson();
    }
  }, [currentUser, mode]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    const newUser = createUser(newUserName.trim());
    if (newUser) {
      setUsers(loadUsers());
      setCurrentUser(newUser);
      setNewUserName('');
      setError('');
      // Don't auto-start lesson yet, let them pick mode or just show dashboard? 
      // Let's go to Mode Selection for the new user
    } else {
      setError('User already exists!');
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Reset game state, wait for mode selection
    setMode(null); 
    setLessonActive(false);
    setFinished(false);
  };

  const handleDeleteUser = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
      setUsers(loadUsers());
      if (currentUser?.id === id) setCurrentUser(null);
    }
  };

  const selectMode = (selectedMode) => {
    setMode(selectedMode);
    // Progress loading happens in the useEffect above
  };

  const startLesson = () => {
    const curriculum = mode === 'myanmar' ? myanmarCurriculum : englishCurriculum;
    const levelNames = mode === 'myanmar' ? totalLevels : engLevels;
    const currentLevelData = curriculum[levelNames[currentLevelIndex]];
    
    if (!currentLevelData || !currentLevelData[currentLessonIndex]) return;

    setUserInput('');
    setErrors(0);
    setFinished(false);
    setStartTime(Date.now());
    setLessonActive(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleNext = () => {
    const curriculum = mode === 'myanmar' ? myanmarCurriculum : englishCurriculum;
    const levelNames = mode === 'myanmar' ? totalLevels : engLevels;
    const currentLevelData = curriculum[levelNames[currentLevelIndex]];

    let nextLevelIdx = currentLevelIndex;
    let nextLessonIdx = currentLessonIndex;

    if (currentLessonIndex < currentLevelData.length - 1) {
      nextLessonIdx++;
    } else {
      if (currentLevelIndex < levelNames.length - 1) {
        nextLevelIdx++;
        nextLessonIdx = 0;
      } else {
        // Course Complete
        setMode(null); // Go back to dashboard
        return;
      }
    }

    // Update State & Save to DB
    setCurrentLevelIndex(nextLevelIdx);
    setCurrentLessonIndex(nextLessonIdx);
    
    if (currentUser) {
      updateUserProgress(currentUser.id, mode, nextLevelIdx, nextLessonIdx);
      // Update local current user object too
      const updatedUser = { ...currentUser, [mode]: { levelIndex: nextLevelIdx, lessonIndex: nextLessonIdx } };
      setCurrentUser(updatedUser);
    }

    if (currentLessonIndex >= currentLevelData.length - 1 && currentLevelIndex < levelNames.length - 1) {
       // Level Up Scenario
       setLessonActive(false);
       setFinished(true);
    } else {
       startLesson();
    }
  };

  const handleKeyDown = (e) => {
    if (!lessonActive || finished || !currentUser) return;
    if (['Shift', 'Control', 'Alt', 'CapsLock'].includes(e.key)) return;

    setActiveKey(e.key);

    if (e.key === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
      return;
    }

    let typedChar = e.key;
    if (mode === 'myanmar') {
      typedChar = getCharFromKey(e.key, e.shiftKey);
      if (!typedChar) typedChar = e.key;
    }

    const curriculum = mode === 'myanmar' ? myanmarCurriculum : englishCurriculum;
    const levelNames = mode === 'myanmar' ? totalLevels : engLevels;
    const currentLevelData = curriculum[levelNames[currentLevelIndex]];
    const currentLesson = currentLevelData[currentLessonIndex];

    const newUserInput = userInput + typedChar;
    const targetSubstring = currentLesson.text.substring(0, newUserInput.length);

    const validation = mode === 'myanmar'
      ? validateMyanmarInput(newUserInput, targetSubstring)
      : { status: newUserInput === targetSubstring ? (newUserInput.length === currentLesson.text.length ? 'complete' : 'typing') : 'error', match: newUserInput === targetSubstring };

    if (validation.match) {
      setUserInput(newUserInput);
      if (newUserInput.length === currentLesson.text.length) {
        setFinished(true);
        setLessonActive(false);
        triggerConfetti();
        // Save progress immediately on completion if it's the last lesson or just update index
        // We handle saving in handleNext, but we can save "completed" status here if needed.
        // For now, handleNext saves the advancement.
      }
    } else {
      setErrors((prev) => prev + 1);
      triggerShake();
    }
  };

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 300); };
  const triggerConfetti = () => { confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }); };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', () => setActiveKey(''));
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', () => setActiveKey(''));
    };
  }, [userInput, lessonActive, finished, currentLessonIndex, currentLevelIndex, mode, currentUser]);

  const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const stats = calculateStats(userInput.length, errors, timeElapsed);

  // --- SCREEN 1: USER DASHBOARD (Login/Create) ---
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-pastel-bg">
        <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} className="text-5xl font-bold text-gray-700 mb-2">Type Tutor</motion.h1>
        <p className="text-gray-500 mb-8">Select your profile to continue learning</p>

        {/* Create User Form */}
        <form onSubmit={handleCreateUser} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg mb-8">
          <label className="block text-sm font-bold text-gray-600 mb-2">New Student Name</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter name..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 outline-none transition-colors"
            />
            <button type="submit" className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl font-bold transition-transform active:scale-95">
              Create
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        {/* User List */}
        <div className="w-full max-w-md grid gap-4">
          {users.length === 0 && <p className="text-center text-gray-400">No users yet. Create one above!</p>}
          {users.map(user => (
            <motion.div 
              key={user.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleLogin(user)}
              className="bg-white p-4 rounded-2xl shadow-md border-2 border-transparent hover:border-purple-300 cursor-pointer flex justify-between items-center group"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-700">{user.name}</h3>
                <p className="text-xs text-gray-400">Last: {user.myanmar.levelIndex >= 0 ? 'Myanmar' : 'English'} • Lvl {user.myanmar.levelIndex + 1}</p>
              </div>
              <button 
                onClick={(e) => handleDeleteUser(e, user.id)}
                className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              >
                🗑️
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // --- SCREEN 2: MODE SELECTION (After Login) ---
  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-pastel-bg">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-700">Welcome back, <span className="text-pink-500">{currentUser.name}</span>! 👋</h2>
          <p className="text-gray-500 mt-2">Choose your practice mode</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <button onClick={() => selectMode('myanmar')} className="btn-mode bg-pink-200 flex flex-col items-center">
            <span className="text-4xl mb-2">🇲🇲</span>
            <span>Myanmar</span>
            <span className="text-xs font-normal opacity-75 mt-1">Level {currentUser.myanmar.levelIndex + 1}, Lesson {currentUser.myanmar.lessonIndex + 1}</span>
          </button>
          <button onClick={() => selectMode('english')} className="btn-mode bg-blue-200 flex flex-col items-center">
            <span className="text-4xl mb-2">🇺</span>
            <span>English</span>
            <span className="text-xs font-normal opacity-75 mt-1">Level {currentUser.english.levelIndex + 1}, Lesson {currentUser.english.lessonIndex + 1}</span>
          </button>
        </div>
        <button onClick={() => setCurrentUser(null)} className="mt-12 text-gray-400 hover:text-gray-600 font-medium">← Switch User</button>
      </div>
    );
  }

  // --- SCREEN 3: LEVEL UP / COMPLETE MODAL ---
  if (finished && !lessonActive) {
    const curriculum = mode === 'myanmar' ? myanmarCurriculum : englishCurriculum;
    const levelNames = mode === 'myanmar' ? totalLevels : engLevels;
    const currentLevelData = curriculum[levelNames[currentLevelIndex]];
    const isLevelComplete = currentLessonIndex >= currentLevelData.length - 1;
    const isCourseComplete = currentLevelIndex >= levelNames.length - 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-pastel-bg">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full">
          {isLevelComplete && !isCourseComplete ? (
            <>
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold text-purple-600 mb-2">Level Complete!</h2>
              <p className="text-gray-600 mb-6">Great job, {currentUser.name}!</p>
            </>
          ) : isCourseComplete ? (
             <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">Course Mastered!</h2>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
              <div className="grid grid-cols-3 gap-4 mb-8 mt-6">
                <div className="bg-blue-50 p-3 rounded-xl"><div className="text-2xl font-bold text-blue-600">{stats.wpm}</div><div className="text-xs">WPM</div></div>
                <div className="bg-green-50 p-3 rounded-xl"><div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div><div className="text-xs">Acc</div></div>
                <div className="bg-purple-50 p-3 rounded-xl"><div className="text-2xl font-bold text-purple-600">{stats.points}</div><div className="text-xs">Pts</div></div>
              </div>
            </>
          )}

          <button onClick={handleNext} className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-xl text-lg shadow-lg hover:scale-105 transition-transform">
            {isCourseComplete ? 'Finish 🎉' : (isLevelComplete ? 'Start Next Level ➡️' : 'Continue ➡️')}
          </button>
          <button onClick={() => setMode(null)} className="mt-4 text-gray-400 text-sm hover:text-gray-600">Back to Menu</button>
        </motion.div>
      </div>
    );
  }

  // --- SCREEN 4: TYPING PRACTICE ---
  const curriculum = mode === 'myanmar' ? myanmarCurriculum : englishCurriculum;
  const levelNames = mode === 'myanmar' ? totalLevels : engLevels;
  const currentLevelData = curriculum[levelNames[currentLevelIndex]];
  const currentLesson = currentLevelData ? currentLevelData[currentLessonIndex] : null;

  if (!currentLesson) return <div>Loading...</div>;

  return (
    <div className="h-screen w-full flex flex-col bg-pastel-bg overflow-hidden relative">
      {/* Top Bar */}
      <div className="flex-none h-16 flex justify-between items-center px-6 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm z-10">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-lg">😊</div>
           <div className="flex flex-col">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Student</span>
             <span className="text-sm font-bold text-gray-700">{currentUser.name}</span>
           </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress</span>
          <span className="text-sm font-bold text-purple-600 capitalize">{levelNames[currentLevelIndex]} • Lesson {currentLessonIndex + 1}</span>
        </div>
      </div>

      {/* Typing Area */}
      <div className="flex-grow flex items-center justify-center p-4 relative">
        <motion.div animate={{ x: shake ? [-5, 5, -5, 5, 0] : 0 }} className="w-full max-w-5xl bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 relative flex items-center justify-center min-h-[200px]">
          <div className="text-center leading-relaxed max-w-4xl">
            <div className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-700 font-sans tracking-wide break-words">
              {currentLesson.text.split('').map((char, index) => {
                let statusClass = "text-gray-300";
                let isCursor = index === userInput.length;
                if (index < userInput.length) statusClass = "text-green-500 font-semibold";
                return (
                  <span key={index} className={`relative inline-block transition-colors duration-150 ${statusClass}`}>
                    {isCursor && lessonActive && (
                      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute left-0 top-1 bottom-1 w-1 bg-pink-500 rounded-full -ml-1.5 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
                    )}
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
          <input ref={inputRef} className="opacity-0 absolute inset-0" value={userInput} readOnly autoFocus />
        </motion.div>
        <div className="absolute bottom-4 left-0 right-0 text-center h-6">
           {shake && <span className="text-red-500 font-bold text-sm animate-pulse bg-red-100 px-3 py-1 rounded-full inline-block">❌ Wrong key!</span>}
           {!shake && lessonActive && <span className="text-gray-400 text-sm font-medium">Type the highlighted text...</span>}
        </div>
      </div>

      {/* Keyboard */}
      <div className="flex-none pb-6 pt-2 px-2">
        <Keyboard activeKey={activeKey} mode={mode} myanmarMap={myanmarKeyMap} nextRequiredChar={currentLesson.text[userInput.length]} />
      </div>
      
      <style jsx>{` .btn-mode { @apply px-10 py-6 rounded-3xl text-2xl font-bold shadow-lg transition-all transform hover:scale-105 text-white; } `}</style>
    </div>
  );
}

export default App;