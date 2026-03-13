// src/engine/typingLogic.js

export const checkInput = (userInput, targetText, currentLang) => {
  // Simple character-by-character comparison
  // For Myanmar, since we handle the rendering in the OS/Input method 
  // or via your custom map, we just compare the final string.
  
  if (userInput === targetText) {
    return { status: 'complete', accuracy: 100 };
  }

  const isCorrectSoFar = targetText.startsWith(userInput);
  
  if (!isCorrectSoFar) {
    return { status: 'error', accuracy: 0 };
  }

  const progress = (userInput.length / targetText.length) * 100;
  return { status: 'typing', progress };
};

export const calculateWPM = (charsTyped, timeInSeconds) => {
  if (timeInSeconds === 0) return 0;
  const words = charsTyped / 5;
  const minutes = timeInSeconds / 60;
  return Math.round(words / minutes);
};