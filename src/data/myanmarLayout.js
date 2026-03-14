// src/data/myanmarLayout.js

export const myanmarKeyMap = {
  // ... Number Row ...
  '1': '၁', '!': 'ဍ', // '!' is shift+1
  '2': '၂', '@': 'ၒ',
  // ... etc ...

  // QWERTY Row
  'q': 'ဆ', 'Q': 'ဈ', // Q (Shift) = ဈ
  'w': 'တ', 'W': 'ဝ',
  'e': 'န', 'E': 'ဣ',
  'r': 'ရ', 'R': 'ြ',
  't': 'အ', 'T': 'ဤ',
  'y': 'ပ', 'Y': '၌',
  'u': 'က', 'U': 'ဥ',
  'i': 'င', 'I': '၍',
  'o': 'သ', 'O': 'ဿ',
  'p': 'စ', 'P': 'ဏ',
  '[': 'ဟ', '{': 'ဧ', // { is Shift+[
  ']': 'ဩ', '}': 'ဪ', // } is Shift+]
  '\\': '၏', '|': '|',

  // ASDF Row
  'a': 'ေ', 'A': 'ဗ', // A (Shift) = ဗ  
  's': 'ျ', 'S': 'ှ',
  'd': 'ိ', 'D': 'ီ',
  'f': '်', 'F': '့',
  'g': 'ာ', 'G': 'ွ',
  'h': 'ွ', 'H': 'ံ', 
  'j': 'ြ', 'J': 'ဲ',
  'k': 'ု', 'K': 'ဒ',
  'l': 'ူ', 'L': 'ဓ',
  ';': 'း', ':': 'ဂ', // : (Shift+;) = ဂ 
  "'": "'", '"': '"',

  // ZXCV Row
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

// Helper function remains the same
export const getCharFromKey = (key, shiftKey) => {
  if (key === ' ') return ' ';
  if (key === 'Backspace') return 'BACKSPACE';
  if (key === 'Enter') return 'ENTER';
  
  const lookupKey = shiftKey ? key.toUpperCase() : key.toLowerCase();
  
  if (myanmarKeyMap[lookupKey]) return myanmarKeyMap[lookupKey];
  if (myanmarKeyMap[key]) return myanmarKeyMap[key];
  
  return null;
};

export const myanmarLessons = [
  { id: 1, title: "Basic", text: "က ခ ဂ င" },
  { id: 2, title: "Shift Keys Practice", text: "ဗ ဂ ဃ ဇ" }, 
  { id: 3, title: "Mixed", text: "မင်္ဂလာပါ ကျေးဇူး" }
];