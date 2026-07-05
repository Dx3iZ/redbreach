const STORAGE_KEY = 'rb_rate_requests';
const LIMIT = 15;
const WINDOW_MS = 60_000;
const SAFE_LIMIT = 14;

function getRequests(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: number[] = JSON.parse(raw);
    const now = Date.now();
    return parsed.filter((t) => now - t < WINDOW_MS);
  } catch {
    return [];
  }
}

function saveRequests(requests: number[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function canMakeRequest(): { allowed: boolean; waitSeconds: number } {
  const requests = getRequests();
  if (requests.length < SAFE_LIMIT) {
    return { allowed: true, waitSeconds: 0 };
  }
  const oldest = requests[0];
  const elapsed = Date.now() - oldest;
  const remaining = Math.ceil((WINDOW_MS - elapsed) / 1000);
  return { allowed: false, waitSeconds: Math.max(remaining, 1) };
}

export function recordRequest(): void {
  const requests = getRequests();
  requests.push(Date.now());
  if (requests.length > LIMIT) {
    requests.shift();
  }
  saveRequests(requests);
}

export function getRemainingRequests(): number {
  const requests = getRequests();
  return Math.max(0, SAFE_LIMIT - requests.length);
}

export function getWindowResetSeconds(): number {
  const requests = getRequests();
  if (requests.length === 0) return 0;
  const oldest = requests[0];
  const elapsed = Date.now() - oldest;
  return Math.max(0, Math.ceil((WINDOW_MS - elapsed) / 1000));
}
