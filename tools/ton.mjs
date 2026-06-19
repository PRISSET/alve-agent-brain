export function run(input) {
  const { amount, rate, decimals = 9 } = input || {};
  const a = Number(amount);
  const r = Number(rate);
  const d = Number.isInteger(decimals) && decimals >= 0 && decimals <= 100 ? decimals : 9;
  if (!Number.isFinite(a) || !Number.isFinite(r)) {
    throw new Error('amount and rate must be finite numbers');
  }
  if (a < 0 || r < 0) {
    throw new Error('amount and rate cannot be negative');
  }
  return Number((a * r).toFixed(d));
}
