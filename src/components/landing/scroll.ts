export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = document.documentElement.classList.contains("reduce-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
