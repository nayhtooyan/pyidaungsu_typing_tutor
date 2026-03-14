import React from 'react';
import { motion } from 'framer-motion';

const Keyboard = ({ activeKey, mode, myanmarMap, nextRequiredChar }) => {
  const rows = [
    ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
    ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
    ['Caps','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
    ['Shift','z','x','c','v','b','n','m',',','.','/','Shift'],
    ['Ctrl','Alt','Space','AltGr','Ctrl']
  ];

  const highlightInfo = React.useMemo(() => {
    if (!nextRequiredChar || mode !== 'myanmar') return { key: null, needsShift: false };
    for (const [key, char] of Object.entries(myanmarMap)) {
      if (char.trim() === nextRequiredChar.trim()) {
        const isUpper = /^[A-Z]$/.test(key);
        const isSymbol = ['!','@','#','$','%','^','&','*','(',')','_','+','{','}','|','<','>','?','~'].includes(key);
        const needsShift = isUpper || isSymbol || key === '~';
        let displayKey = key.length === 1 ? key.toUpperCase() : key;
        return { key: displayKey, originalKey: key, needsShift };
      }
    }
    return { key: null, needsShift: false };
  }, [nextRequiredChar, mode, myanmarMap]);

  const getLabel = (key) => {
    if (['Shift','Ctrl','Alt','Enter','Backspace','Tab','Caps','Space','AltGr'].includes(key)) {
      return <span className="text-xs font-bold text-gray-500 tracking-wider">{key}</span>;
    }

    const lower = key.toLowerCase();
    const upper = key.toUpperCase();
    const lowerChar = myanmarMap[lower]?.trim();
    const upperChar = myanmarMap[upper]?.trim();

    return (
      <div className="flex flex-col items-center justify-center w-full h-full leading-tight py-1">
        {/* Top: Shift Character (Pink, Bold) */}
        <span className={`text-[10px] md:text-[11px] ${upperChar ? 'text-pink-600 font-bold' : 'text-gray-300'}`}>
          {upperChar || ''}
        </span>
        
        {/* Middle: English Key (Gray, Very Bold) */}
        <span className="text-[11px] md:text-[12px] font-black text-gray-400 my-0.5">
          {upper}
        </span>

        {/* Bottom: Normal Character (Blue, Clear) */}
        {lowerChar && (
          <span className="text-[12px] md:text-[14px] text-blue-600 font-medium">
            {lowerChar}
          </span>
        )}
      </div>
    );
  };

  const getKeyWidth = (key) => {
    if (key === 'Space') return 'w-64 md:w-[28rem]'; // Extra wide space
    if (['Backspace','Enter','Shift'].includes(key)) return 'w-20 md:w-28';
    if (['Tab','Caps'].includes(key)) return 'w-16 md:w-20';
    if (['Ctrl','Alt','AltGr'].includes(key)) return 'w-12 md:w-16';
    return 'w-9 md:w-11'; // Slightly wider normal keys
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-3 md:p-5 rounded-3xl shadow-2xl mx-auto border border-white/50 max-w-6xl">
      {/* Hint Display */}
      {highlightInfo.key && mode === 'myanmar' && (
        <div className="text-center mb-3 h-10 flex items-center justify-center">
          {highlightInfo.needsShift ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-purple-100 text-purple-800 px-5 py-2 rounded-full font-bold border border-purple-200 shadow-sm">
              <span className="bg-white text-purple-600 px-2 py-0.5 rounded text-xs">⇧ Shift</span>
              <span>+</span>
              <span className="bg-white text-purple-700 px-2 py-0.5 rounded uppercase text-sm border border-purple-100">{highlightInfo.key}</span>
            </motion.div>
          ) : (
            <div className="bg-green-100 text-green-800 px-5 py-2 rounded-full font-bold border border-green-200 shadow-sm text-sm">
              Press <span className="uppercase text-base bg-white px-2 py-0.5 rounded mx-1 border border-green-200">{highlightInfo.key}</span>
            </div>
          )}
        </div>
      )}

      {rows.map((row, rIndex) => (
        <div key={rIndex} className="flex justify-center gap-1.5 md:gap-2 mb-2">
          {row.map((key) => {
            const isTargetKey = highlightInfo.key === key || (highlightInfo.needsShift && key === 'Shift');
            const isActive = activeKey.toLowerCase() === key.toLowerCase() || activeKey === key;
            
            let bgColor = '#FFFFFF';
            let borderColor = '#E2E8F0';
            let shadowColor = 'rgba(0,0,0,0.05)';
            let scale = 1;

            if (isTargetKey) {
              bgColor = highlightInfo.needsShift ? '#F3E8FF' : '#DCFCE7';
              borderColor = highlightInfo.needsShift ? '#C084FC' : '#4ADE80';
              scale = 1.05;
            } else if (isActive) {
              bgColor = '#FBCFE8';
              borderColor = '#F472B6';
              scale = 0.95;
            }

            return (
              <motion.div
                key={key}
                animate={{ scale, backgroundColor: bgColor, borderColor }}
                className={`
                  ${getKeyWidth(key)} h-12 md:h-16 flex items-center justify-center 
                  rounded-xl border-b-4 transition-all duration-100 relative select-none
                  ${isTargetKey ? 'animate-pulse z-20 ring-2 ring-offset-2 ' + (highlightInfo.needsShift ? 'ring-purple-400' : 'ring-green-400') : ''}
                `}
                style={{ 
                  borderWidth: 4,
                  boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : `0 4px 0 ${borderColor}`
                }}
              >
                {getLabel(key)}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;