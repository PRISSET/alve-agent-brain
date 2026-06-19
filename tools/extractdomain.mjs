export function run(input) {
  if (typeof input !== "string") return null;
  let s = input.trim();
  if (s === "") return null;
  const scheme = s.indexOf("://");
  if (scheme !== -1) s = s.slice(scheme + 3);
  const at = s.indexOf("@");
  if (at !== -1) s = s.slice(at + 1);
  let end = s.length;
  for (const ch of ["/", "?", "#"]) {
    const idx = s.indexOf(ch);
    if (idx !== -1 && idx < end) end = idx;
  }
  s = s.slice(0, end);
  const colon = s.indexOf(":");
  if (colon !== -1) s = s.slice(0, colon);
  s = s.toLowerCase();
  if (s.startsWith("www.")) s = s.slice(4);
  return s === "" ? null : s;
}
