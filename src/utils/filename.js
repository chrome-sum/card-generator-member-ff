export function sanitizeFilename(value, fallback) {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .replace(/\.+$/g, "");

  return cleaned || fallback;
}
