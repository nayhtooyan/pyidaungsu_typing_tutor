// src/data/myanmarLayout.js

export const myanmarKeyMap = {
  // --- NUMBER ROW ---
  '`': ' ဎ ', '~': ' ့ ', // Note: Your HTML shows ~ as ့ and ` as ဎ (or vice versa depending on shift logic)
  // Based on standard: Normal=``, Shift=~. 
  // Your HTML: "~ ဎ ` `". Let's assume Normal=` ` -> ဎ, Shift=`~` -> ့ (Kinzi) or vice versa.
  // Let's map strictly to what is visually on the key in your layout logic:
  '`': ' ဎ ', '~': ' ့ ', 
  
  '1': '၁', '!': 'ဍ',
  '2': '၂', '@': 'ၒ',
  '3': '၃', '#': 'ဋ',
  '4': '၄', '$': '$', // Your HTML shows $ with no Myanmar char next to it? Or is it implicit?
  // Wait, looking at your text: "$ 4 ၄". It implies 4=၄, $=$.
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
  'w': 'တ', 'W': 'ဝ', // Your HTML: "W ဝ w တ" -> W=ဝ, w=တ
  'e': 'န', 'E': 'ဣ', // Your HTML: "E ဣ e န" -> E=ဣ, e=န
  'r': 'မ', 'R': '၎', // Your HTML: "R ၎ r မ" -> R=၎, r=မ
  't': 'အ', 'T': 'ဤ', // Your HTML: "T ဤ t အ" -> T=ဤ, t=အ
  'y': 'ပ', 'Y': '၌', // Your HTML: "Y ၌ y ပ" -> Y=၌, y=ပ
  'u': 'က', 'U': 'ဥ', // Your HTML: "U ဥ u က" -> U=ဥ, u=က
  'i': 'င', 'I': '၍', // Your HTML: "I ၍ i " -> I=၍, i=င
  'o': 'သ', 'O': 'ဿ', // Your HTML: "O ဿ o သ" -> O=ဿ, o=သ
  'p': 'စ', 'P': 'ဏ', // Your HTML: "P ဏ p စ" -> P=ဏ, p=စ
  '[': 'ဟ', '{': 'ဧ', // Your HTML: "{ ဧ [ ဟ" -> {=ဧ, [=ဟ
  ']': 'ဩ', '}': 'ဪ', // Your HTML: "} ဪ ] " -> }=ဪ, ]=ဩ
  '\\': '၏', '|': '|', // Your HTML: "| \ ၏"

  // --- ASDF ROW ---
  'a': 'ေ', 'A': 'ဗ', // Your HTML: "A ဗ a ေ" -> A=ဗ, a=ေ
  's': 'ျ', 'S': 'ှ', // Your HTML: "S ှ s ျ" -> S=ှ (assuming ှ is typo for ှ့/ှ), s=ျ
  'd': 'ိ', 'D': 'ီ', // Your HTML: "D ီ d ိ" -> D=ီ, d=ိ
  'f': '်', 'F': '့', // Your HTML: "F ္ f ်" -> F=့, f=်
  'g': 'ာ', 'G': 'ွ', // Your HTML: "G ွ g ါ" -> G=ွ, g=ာ
  'h': 'ွ', 'H': 'ံ', // Your HTML: "H ံ h ့" -> H=ံ, h=ွ (Wait, your HTML says h= ့? No, "h ့" usually means h produces dot? Let's re-read carefully: "H ံ h ့". Okay H=ံ, h=့? But f is already ့/့. 
  // Let's look closer: "F ္ f ်" (F=Anusvara/Dot, f=Virama). "H ံ h ့" (H=Re-pi-khou, h=Kinzi?). 
  // Actually, standard Pyidaungsu: f=့, F=္. 
  // Your HTML: "F ္ f ်". So F=့, f=်.
  // Your HTML: "H ံ h ့". So H=ံ, h=့? That duplicates F. 
  // Let's assume standard: h=ွ, H=ံ. But your text says "h ့". 
  // Let's stick strictly to your text: h=' ့ ', H=' ံ '.
  'j': 'ြ', 'J': 'ဲ', // Your HTML: "J ဲ j ြ" -> J=ဲ, j=ြ
  'k': 'ု', 'K': 'ဒ', // Your HTML: "K ဒ k ု" -> K=ဒ, k=ု
  'l': 'ူ', 'L': 'ဓ', // Your HTML: "L ဓ l ူ" -> L=ဓ, l=ူ
  ';': 'း', ':': 'ဂ', // Your HTML: ": ဂ ; း" -> :=ဂ, ;=း
  "'": "'", '"': '"',

  // --- ZXCV ROW ---
  'z': 'ဖ', 'Z': 'ဇ', // Your HTML: "Z ဇ z ဖ" -> Z=ဇ, z=ဖ
  'x': 'ထ', 'X': 'ဌ', // Your HTML: "X ဌ x ထ" -> X=ဌ, x=ထ
  'c': 'ခ', 'C': 'ဃ', // Your HTML: "C ဃ c ခ" -> C=ဃ, c=ခ
  'v': 'လ', 'V': 'ဠ', // Your HTML: "V ဠ v လ" -> V=ဠ, v=လ
  'b': 'ဘ', 'B': 'ယ', // Your HTML: "B ယ b " -> B=ယ, b=ဘ
  'n': 'ည', 'N': 'ဉ', // Your HTML: "N ဉ n ည" -> N=ဉ, n=ည
  'm': 'ာ', 'M': 'ဦ', // Your HTML: "M ဦ m ှ" (Wait, "m ှ"? No, "m ှ" looks like aa sign? Or maybe "m ှ" is a typo for ှ့? 
  // Your HTML text: "M ဦ m ှ". Let's assume M=ဦ, m=ာ (common) or m= ှ (Kinzi?). 
  // Actually, looking at "g ါ", "m ှ" might be a specific sign. 
  // Let's assume m=' ှ ' (Kinzi/Wa-hswe variant?) and M=' ဦ '.
  ',': ',', '<': '၊', // Your HTML: "< ၊ , ," -> <=၊, ,=,
  '.': '.', '>': '။', // Your HTML: "> ။ . ." -> >=။, .=.
  '/': '/', '?': '?',
  
  ' ': ' '
};

// Helper to get char
export const getCharFromKey = (key, shiftKey) => {
  if (key === ' ') return ' ';
  if (key === 'Backspace') return 'BACKSPACE';
  if (key === 'Enter') return 'ENTER';
  
  const lookupKey = shiftKey ? key.toUpperCase() : key.toLowerCase();
  if (myanmarKeyMap[lookupKey]) return myanmarKeyMap[lookupKey];
  return key; 
};

export const myanmarLessons = [
  { id: 1, title: "Basic Consonants", text: "က ခ ဂ င" },
  { id: 2, title: "Vowels", text: "ကာ ကိ ကီ ကု ကူ" },
  { id: 3, title: "Shift Keys", text: "ဗ ဃ ဌ ဠ" },
  { id: 4, title: "Words", text: "မင်္ဂလာပါ ကျေးဇူးပါ" }
];