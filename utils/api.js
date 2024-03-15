export async function fetchWithHeaders(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...headers,
    },
  };

  return fetch(url, mergedOptions);
}
