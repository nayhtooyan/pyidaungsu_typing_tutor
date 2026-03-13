import React from 'react';
import { motion } from 'framer-motion';

const Keyboard = ({ activeKey, mode, myanmarMap, nextRequiredChar }) => {
  const rows = [
    ['1','2','3','4','5','6','7','8','9','0','-','='],
    ['q','w','e','r','t','y','u','i','o','p','[',']'],
    ['a','s','d','f','g','h','j','k','l',';',"'"],
    ['z','x','c','v','b','n','m',',','.','/']
  ];

  // Logic to find which key(s) to highlight
  const highlightInfo = React.useMemo(() => {
    if (!nextRequiredChar || mode !== 'myanmar') return { key: null, needsShift: false };

    // Search the map for the character
    for (const [key, char] of Object.entries(myanmarMap)) {
      if (char === nextRequiredChar) {
        // If the matching key in the map is Uppercase (e.g., 'A', 'Q', ':'), we need Shift
        // Note: Number row symbols like '!' are also uppercase shifts usually
        const isUpper = key === key.toUpperCase() && key.length === 1 && isNaN(key); 
        // Better check: Is this key normally lowercase in our rows array?
        const isNormalLower = rows.flat().includes(key.toLowerCase()) && !rows.flat().includes(key);
        
        // If the key found in map is NOT in the standard lowercase row, it likely requires shift
        // Or simply: if the key string itself is Uppercase letter
        const needsShift = /^[A-Z]$/.test(key) || ['!','@','#','$','%','^','&','*','(',')','_','+','{','}','|','<','>','?','"'].includes(key);

        return { key: key.toLowerCase(), needsShift };
      }
    }
    return { key: null, needsShift: false };
  }, [nextRequiredChar, mode, myanmarMap]);

  const getLabel = (key) => {
    const lower = key.toLowerCase();
    const upper = key.toUpperCase();
    const lowerChar = myanmarMap[lower];
    const upperChar = myanmarMap[upper];

    if (mode === 'myanmar' && (lowerChar || upperChar)) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          {/* Shift Char (Top) */}
          <span className={`text-[9px] leading-none mb-1 ${upperChar ? 'text-pink-500 font-bold' : 'text-gray-300'}`}>
            {upper}
          </span>
          
          {/* Main Myanmar Char */}
          <span className="text-lg font-bold text-pastel-text leading-none">
            {upperChar || lowerChar}
          </span>
          
          {/* Normal Char (Bottom) if different */}
          {lowerChar && lowerChar !== upperChar && (
             <span className="text-[10px] text-gray-400 leading-none mt-1">{lowerChar}</span>
          )}
        </div>
      );
    }
    return <span className="text-lg font-bold">{upper}</span>;
  };

  return (
    <div className="bg-white p-4 rounded-3xl shadow-lg mt-8 max-w-5xl mx-auto select-none">
      
      {/* Hint Text */}
      {highlightInfo.key && mode === 'myanmar' && (
        <div className="text-center mb-4">
          {highlightInfo.needsShift ? (
            <motion.div 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} 
              className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold border-2 border-purple-300"
            >
              👆 Hold <span className="text-pink-600">SHIFT</span> + Press <span className="text-pink-600 uppercase">{highlightInfo.key}</span>
            </motion.div>
          ) : (
            <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
              👆 Press <span className="uppercase">{highlightInfo.key}</span>
            </div>
          )}
        </div>
      )}

      {rows.map((row, rIndex) => (
        <div key={rIndex} className="flex justify-center gap-2 mb-2">
          {row.map((key) => {
            const isTargetKey = highlightInfo.key === key;
            const isShiftKey = highlightInfo.needsShift && key === 'shift'; // We will add shift key manually below
            const isActive = activeKey.toLowerCase() === key.toLowerCase() || activeKey === 'Shift';
            
            // Determine styling
            let bgColor = '#FFFFFF';
            let borderColor = '#E5E7EB';
            let textColor = 'text-gray-600';
            let scale = 1;

            if (isTargetKey) {
              bgColor = '#DCFCE7'; // Green bg
              borderColor = '#4ADE80'; // Green border
              scale = 1.1;
              textColor = 'text-green-700';
            } else if (highlightInfo.needsShift && key === 'shift_placeholder') {
               // Handled in special shift row
            } else if (isActive) {
              bgColor = '#FBCFE8';
              borderColor = '#F472B6';
              scale = 0.95;
            }

            // Special handling for Shift Key Visual
            if (key === 'shift_placeholder') return null; 

            return (
              <motion.div
                key={key}
                animate={{ scale, backgroundColor: bgColor, borderColor }}
                className={`
                  w-9 h-12 md:w-12 md:h-14 flex items-center justify-center 
                  rounded-xl border-b-4 shadow-sm transition-colors duration-100
                  ${isTargetKey && highlightInfo.needsShift ? 'animate-pulse z-20 ring-2 ring-purple-400' : ''}
                  ${isTargetKey && !highlightInfo.needsShift ? 'animate-pulse z-20' : ''}
                `}
                style={{ borderWidth: 4 }}
              >
                {getLabel(key)}
              </motion.div>
            );
          })}
        </div>
      ))}

      {/* Special Shift Key Row Visualization (If needed, or add to existing rows) */}
      {highlightInfo.needsShift && (
         <div className="flex justify-center gap-2 mb-2 mt-2">
            <motion.div
              animate={{ scale: 1.1, backgroundColor: '#DCFCE7', borderColor: '#4ADE80' }}
              className="w-32 h-12 flex items-center justify-center rounded-xl border-b-4 border-green-400 shadow-sm animate-pulse z-20 font-bold text-green-700 bg-green-100"
            >
              SHIFT ⇧
            </motion.div>
         </div>
      )}

      {/* Space Bar */}
      <div className="flex justify-center mt-2">
        <motion.div
          animate={{ 
            scale: activeKey === ' ' ? 0.95 : 1,
            backgroundColor: highlightInfo.key === ' ' ? '#DCFCE7' : (activeKey === ' ' ? '#FBCFE8' : '#FFFFFF'),
            borderColor: highlightInfo.key === ' ' ? '#4ADE80' : '#E5E7EB'
          }}
          className={`w-64 h-12 flex items-center justify-center rounded-xl border-b-4 shadow-sm`}
          style={{ borderWidth: 4 }}
        >
          SPACE
        </motion.div>
      </div>
    </div>
  );
};

export default Keyboard;