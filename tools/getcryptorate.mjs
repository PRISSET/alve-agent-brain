export function run(input) {
  if (!input || typeof input.pair !== "string") {
    throw new Error("pair must be a string");
  }
  const parts = input.pair.trim().toUpperCase().split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error("pair must be in BASE/QUOTE format");
  }
  const base = parts[0];
  const quote = parts[1];
  if (base === quote) return 1;
  const prices = (input.prices && typeof input.prices === "object") ? input.prices : {};
  const b = prices[base];
  const q = prices[quote];
  if (typeof b !== "number" || typeof q !== "number" || !isFinite(b) || !isFinite(q)) {
    throw new Error("missing price for one of the symbols");
  }
  if (q === 0) throw new Error("quote price cannot be zero");
  return b / q;
}
