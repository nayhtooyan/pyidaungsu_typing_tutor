import React, { useState, useEffect } from 'react';
import { myanmarKeyMap, myanmarLessons } from './data/myanmarLayout';
import { englishLessons } from './data/englishLessons'; // Assume this exists
import { checkInput, calculateWPM } from './engine/typingLogic';
import { motion, AnimatePresence } from 'framer-motion';

// 🎨 Pastel Color Palette
const colors = {
  bg: 'bg-pink-50',
  card: 'bg-white',
  primary: 'bg-purple-200 hover:bg-purple-300',
  accent: 'text-pink-400',
  key: 'bg-blue-100 border-b-4 border-blue-200 active:border-b-0 active:translate-y-1',
  keyActive: 'bg-green-200 border-green-300',
  keyError: 'bg-red-200 border-red-300',
};

function App() {
  const [mode, setMode] = useState('english'); // 'english' or 'myanmar'
  const [lesson, setLesson] = useState(null);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100 });
  const [startTime, setStartTime] = useState(null);

  const startLesson = (selectedLesson) => {
    setLesson(selectedLesson);
    setInput('');
    setStartTime(Date.now());
  };

  const handleKeyDown = (e) => {
    if (!lesson) return;
    
    // Prevent default for some keys if needed, but mostly let browser handle
    if (e.key === 'Backspace') {
      setInput((prev) => prev.slice(0, -1));
      return;
    }
    
    if (e.key.length === 1) {
      const newText = input + e.key;
      const result = checkInput(newText, lesson.text, mode);
      
      if (result.status !== 'error') {
        setInput(newText);
        if (startTime) {
          const timeElapsed = (Date.now() - startTime) / 1000;
          setStats({
            wpm: calculateWPM(newText.length, timeElapsed),
            accuracy: result.status === 'complete' ? 100 : 100
          });
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, lesson, startTime]);

  return (
    <div className={`min-h-screen ${colors.bg} font-sans flex flex-col items-center justify-center p-4`}>
      
      {/* Header */}
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold text-gray-700 mb-8 flex items-center gap-2"
      >
        ✨ Cute Type Tutor 🇲🇲
      </motion.h1>

      {/* Mode Selection */}
      {!lesson && (
        <div className="flex gap-4">
          <button 
            onClick={() => startLesson(englishLessons[0])}
            className={`${colors.primary} text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all`}
          >
            🇺🇸 English Mode
          </button>
          <button 
            onClick={() => startLesson(myanmarLessons[0])}
            className={`${colors.primary} text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all`}
          >
            🇲 Myanmar Mode
          </button>
        </div>
      )}

      {/* Typing Area */}
      {lesson && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${colors.card} p-8 rounded-3xl shadow-xl w-full max-w-3xl text-center`}
        >
          <div className="flex justify-between mb-6 text-gray-500">
            <span>Mode: {mode === 'english' ? 'English' : 'Myanmar'}</span>
            <span>WPM: {stats.wpm} 🚀</span>
          </div>

          <div className="text-2xl md:text-3xl font-medium text-gray-400 mb-2 relative">
            {/* Target Text */}
            <div className="absolute inset-0 select-none">
              {lesson.text.split('').map((char, index) => {
                let colorClass = 'text-gray-300';
                if (index < input.length) {
                  colorClass = input[index] === char ? 'text-green-500' : 'text-red-500 bg-red-100';
                }
                return <span key={index} className={colorClass}>{char}</span>;
              })}
            </div>
            {/* Invisible Input to capture focus */}
            <input 
              className="opacity-0 absolute inset-0 w-full h-full cursor-default" 
              value={input} 
              readOnly 
              autoFocus 
            />
          </div>
          
          <p className="mt-12 text-gray-400 text-sm">Start typing above... ({input.length}/{lesson.text.length})</p>

          {input.length === lesson.text.length && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="mt-8 p-4 bg-green-100 text-green-600 rounded-xl font-bold text-xl"
            >
              🎉 Amazing! Lesson Complete! 🎉
              <br/>
              <button 
                onClick={() => setLesson(null)} 
                className="mt-4 px-6 py-2 bg-green-300 rounded-lg hover:bg-green-400"
              >
                Next Lesson ➡️
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Cute Virtual Keyboard Visualization (Optional Decor) */}
      <div className="mt-8 grid grid-cols-10 gap-1 opacity-50">
        {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
          <div key={k} className={`w-8 h-8 ${colors.key} rounded-md flex items-center justify-center text-xs`}>{k}</div>
        ))}
      </div>
    </div>
  );
}

export default App;