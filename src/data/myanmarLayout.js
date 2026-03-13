// src/data/myanmarLayout.js

// INSTRUCTIONS FOR USER:
// Fill this object exactly as your keyboard works.
// Format: 'englishKey': 'myanmarCharacter'
// Example: 'k': 'က', 'K': 'ဒ' (Shift key)

export const myanmarKeyMap = {
  // Number Row
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
  
  // QWERTY Row (Add your specific chars here)
  'q': '', 'Q': '', // e.g., 'q': 'ဆ', 'Q': 'ဈ'
  'w': '', 'W': '',
  'e': '', 'E': '',
  'r': '', 'R': '',
  't': '', 'T': '',
  'y': '', 'Y': '',
  'u': '', 'U': '',
  'i': '', 'I': '',
  'o': '', 'O': '',
  'p': '', 'P': '',
  '[': '', '{': '',
  ']': '', '}': '',
  '\\': '', '|': '',

  // ASDF Row
  'a': '', 'A': '',
  's': '', 'S': '',
  'd': '', 'D': '',
  'f': '', 'F': '',
  'g': '', 'G': '',
  'h': '', 'H': '',
  'j': '', 'J': '',
  'k': '', 'K': '',
  'l': '', 'L': '',
  ';': '', ':': '',
  "'": '', '"': '',

  // ZXCV Row
  'z': '', 'Z': '',
  'x': '', 'X': '',
  'c': '', 'C': '',
  'v': '', 'V': '',
  'b': '', 'B': '',
  'n': '', 'N': '',
  'm': '', 'M': '',
  ',': '', '<': '',
  '.': '', '>': '',
  '/': '', '?': '',
  
  // Special Keys
  'Space': ' ',
  'Backspace': 'BACKSPACE',
  'Enter': 'ENTER',
  'Shift': 'SHIFT_MODIFIER' 
};

export const myanmarLessons = [
  {
    id: 1,
    title: "Basic Consonants",
    text: "က ခ ဂ င စ ဆ ဇ ည" // You can edit these lessons later too
  },
  {
    id: 2,
    title: "Vowels",
    text: "ကာ ကိ ကီ ကု ကူ ကေ ကို"
  }
];