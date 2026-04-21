const STATUS_VARIANTS = {
  info: ["bg-sky-50", "text-sky-700", "border", "border-sky-100"],
  success: ["bg-emerald-50", "text-emerald-700", "border", "border-emerald-100"],
  error: ["bg-rose-50", "text-rose-700", "border", "border-rose-100"],
};

export function setStatus(element, message, variant = "info") {
  Object.values(STATUS_VARIANTS).flat().forEach((className) => {
    element.classList.remove(className);
  });

  if (!message) {
    element.textContent = "";
    element.classList.add("hidden");
    return;
  }

  element.textContent = message;
  element.classList.remove("hidden");
  STATUS_VARIANTS[variant].forEach((className) => element.classList.add(className));
}
