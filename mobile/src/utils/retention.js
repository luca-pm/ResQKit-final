export function formatRetentionRemaining(expiresAt, language = "ro", nowMs = Date.now()) {
  const en = String(language || "ro").toLowerCase().startsWith("en");
  if (!expiresAt) return null;

  const remaining = new Date(expiresAt).getTime() - nowMs;
  if (!Number.isFinite(remaining)) return null;
  if (remaining <= 0) return en ? "expired" : "expirat";

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (remaining >= day) {
    const days = Math.ceil(remaining / day);
    return en
      ? `${days} ${days === 1 ? "day" : "days"} left`
      : `${days} ${days === 1 ? "zi rămasă" : "zile rămase"}`;
  }

  if (remaining >= hour) {
    const hours = Math.ceil(remaining / hour);
    return en
      ? `${hours} ${hours === 1 ? "hour" : "hours"} left`
      : `${hours} ${hours === 1 ? "oră rămasă" : "ore rămase"}`;
  }

  const minutes = Math.max(1, Math.ceil(remaining / minute));
  return en
    ? `${minutes} ${minutes === 1 ? "minute" : "minutes"} left`
    : `${minutes} ${minutes === 1 ? "minut rămas" : "minute rămase"}`;
}
