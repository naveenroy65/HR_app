/*
  Centralized API client for the frontend.
  - Reads base URL from VITE_API_URL
  - Injects Authorization: Bearer <token> when available
  - Provides helper methods for common verbs
*/

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
  signal?: AbortSignal;
}

export interface ApiResponse<TData = unknown> {
  ok: boolean;
  status: number;
  data: TData;
}

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
};

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  return (envUrl && envUrl.trim().length > 0) ? envUrl : 'http://localhost:5000/api';
};

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch (_) {
    return null;
  }
};

export async function apiFetch<TResponse = unknown, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<ApiResponse<TResponse>> {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers: Record<string, string> = { ...DEFAULT_HEADERS, ...(options.headers || {}) };

  const token = getAuthToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
    signal: options.signal,
  };

  if (options.body !== undefined && options.body !== null && headers['Content-Type']?.includes('application/json')) {
    // @ts-expect-error Body init can be string
    fetchOptions.body = JSON.stringify(options.body);
  } else if (options.body instanceof FormData) {
    delete headers['Content-Type'];
    // @ts-expect-error Body init can be FormData
    fetchOptions.body = options.body;
  }

  const resp = await fetch(url, fetchOptions);
  let data: any = null;
  try {
    data = await resp.json();
  } catch (_) {
    data = null;
  }

  if (!resp.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${resp.status}`;
    const error = new Error(message) as Error & { status?: number; data?: unknown };
    error.status = resp.status;
    error.data = data;
    throw error;
  }

  return { ok: true, status: resp.status, data } as ApiResponse<TResponse>;
}

export const api = {
  get: <T = unknown>(path: string, opts: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
    apiFetch<T>(path, { ...opts, method: 'GET' }),
  post: <T = unknown, B = unknown>(path: string, body?: B, opts: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
    apiFetch<T, B>(path, { ...opts, method: 'POST', body }),
  put: <T = unknown, B = unknown>(path: string, body?: B, opts: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
    apiFetch<T, B>(path, { ...opts, method: 'PUT', body }),
  delete: <T = unknown>(path: string, opts: Omit<ApiRequestOptions, 'method' | 'body'> = {}) =>
    apiFetch<T>(path, { ...opts, method: 'DELETE' }),
};

// Auth-specific helpers for convenience
export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
    isMfaSetup: boolean;
  };
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse, { email: string; password: string }>(
      '/auth/login',
      { email, password }
    ),
  mfaSetup: (userId: string) =>
    api.post<{ secret: string; qrCode: string }, { userId: string }>(
      '/auth/mfa/setup',
      { userId }
    ),
  mfaVerify: (userId: string, token: string, isSetup: boolean) =>
    api.post<{
      token: string;
      user: { id: string; name: string; email: string; role: string; avatarUrl: string; isMfaSetup: boolean };
    }, { userId: string; token: string; isSetup: boolean }>(
      '/auth/mfa/verify',
      { userId, token, isSetup }
    ),
  forgotPassword: (email: string) =>
    api.post<{ message: string }, { email: string }>(
      '/auth/forgot-password',
      { email }
    ),
  resetPassword: (resetToken: string, password: string) =>
    api.post<{ message: string }>(
      `/auth/reset-password/${resetToken}`,
      { password }
    ),
};

// Departments API helpers
export interface BackendDepartment {
  _id: string;
  name: string;
  managerId?: any;
}

export const departmentsApi = {
  list: () => api.get<BackendDepartment[]>('/departments'),
  create: (payload: { name: string; managerId?: string | null }) =>
    api.post<BackendDepartment, { name: string; managerId?: string | null }>(
      '/departments',
      payload
    ),
  update: (id: string, payload: { name?: string; managerId?: string | null }) =>
    api.put<BackendDepartment, { name?: string; managerId?: string | null }>(
      `/departments/${id}`,
      payload
    ),
  remove: (id: string) => api.delete<{ message: string }>(`/departments/${id}`),
};

// Employees API helpers
export interface BackendEmployee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  departmentId: string | { _id: string };
  role: string;
  joinDate: string;
  status: string;
  employeeType: string;
  salary: number;
}

export const employeesApi = {
  list: () => api.get<BackendEmployee[]>('/employees'),
  create: (payload: {
    employeeId: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    departmentId: string;
    role: string;
    joinDate: string | Date;
    status: string;
    employeeType: string;
    salary: number;
    password?: string;
  }) => api.post<BackendEmployee, any>('/employees', payload),
  update: (id: string, payload: Partial<Omit<BackendEmployee, '_id'>>) =>
    api.put<BackendEmployee, any>(`/employees/${id}`, payload),
  remove: (id: string) => api.delete<{ message: string }>(`/employees/${id}`),
};
