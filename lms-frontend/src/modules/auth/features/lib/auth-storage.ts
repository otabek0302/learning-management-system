const AUTH_USER_KEY = 'user';

export function saveAuthUser(user: Record<string, unknown>): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // localStorage full or disabled
  }
}

export function loadAuthUser(): Record<string, unknown> | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function clearAuthStorage(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // ignore
  }
}
