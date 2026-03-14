// src/engine/typingLogic.js

export const calculateStats = (totalChars, errors, timeInSeconds) => {
  if (timeInSeconds === 0) return { wpm: 0, accuracy: 100 };
  const grossWPM = (totalChars / 5) / (timeInSeconds / 60);
  const netWPM = Math.max(0, grossWPM - ((errors / timeInSeconds) * 60));
  const accuracy = totalChars > 0 ? Math.max(0, ((totalChars - errors) / totalChars) * 100) : 100;
  return {
    wpm: Math.round(netWPM),
    accuracy: Math.round(accuracy),
    points: Math.round(accuracy * (netWPM / 10))
  };
};

export const validateMyanmarInput = (userSequence, targetSequence) => {
  // Normalize both to handle Unicode reordering (NFC)
  const normalizedUser = userSequence.normalize('NFC');
  const normalizedTarget = targetSequence.normalize('NFC');

  if (normalizedUser === normalizedTarget) {
    return { status: 'complete', match: true };
  }

  if (normalizedTarget.startsWith(normalizedUser)) {
    return { status: 'typing', match: true };
  }

  return { status: 'error', match: false };
};