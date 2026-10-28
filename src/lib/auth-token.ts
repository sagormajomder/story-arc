import { API_BASE_URL, API_ENDPOINTS } from '@src/config/api.config';

let memoryAccessToken: string | null = null;
let lastRefreshTimestamp = 0;
let inFlightRefreshPromise: Promise<string | null> | null = null;

type TokenChangeListener = (token: string | null) => void;
const tokenListeners = new Set<TokenChangeListener>();

export function subscribeTokenChange(listener: TokenChangeListener): () => void {
  tokenListeners.add(listener);
  return () => {
    tokenListeners.delete(listener);
  };
}

function notifyTokenChange(token: string | null) {
  tokenListeners.forEach((listener) => {
    try {
      listener(token);
    } catch (e) {
      console.error('Error in token change listener:', e);
    }
  });
}

// Multi-Tab Synchronization via BroadcastChannel
const authChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('story_arc_auth')
    : null;

if (authChannel) {
  authChannel.onmessage = (event) => {
    if (event.data?.type === 'TOKEN_REFRESHED') {
      lastRefreshTimestamp = Date.now();
      notifyTokenChange(memoryAccessToken || 'valid');
    } else if (event.data?.type === 'LOGOUT') {
      memoryAccessToken = null;
      lastRefreshTimestamp = 0;
      notifyTokenChange(null);
    }
  };
}

export function getMemoryToken(): string | null {
  return memoryAccessToken;
}

export function setMemoryToken(token: string | null): void {
  memoryAccessToken = token;
  if (token) {
    lastRefreshTimestamp = Date.now();
  }
  notifyTokenChange(token);
}

export function broadcastLogout(): void {
  setMemoryToken(null);
  authChannel?.postMessage({ type: 'LOGOUT' });
}

export function broadcastTokenRefreshed(): void {
  lastRefreshTimestamp = Date.now();
  authChannel?.postMessage({ type: 'TOKEN_REFRESHED' });
}

async function executeRefreshCall(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (!res.ok) {
      setMemoryToken(null);
      return null;
    }

    lastRefreshTimestamp = Date.now();
    broadcastTokenRefreshed();
    return 'valid';
  } catch (err) {
    console.error('Token refresh network error:', err);
    return null;
  }
}

/**
 * Single-flight and multi-tab synchronized token refresh.
 * Guarantees that only ONE /refresh request hits the server at any given time,
 * preventing race condition reuse detection and multi-tab logout.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  // 1. Single-Flight check within the same tab
  if (inFlightRefreshPromise) {
    return inFlightRefreshPromise;
  }

  // 2. Multi-Tab Synchronization via Web Locks API
  if (typeof window !== 'undefined' && 'locks' in navigator) {
    inFlightRefreshPromise = navigator.locks.request(
      'story_arc_refresh_lock',
      async () => {
        const now = Date.now();
        // If refreshed within last 5 seconds, consider still fresh
        if (now - lastRefreshTimestamp < 5000 && lastRefreshTimestamp > 0) {
          return 'valid';
        }

        try {
          const newToken = await executeRefreshCall();
          return newToken;
        } finally {
          inFlightRefreshPromise = null;
        }
      }
    ) as unknown as Promise<string | null>;

    return inFlightRefreshPromise;
  }

  // Fallback for browsers without Web Locks API
  inFlightRefreshPromise = (async () => {
    try {
      const newToken = await executeRefreshCall();
      return newToken;
    } finally {
      inFlightRefreshPromise = null;
    }
  })();

  return inFlightRefreshPromise;
}
