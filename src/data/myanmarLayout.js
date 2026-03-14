// src/data/myanmarLayout.js

// EXACT MAPPING FROM YOUR HTML FILE
// Logic: Based on your HTML "Top Shift / Bottom Normal" structure
export const myanmarKeyMap = {
  // --- NUMBER ROW & SYMBOLS ---
  '~': 'ဎ', '`': '`', 
  '1': '၁', '!': 'ဍ',
  '2': '၂', '@': 'ၒ',
  '3': '၃', '#': 'ဋ',
  '4': '၄', '$': '$',
  '5': '၅', '%': '%',
  '6': '၆', '^': '^',
  '7': '၇', '&': 'ရ',
  '8': '၈', '*': '*',
  '9': '၉', '(': '(',
  '0': '၀', ')': ')',
  '-': '-', '_': '_',
  '=': '=', '+': '+',

  // --- QWERTY ROW ---
  'q': 'ဆ', 'Q': 'ဈ',
  'w': 'တ', 'W': 'ဝ',
  'e': 'န', 'E': 'ဣ',
  'r': 'မ', 'R': '၎',
  't': 'အ', 'T': 'ဤ',
  'y': 'ပ', 'Y': '၌',
  'u': 'က', 'U': 'ဥ',
  'i': 'င', 'I': '၍',
  'o': 'သ', 'O': 'ဿ',
  'p': 'စ', 'P': 'ဏ',
  '[': 'ဟ', '{': 'ဧ',
  ']': 'ဩ', '}': 'ဪ',
  '\\': '၏', '|': '|',

  // --- ASDF ROW ---
  'a': 'ေ', 'A': 'ဗ',
  's': 'ျ', 'S': 'ှ', 
  'd': 'ိ', 'D': 'ီ',
  'f': '်', 'F': '့', 
  'g': 'ာ', 'G': 'ွ',
  'h': ' ့ ', 'H': 'ံ', 
  'j': 'ြ', 'J': 'ဲ',
  'k': 'ု', 'K': 'ဒ',
  'l': 'ူ', 'L': 'ဓ',
  ';': 'း', ':': 'ဂ',
  "'": "'", '"': '"',

  // --- ZXCV ROW ---
  'z': 'ဖ', 'Z': 'ဇ',
  'x': 'ထ', 'X': 'ဌ',
  'c': 'ခ', 'C': 'ဃ',
  'v': 'လ', 'V': 'ဠ',
  'b': 'ဘ', 'B': 'ယ',
  'n': 'ည', 'N': 'ဉ',
  'm': 'ာ', 'M': 'ဦ', 
  ',': ',', '<': '၊',
  '.': '.', '>': '။',
  '/': '/', '?': '?',
  
  ' ': ' '
};

// Helper to get character from key event
export const getCharFromKey = (key, shiftKey) => {
  if (key === ' ') return ' ';
  if (key === 'Backspace') return 'BACKSPACE';
  if (key === 'Enter') return 'ENTER';
  
  const lookupKey = shiftKey ? key.toUpperCase() : key.toLowerCase();
  if (myanmarKeyMap[lookupKey]) return myanmarKeyMap[lookupKey];
  return key; 
};

// 4-LEVEL CURRICULUM STRUCTURE
// Beginner Level filled with your 18 lessons
export const myanmarCurriculum = {
  beginner: [
    { id: 'm_b_1', title: 'Lesson 1: က ခ ဂ ဃ င', text: 'က က က က က က က က က က ခ ခ  ခ ခ ခ  ခ ခ ခ  ဂ ဂ ဂ  ဂ ဂ ဂ  ဂ ဃ ဃ  ဃ ဃ ဃ  ဃ ဃ ဃ  င င င  င င င  င ကခ ကခ ကခ ကခ ကခ ခဂ ခဂ ခဂ ခဂ ခဂ ဂဃ ဂဃ ဂဃ ဂဃ ဂဃ ဃင ဃင ဃင င ဃင ကခဂဃင ကခဂဃင ကခဂဃင ငဃဂခက ငဃဂခက ငဃဂခက' },
    { id: 'm_b_2', title: 'Lesson 2: စ ဆ ဇ ဈ ည', text: 'စ စ စ စ စ စ စ စ ဆ ဆ ဆ ဆ ဆ ဆ ဆ ဆ ဇ ဇ ဇ ဇ ဇ ဇ ဇ ဇ ဈ ဈ ဈ ဈ ဈ ဈ ဈ ဈ ည ည ည ည ည ည ည ည စဆ စဆ စဆ စဆ ဆဇ ဆဇ ဆဇ ဆဇ ဇဈ ဇဈ ဇဈ ဇဈ ဈည ဈည ဈည ဈည စဆဇဈည စဆဇဈည စဆဇဈည ညဈဇဆစ ညဈဆစ ညဈဆစ' },
    { id: 'm_b_3', title: 'Lesson 3: Combine 1 + 2', text: 'က စ ခ ဆ ဂ ဇ ဃ ဈ င ည ကစခဆဂဇဃဈငည ညငဈဃဂဆခစက ကခဂဃငစဆဇဈည ညဈဆစငဂခက' },
    { id: 'm_b_4', title: 'Lesson 4: ဋ ဌ ဍ ဎ ဏ', text: 'ဋ ဋ ဋ ဋ ဋ ဌ ဌ ဌ ဌ  ဍ ဍ ဍ ဍ ဍ ဎ ဎ ဎ ဎ ဎ ဏ ဏ ဏ ဏ ဏ ဋဌ ဋဌ ဌ ဋဌ ဍ ဌဍ ဍ ဌဍ ဎ ဍဎ ဍဎ ဍဎ ဎ ဎဏ ဎဏ ဎဏ ဋဌဍဎဏ ဋဌဍဎဏ ဏဎဍဌဋ ဏဎဍဌဋ' },
    { id: 'm_b_5', title: 'Lesson 5: တ ထ ဒ ဓ န', text: 'တ တ တ တ တ ထ ထ ထ ထ ထ ဒ ဒ ဒ ဒ ဒ ဓ ဓ  ဓ ဓ န န န န န တထ တထ တထ ထဒ ထဒ ထဒ ဒဓ ဒဓ ဒဓ ဓန ဓန ဓန တထဒဓန တထဒဓန နဓဒထတ နဓဒထတ' },
    { id: 'm_b_6', title: 'Lesson 6: ပ ဖ ဗ ဘ မ', text: 'ပ ပ ပ ပ ပ ဖ ဖ ဖ ဖ ဖ ဗ ဗ ဗ ဗ ဗ ဘ ဘ ဘ ဘ ဘ မ မ မ မ မ ပဖ ပဖ ပဖ ဖဗ ဖ ဖဗ ဗဘ ဗဘ ဗဘ ဘမ ဘမ ဘမ ပဖဗဘမ ပဖဗဘမ မဘဗဖပ မဘဗဖပ' },
    { id: 'm_b_7', title: 'Lesson 7: ယ ရ လ ', text: 'ယ  ယ ယ ရ ရ ရ ရ လ လ လ လ ဝ ဝ  ဝ ယရ ရ ယရ ရလ ရလ ရလ လဝ လဝ လဝ ယရလဝ ယရလဝ ဝလရယ ဝလရယ' },
    { id: 'm_b_8', title: 'Lesson 8: သ ဟ ဠ အ', text: 'သ သ သ သ ဟ ဟ  ဟ ဠ ဠ ဠ ဠ အ အ အ အ သဟ သဟ သဟ ဟဠ ဟ ဟဠ ဠအ ဠအ ဠအ သဟဠအ သဟဠအ အဠဟသ အဠဟသ' },
    { id: 'm_b_9', title: 'Lesson 9: All Consonants', text: 'ကခဂဃငစဆဇဈည တထဒဓနပဖဗဘမ ယရလဝသဟဠအ ကခဂဃင စဆဇဈည တထဒဓန ပဖဗဘမ ယရလဝ သဟဠအ' },
    { id: 'm_b_10', title: 'Lesson 10: Basic Words', text: 'မမ မန နာ နု မနာ မမနာ' },
    { id: 'm_b_11', title: 'Lesson 11: More Words', text: 'နာမည် မနက် နမူ မနာ' },
    { id: 'm_b_12', title: 'Lesson 12: Simple Sentences', text: 'မမ နာမည် မနက် နာရီ မမ မနက် လာ' },
    { id: 'm_b_13', title: 'Lesson 13: Speed Practice', text: 'မမမမမ မမမမမ မမမမမ နနနနန နနနနန နနနနန မနမနမန မနမနမန' },
    { id: 'm_b_14', title: 'Lesson 14: Mixed Practice', text: 'မနက် မမ နာမည် မနက် မမ လာ မမ မနက် စာ' },
    { id: 'm_b_15', title: 'Lesson 15: Paragraph Practice', text: 'မမ မနက် စာ လေ့လာ မမ မနက် လာ မမ နာမည် လှ' },
    { id: 'm_b_16', title: 'Lesson 16: Speed Lines', text: 'မမ မမ မမ မမ မမ နာ နာ နာ နာ နာ မနက် မနက် မနက်' },
    { id: 'm_b_17', title: 'Lesson 17: Long Practice', text: 'မမ မနက် စာ လေ့လာ မမ နာမည် လှ မမ မနက် လာ' },
    { id: 'm_b_18', title: 'Lesson 18: Final Beginner Test', text: 'မမ မနက် စာ လေ့လာ မမ နာမည် လှ မမ မနက် လာ မမ စာ ဖတ်' }
  ],
  basic: [
    { id: 'm_bas_1', title: 'Virama Stacking (်)', text: '' }, 
    { id: 'm_bas_2', title: 'Kinzi/Dot (့)', text: '' },       
    { id: 'm_bas_3', title: 'Common Phrases', text: '' }
  ],
  intermediate: [
    { id: 'm_i_1', title: 'Complex Sentences', text: '' },
    { id: 'm_i_2', title: 'Paragraph Practice', text: '' }
  ],
  speed: [
    { id: 'm_s_1', title: 'Speed Drill 1', text: '' },
    { id: 'm_s_2', title: 'Speed Drill 2', text: '' }
  ]
};

export const totalLevels = ['beginner', 'basic', 'intermediate', 'speed'];