import React from 'react';
import { motion } from 'framer-motion';

const Keyboard = ({ activeKey, mode, myanmarMap, nextRequiredChar }) => {
  // Define rows exactly as per your HTML layout order
  const rows = [
    ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
    ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
    ['Caps','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
    ['Shift','z','x','c','v','b','n','m',',','.','/','Shift'],
    ['Ctrl','Alt','Space','AltGr','Ctrl']
  ];

  // Determine which key(s) to highlight
  const highlightInfo = React.useMemo(() => {
    if (!nextRequiredChar || mode !== 'myanmar') return { key: null, needsShift: false };

    for (const [key, char] of Object.entries(myanmarMap)) {
      if (char.trim() === nextRequiredChar.trim()) {
        const isUpper = /^[A-Z]$/.test(key);
        const isSymbol = ['!','@','#','$','%','^','&','*','(',')','_','+','{','}','|','<','>','?','~'].includes(key);
        const needsShift = isUpper || isSymbol || key === '~';
        
        // Handle special keys display
        let displayKey = key.toLowerCase();
        if (key === 'Backspace' || key === 'Enter' || key === 'Tab' || key === 'Caps' || key === 'Shift' || key === 'Ctrl' || key === 'Alt') {
           displayKey = key;
        }

        return { key: displayKey, originalKey: key, needsShift };
      }
    }
    return { key: null, needsShift: false };
  }, [nextRequiredChar, mode, myanmarMap]);

  const getLabel = (key) => {
    const lower = key.toLowerCase();
    const upper = key.toUpperCase();
    
    // Special handling for non-letter keys
    if (['Shift','Ctrl','Alt','Enter','Backspace','Tab','Caps','Space','AltGr'].includes(key)) {
      return <span className="text-sm font-bold text-gray-500">{key}</span>;
    }

    const lowerChar = myanmarMap[lower]?.trim();
    const upperChar = myanmarMap[upper]?.trim();

    if (mode === 'myanmar' && (lowerChar || upperChar)) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full leading-tight">
          {/* Top Character (Shift) */}
          <span className={`text-[10px] ${upperChar ? 'text-pink-600 font-bold' : 'text-gray-300'}`}>
            {upperChar || upper}
          </span>
          
          {/* Bottom Character (Normal) */}
          {lowerChar && (
             <span className="text-[12px] text-gray-600 font-medium mt-0.5">{lowerChar}</span>
          )}
        </div>
      );
    }
    return <span className="text-lg font-bold text-gray-600">{key.toUpperCase()}</span>;
  };

  const getKeyWidth = (key) => {
    if (key === 'Space') return 'w-64 md:w-96';
    if (key === 'Backspace' || key === 'Enter' || key === 'Shift') return 'w-20 md:w-24';
    if (key === 'Tab' || key === 'Caps') return 'w-16 md:w-20';
    if (key === 'Ctrl' || key === 'Alt' || key === 'AltGr') return 'w-12 md:w-16';
    return 'w-8 md:w-10';
  };

  return (
    <div className="bg-white p-4 rounded-3xl shadow-xl mt-8 max-w-5xl mx-auto select-none border border-gray-100">
      
      {/* Hint Display */}
      {highlightInfo.key && mode === 'myanmar' && (
        <div className="text-center mb-4 h-14 flex items-center justify-center">
          {highlightInfo.needsShift ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-purple-50 text-purple-800 px-6 py-3 rounded-full font-bold border-2 border-purple-200 shadow-sm">
              <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-md">⇧ Shift</span>
              <span>+</span>
              <span className="bg-white text-purple-700 px-3 py-1 rounded-md uppercase border border-purple-100">{highlightInfo.key}</span>
            </motion.div>
          ) : (
            <div className="bg-green-50 text-green-800 px-6 py-3 rounded-full font-bold border-2 border-green-200 shadow-sm">
              Press <span className="uppercase text-lg">{highlightInfo.key}</span>
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
            let borderColor = '#E5E7EB';
            let textColor = 'text-gray-600';
            let scale = 1;

            if (isTargetKey) {
              bgColor = highlightInfo.needsShift && key === 'Shift' ? '#F3E8FF' : (highlightInfo.needsShift ? '#F3E8FF' : '#DCFCE7');
              borderColor = highlightInfo.needsShift && key === 'Shift' ? '#C084FC' : (highlightInfo.needsShift ? '#C084FC' : '#4ADE80');
              textColor = 'text-purple-700';
              scale = 1.05;
            } else if (isActive) {
              bgColor = '#FBCFE8';
              borderColor = '#F472B6';
              scale = 0.95;
            }

            const widthClass = getKeyWidth(key);

            return (
              <motion.div
                key={key}
                animate={{ scale, backgroundColor: bgColor, borderColor }}
                className={`
                  ${widthClass} h-10 md:h-14 flex items-center justify-center 
                  rounded-lg md:rounded-xl border-b-4 shadow-sm transition-colors duration-100 relative
                  ${isTargetKey ? 'animate-pulse z-20 ring-2 ring-offset-1 ' + (highlightInfo.needsShift ? 'ring-purple-400' : 'ring-green-400') : ''}
                `}
                style={{ borderWidth: 4 }}
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