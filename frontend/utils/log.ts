// frontend/utils/log.ts

export const logError = (err: unknown) => {
    if (__DEV__) {
      console.error('🔴 Error:', err);
    }
  
    // Could also send to a service like Sentry, LogRocket, etc later
  };