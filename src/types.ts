export interface SearchRequest {
  term: string;
  fields: string[];
  categories: string[];
  wildcard: boolean;
  case_sensitive: boolean;
}

export interface SearchResult {
  source: string;
  categories: string;
  [key: string]: unknown;
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface RateLimitState {
  requests: number[];
  isLimited: boolean;
  waitSeconds: number;
}

export type SearchField = 'email' | 'username' | 'password' | 'ip' | 'name' | 'phone' | 'domain';

export interface FieldOption {
  value: SearchField;
  label: string;
  icon: string;
  description: string;
}
