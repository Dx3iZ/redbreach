import { useState, useEffect, useRef } from 'react';
import { canMakeRequest, recordRequest, getRemainingRequests } from '../utils/rateLimit';
import type { SearchRequest, SearchResponse } from '../types';
import axios from 'axios';

interface UseSearchReturn {
  search: (params: SearchRequest) => Promise<void>;
  results: SearchResponse | null;
  loading: boolean;
  error: string | null;
  isRateLimited: boolean;
  waitSeconds: number;
  remaining: number;
  clearResults: () => void;
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [remaining, setRemaining] = useState(getRemainingRequests());
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemainingRequests());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startCountdown = (seconds: number) => {
    setIsRateLimited(true);
    setWaitSeconds(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setWaitSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setIsRateLimited(false);
          setRemaining(getRemainingRequests());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const search = async (params: SearchRequest) => {
    const { allowed, waitSeconds: wait } = canMakeRequest();
    if (!allowed) {
      startCountdown(wait);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      recordRequest();
      setRemaining(getRemainingRequests());

      const response = await axios.post<SearchResponse>('/api/search', params, {
        headers: { 'Content-Type': 'application/json' },
      });

      setResults(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          startCountdown(60);
        } else {
          setError(err.response?.data?.message ?? err.message ?? 'Bir hata oluştu');
        }
      } else {
        setError('Beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  return { search, results, loading, error, isRateLimited, waitSeconds, remaining, clearResults };
}
