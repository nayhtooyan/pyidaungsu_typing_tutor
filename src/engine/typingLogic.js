export const calculateStats = (totalChars, errors, timeInSeconds) => {
  if (timeInSeconds === 0) return { wpm: 0, accuracy: 100 };
  
  const grossWPM = (totalChars / 5) / (timeInSeconds / 60);
  const netWPM = Math.max(0, grossWPM - ((errors / timeInSeconds) * 60)); // Simple penalty
  
  const accuracy = totalChars > 0 ? Math.max(0, ((totalChars - errors) / totalChars) * 100) : 100;

  return {
    wpm: Math.round(netWPM),
    accuracy: Math.round(accuracy),
    points: Math.round(accuracy * (netWPM / 10)) // Skill points formula
  };
};

// Check if the single character typed is correct
export const validateChar = (typedChar, targetChar) => {
  return typedChar === targetChar;
};