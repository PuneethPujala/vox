import { NextRequest } from 'next/server';

// Helper to create mock NextRequest objects for testing
export function createRequest(options: {
  method: string;
  body?: any;
  headers?: Record<string, string>;
}): NextRequest {
  const url = new URL('http://localhost:3000/api/test');

  const request = {
    method: options.method,
    headers: new Headers(options.headers || {}),
    body: options.body ? JSON.stringify(options.body) : null,
    json: async () => options.body || {},
  } as any;

  // Mock NextRequest methods
  request.clone = () => request;
  request.text = async () => (options.body ? JSON.stringify(options.body) : '');
  request.headers.get = (key: string) => request.headers.get(key);

  return new NextRequest(url, {
    method: options.method,
    headers: options.headers || {},
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

// Helper to create mock sessions for testing
export function createMockSession(user: any) {
  return {
    user,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

// Helper to clean up test database
export async function cleanTestDatabase() {
  // This would be implemented to clean test data
  // For now, it's a placeholder
}
