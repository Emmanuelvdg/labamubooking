
// Email validation utility
export const isValidEmail = (email: string): boolean => {
  // Basic email regex that matches most valid email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Check basic format
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Additional checks for common test domains that Supabase might reject
  const invalidDomains = ['test.com', 'example.com', 'demo.com', 'temp.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (invalidDomains.includes(domain)) {
    return false;
  }
  
  return true;
};

export const getEmailValidationError = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  const domain = email.split('@')[1]?.toLowerCase();
  const invalidDomains = ['test.com', 'example.com', 'demo.com', 'temp.com'];
  
  if (invalidDomains.includes(domain)) {
    return 'Please use a real email address (not a test domain)';
  }
  
  return null;
};
