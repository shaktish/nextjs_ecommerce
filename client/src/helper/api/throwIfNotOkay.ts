export async function throwIfNotOk(
  response: Response,
  fallbackMessage: string,
) {
  if (response.ok) return;

  const error = await response.json().catch(() => null);

  throw new Error(error?.message ?? fallbackMessage);
}
