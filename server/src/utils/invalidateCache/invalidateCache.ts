import config from "../../config/envConfig";

export const invalidateCache = async (
  url: string,
  data?: Record<string, string>,
): Promise<void> => {
  const nextAppUrl = config.NEXT_APP_URL;
  const revalidateSecret = config.REVALIDATE_SECRET;

  const response = await fetch(`${nextAppUrl}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret": revalidateSecret!,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to invalidate cache. Status: ${response.status} ${url}`,
    );
  }
};
