const globalHeaders: HeadersInit = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
}

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function globalFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  options.headers = {
    ...globalHeaders,
    ...options.headers
  };

  return fetch(url, options)
}