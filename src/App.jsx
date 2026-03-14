import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Keyboard from './components/Keyboard';
import { myanmarKeyMap, myanmarCurriculum, totalLevels, getCharFromKey } from './data/myanmarLayout';
import { englishCurriculum, totalLevels as engLevels } from './data/englishLessons';
import { validateMyanmarInput, calculateStats } from './engine/typingLogic';

function App() {
  const [mode, setMode] = useState(null);
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

  const curriculum = mode === 'myanmar' ? myanmarCurriculum : englishCurriculum;
  const levelNames = mode === 'myanmar' ? totalLevels : engLevels;
  
  const currentLevelName = levelNames[currentLevelIndex];
  const currentLevelData = curriculum[currentLevelName];
  const currentLesson = currentLevelData ? currentLevelData[currentLessonIndex] : null;

  const startMode = (selectedMode) => {
    setMode(selectedMode);
    setCurrentLevelIndex(0);
    setCurrentLessonIndex(0);
    setTimeout(() => startLesson(), 100);
  };

  const startLesson = () => {
    if (!currentLesson) return;
    setUserInput('');
    setErrors(0);
    setFinished(false);
    setStartTime(Date.now());
    setLessonActive(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleNext = () => {
    const currentLevelData = curriculum[levelNames[currentLevelIndex]];
    if (currentLessonIndex < currentLevelData.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      startLesson();
    } else {
      if (currentLevelIndex < levelNames.length - 1) {
        setCurrentLevelIndex(prev => prev + 1);
        setCurrentLessonIndex(0);
        setLessonActive(false);
        setFinished(true);
      } else {
        setMode(null);
        setCurrentLevelIndex(0);
        setCurrentLessonIndex(0);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (!lessonActive || finished) return;
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
      }
    } else {
      setErrors((prev) => prev + 1);
      triggerShake();
    }
  };

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 300); };
  const triggerConfetti = () => { confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#FBCFE8', '#BAE6FD', '#C4B5FD', '#86EFAC'] }); };

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

  // --- SCREEN 1: MODE SELECTION ---
  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-pastel-bg">
        <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} className="text-5xl font-bold text-gray-700 mb-4">✨ Cute Type Tutor</motion.h1>
        <p className="text-gray-500 mb-12 text-lg">Select a mode to start directly from Beginner Level</p>
        <div className="flex flex-col md:flex-row gap-6">
          <button onClick={() => startMode('english')} className="btn-mode bg-blue-200">🇺🇸 Start English</button>
          <button onClick={() => startMode('myanmar')} className="btn-mode bg-pink-200">🇲🇲 Start Myanmar</button>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: LEVEL UP / COMPLETE ---
  if (finished && !lessonActive) {
    const isLevelComplete = currentLessonIndex >= (curriculum[levelNames[currentLevelIndex]].length - 1);
    const isCourseComplete = currentLevelIndex >= levelNames.length - 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-pastel-bg">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full">
          {isLevelComplete && !isCourseComplete ? (
            <>
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold text-purple-600 mb-2">Level Complete!</h2>
              <p className="text-gray-600 mb-6">You finished <span className="font-bold capitalize">{levelNames[currentLevelIndex]}</span>.</p>
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
            {isCourseComplete ? 'Restart Course 🔄' : (isLevelComplete ? 'Start Next Level ➡️' : 'Continue ➡️')}
          </button>
          <button onClick={() => setMode(null)} className="mt-4 text-gray-400 text-sm hover:text-gray-600">Exit to Menu</button>
        </motion.div>
      </div>
    );
  }

  if (!currentLesson) return <div className="p-10 text-center">End of Course! <button onClick={() => setMode(null)} className="text-blue-500 underline">Home</button></div>;

  // --- SCREEN 3: TYPING AREA (OPTIMIZED UI) ---
  return (
    <div className="h-screen w-full flex flex-col bg-pastel-bg overflow-hidden relative">
      
      {/* Top Bar: Compact Stats */}
      <div className="flex-none h-16 flex justify-between items-center px-6 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Level</span>
          <span className="text-sm font-bold text-purple-600 capitalize">{levelNames[currentLevelIndex]}</span>
        </div>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-blue-500 bg-blue-50 px-3 py-1 rounded-full">WPM: {stats.wpm}</span>
          <span className="text-red-400 bg-red-50 px-3 py-1 rounded-full">Errors: {errors}</span>
        </div>
        <div className="text-[10px] text-gray-400 font-bold">
          Lesson {currentLessonIndex + 1} / {currentLevelData.length}
        </div>
      </div>

      {/* Middle: Typing Area (Fixed Height, No Scroll) */}
      <div className="flex-grow flex items-center justify-center p-4 relative">
        <motion.div 
          animate={{ x: shake ? [-5, 5, -5, 5, 0] : 0 }}
          className="w-full max-w-5xl bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 relative flex items-center justify-center min-h-[200px]"
        >
          <div className="text-center leading-relaxed max-w-4xl">
            <div className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-700 font-sans tracking-wide break-words">
              {currentLesson.text.split('').map((char, index) => {
                let statusClass = "text-gray-300";
                let isCursor = index === userInput.length;
                if (index < userInput.length) statusClass = "text-green-500 font-semibold";
                
                return (
                  <span key={index} className={`relative inline-block transition-colors duration-150 ${statusClass}`}>
                    {isCursor && lessonActive && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="absolute left-0 top-1 bottom-1 w-1 bg-pink-500 rounded-full -ml-1.5 shadow-[0_0_8px_rgba(236,72,153,0.6)]"
                      />
                    )}
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
          <input ref={inputRef} className="opacity-0 absolute inset-0" value={userInput} readOnly autoFocus />
        </motion.div>
        
        {/* Feedback Message */}
        <div className="absolute bottom-4 left-0 right-0 text-center h-6">
           {shake && <span className="text-red-500 font-bold text-sm animate-pulse bg-red-100 px-3 py-1 rounded-full inline-block">❌ Wrong key! Look at the keyboard.</span>}
           {!shake && lessonActive && <span className="text-gray-400 text-sm font-medium">Type the highlighted text...</span>}
        </div>
      </div>

      {/* Bottom: Large Keyboard */}
      <div className="flex-none pb-6 pt-2 px-2">
        <Keyboard activeKey={activeKey} mode={mode} myanmarMap={myanmarKeyMap} nextRequiredChar={currentLesson.text[userInput.length]} />
      </div>
      
      <style jsx>{` .btn-mode { @apply px-10 py-6 rounded-3xl text-2xl font-bold shadow-lg transition-all transform hover:scale-105 text-white; } `}</style>
    </div>
  );
}

export default App;