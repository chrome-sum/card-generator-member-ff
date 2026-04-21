export function normalizePhone(value) {
  const clean = String(value ?? "").replace(/\D/g, "");

  if (!clean) {
    return "";
  }

  if (clean.startsWith("62")) {
    return clean;
  }

  if (clean.startsWith("0")) {
    return `62${clean.slice(1)}`;
  }

  return clean;
}

export function formatPhone(value) {
  const clean = normalizePhone(value);

  if (!clean) {
    return "";
  }

  const local = clean.startsWith("62") ? clean.slice(2) : clean;

  if (local.length <= 3) {
    return `+62 ${local}`;
  }

  if (local.length <= 7) {
    return `+62 ${local.slice(0, 3)}-${local.slice(3)}`;
  }

  if (local.length <= 11) {
    return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`;
  }

  return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7, 11)}-${local.slice(11)}`;
}
