
export const getTenantCreationErrorMessage = (error: any): string => {
  if (error.message?.includes('User already registered')) {
    return 'An account with this email already exists. Please use a different email or sign in instead.';
  } else if (error.message?.includes('correct password')) {
    return 'An account with this email already exists. Please enter the correct password for this account.';
  } else if (error.message?.includes('Password')) {
    return 'Password must be at least 6 characters long';
  } else if (error.message?.includes('email') || error.message?.includes('Email')) {
    return 'Please enter a valid email address with a real domain (e.g., gmail.com, outlook.com)';
  } else if (error.message?.includes('invalid')) {
    return 'Please check your information and try again. Make sure to use a real email address.';
  } else if (error.message?.includes('associate user with tenant') || error.message?.includes('association failed')) {
    return 'Business was created but there was an issue linking it to your account. Please try refreshing the page and logging in, or contact support if the issue persists.';
  } else if (error.message?.includes('row-level security') || error.message?.includes('RLS') || error.message?.includes('authentication issues')) {
    return 'There was an authentication issue during account setup. Please try refreshing the page and attempting the process again.';
  }
  
  return 'Failed to create business and account';
};

export const getTenantCreationSuccessMessage = (isExistingUser: boolean, emailConfirmed: boolean): { title: string; description: string } => {
  if (!emailConfirmed && !isExistingUser) {
    return {
      title: 'Business Created Successfully!',
      description: 'Please check your email and click the confirmation link to complete your account setup. Your business starts with a clean slate - add your data as needed.',
    };
  } else {
    return {
      title: 'Business Created Successfully!',
      description: isExistingUser 
        ? 'Welcome back! Your new business account is ready and starts with empty data tables. You can now add your customers, services, and staff.'
        : 'Welcome to BookingPro. Your business account is ready and starts with empty data tables. You can now add your customers, services, and staff.',
    };
  }
};
