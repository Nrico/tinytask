/**
 * Format a date string or object into a human-readable format.
 * @param date The date to format
 * @param options Formatting options (e.g. { includeTime: boolean })
 */
export function formatDate(
  date: Date | string | number,
  options: { includeTime?: boolean; locale?: string } = {}
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";

  const locale = options.locale || "en-US";
  
  if (options.includeTime) {
    return d.toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
