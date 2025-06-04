
// Email validation utility
export const isValidEmail = (email: string): boolean => {
  // Basic email regex that matches most valid email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Only check basic format during development - allow all domains
  return emailRegex.test(email);
};

export const getEmailValidationError = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  // During development, allow all domains including test domains
  return null;
};
