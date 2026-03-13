import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Keyboard from './components/Keyboard';
import { myanmarKeyMap, myanmarLessons, getCharFromKey } from './data/myanmarLayout';
import { englishLessons } from './data/englishLessons';
import { calculateStats } from './engine/typingLogic';

function App() {
  const [mode, setMode] = useState(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [lessonActive, setLessonActive] = useState(false);
  
  const [userInput, setUserInput] = useState('');
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [shake, setShake] = useState(false);
  const [activeKey, setActiveKey] = useState('');
  
  const inputRef = useRef(null);

  const currentLesson = mode 
    ? (mode === 'english' ? englishLessons[currentLevelIndex] : myanmarLessons[currentLevelIndex]) 
    : null;

  const nextRequiredChar = currentLesson ? currentLesson.text[userInput.length] : null;

  const startLesson = () => {
    setUserInput('');
    setErrors(0);
    setFinished(false);
    setStartTime(Date.now());
    setLessonActive(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e) => {
    if (!lessonActive || finished) return;
    
    // Ignore modifier keys alone
    if (['Shift', 'Control', 'Alt', 'CapsLock'].includes(e.key)) return;

    setActiveKey(e.key);

    if (e.key === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
      return;
    }

    // Determine what character this key press actually produced
    let typedChar = e.key;
    
    if (mode === 'myanmar') {
      // Use our custom map to determine the character
      typedChar = getCharFromKey(e.key, e.shiftKey);
      
      // Fallback: If map returns null, maybe it's a symbol not in map, use raw key
      if (!typedChar) typedChar = e.key;
    }

    // STRICT VALIDATION AGAINST TARGET
    const targetChar = currentLesson.text[userInput.length];

    if (typedChar === targetChar) {
      const newInput = userInput + typedChar;
      setUserInput(newInput);

      if (newInput.length === currentLesson.text.length) {
        finishLesson();
      }
    } else {
      // WRONG KEY
      setErrors((prev) => prev + 1);
      triggerShake();
      // Do NOT advance input. Cursor stays.
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const finishLesson = () => {
    setFinished(true);
    setLessonActive(false);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#FBCFE8', '#BAE6FD', '#C4B5FD', '#86EFAC'] });
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < (mode === 'english' ? englishLessons.length : myanmarLessons.length) - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setLessonActive(false);
      setFinished(false);
    } else {
      setMode(null);
      setCurrentLevelIndex(0);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', () => setActiveKey(''));
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', () => setActiveKey(''));
    };
  }, [userInput, lessonActive, finished, currentLesson, mode]);

  const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const stats = calculateStats(userInput.length, errors, timeElapsed);

  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-pastel-bg">
        <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} className="text-5xl font-bold text-gray-700 mb-12">✨ Cute Type Tutor 🇲🇲</motion.h1>
        <div className="flex gap-6">
          <button onClick={() => { setMode('english'); setCurrentLevelIndex(0); }} className="btn-mode bg-blue-200">🇺 English</button>
          <button onClick={() => { setMode('myanmar'); setCurrentLevelIndex(0); }} className="btn-mode bg-pink-200">🇲🇲 Myanmar</button>
        </div>
      </div>
    );
  }

  if (!lessonActive && !finished) {
    return (
      <div className="min-h-screen p-8 bg-pastel-bg">
        <button onClick={() => setMode(null)} className="mb-6 text-gray-500 font-bold">← Exit</button>
        <h2 className="text-3xl font-bold mb-8 text-gray-700">Select Lesson ({mode})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(mode === 'english' ? englishLessons : myanmarLessons).map((lesson, idx) => (
            <motion.button key={lesson.id} whileHover={{ scale: 1.05 }} onClick={() => { setCurrentLevelIndex(idx); startLesson(); }}
              className={`p-6 rounded-2xl shadow-lg text-left border-4 ${idx === currentLevelIndex ? 'border-pink-400 bg-white' : 'border-transparent bg-white/50'}`}>
              <div className="text-sm font-bold text-pink-500 mb-2">Level {idx + 1}</div>
              <h3 className="font-bold text-xl text-gray-700">{lesson.title}</h3>
              <p className="text-gray-400 mt-2 truncate">{lesson.text}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-pastel-bg relative">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-md">
        <div className="font-bold text-gray-500">Level {currentLevelIndex + 1}</div>
        <div className="flex gap-6 text-lg font-bold">
          <span className="text-blue-500">WPM: {stats.wpm}</span>
          <span className="text-red-400">Errors: {errors}</span>
          <span className="text-green-500">Accuracy: {stats.accuracy}%</span>
        </div>
        <button onClick={() => setLessonActive(false)} className="text-xs text-gray-400 hover:text-red-500">Quit</button>
      </div>

      <motion.div 
        animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-4xl text-center relative min-h-[200px] flex items-center justify-center"
      >
        <div className="text-4xl md:text-5xl font-medium leading-relaxed font-sans tracking-wide">
          {currentLesson.text.split('').map((char, index) => {
            let statusClass = "text-gray-300";
            let isCursor = index === userInput.length;
            if (index < userInput.length) statusClass = "text-green-500";

            return (
              <span key={index} className={`relative inline-block ${statusClass}`}>
                {isCursor && lessonActive && (
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                    className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 -ml-1" />
                )}
                {char}
              </span>
            );
          })}
        </div>
        <input ref={inputRef} className="opacity-0 absolute inset-0" value={userInput} readOnly autoFocus />
      </motion.div>

      <div className="h-8 mt-4 font-bold text-lg">
        {shake && <span className="text-red-500 animate-pulse">❌ Wrong key! Look at the green key on keyboard.</span>}
        {!shake && lessonActive && <span className="text-gray-400">Press the highlighted green key...</span>}
      </div>

      {/* Pass nextRequiredChar to Keyboard */}
      <Keyboard activeKey={activeKey} mode={mode} myanmarMap={myanmarKeyMap} nextRequiredChar={nextRequiredChar} />

      <AnimatePresence>
        {finished && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full m-4">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
              <div className="grid grid-cols-3 gap-4 mb-8 mt-6">
                <div className="bg-blue-50 p-3 rounded-xl"><div className="text-2xl font-bold text-blue-600">{stats.wpm}</div><div className="text-xs text-blue-400">WPM</div></div>
                <div className="bg-green-50 p-3 rounded-xl"><div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div><div className="text-xs text-green-400">Accuracy</div></div>
                <div className="bg-purple-50 p-3 rounded-xl"><div className="text-2xl font-bold text-purple-600">{stats.points}</div><div className="text-xs text-purple-400">Points</div></div>
              </div>
              <button onClick={handleNextLevel} className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-xl text-lg shadow-lg hover:scale-105 transition-transform">
                {currentLevelIndex < (mode === 'english' ? englishLessons.length : myanmarLessons.length) - 1 ? "Next Level ➡️" : "Finish Course 🎉"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{` .btn-mode { @apply px-10 py-6 rounded-3xl text-2xl font-bold shadow-lg transition-all transform hover:scale-105 text-white; } `}</style>
    </div>
  );
}

export default App;