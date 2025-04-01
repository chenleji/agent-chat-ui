const USER_ID_KEY = 'lg:chat:userId';

export function getUserId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(USER_ID_KEY);
  } catch (e) {
    console.error('Failed to get user ID from localStorage', e);
    return null;
  }
}

export function setUserId(userId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(USER_ID_KEY, userId);
  } catch (e) {
    console.error('Failed to set user ID in localStorage', e);
  }
}
 