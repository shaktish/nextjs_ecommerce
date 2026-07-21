import { RefreshResult } from "./refresh";

let refreshPromise: Promise<RefreshResult> | null = null;

export default async function getRefreshPromise(
  refreshFn: () => Promise<RefreshResult>,
): Promise<RefreshResult> {
  if (!refreshPromise) {
    refreshPromise = refreshFn().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
