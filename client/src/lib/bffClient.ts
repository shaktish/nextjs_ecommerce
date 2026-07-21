export default async function bffFetch(path: string, init: RequestInit = {}) {
  return fetch(`/api/bff${path}`, {
    credentials: "include",
    ...init,
    headers: {
      ...init.headers,
    },
  });
}
