export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long"
    };
  }
  
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address"
    };
  }
  
  return { isValid: true };
};