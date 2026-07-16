export const getFormattedDate = (
  value: Date | undefined,
  options?: Intl.DateTimeFormatOptions,
) => {
  const locale = navigator?.language || "en-IN";
  if (!value) {
    return null;
  }
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    ...options,
  }).format(new Date(value));
};
