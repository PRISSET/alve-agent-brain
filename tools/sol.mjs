export function run(input) {
  if (!input || typeof input !== 'object') return { error: 'Invalid input' };
  const { token, amount, rates } = input;
  if (typeof token !== 'string' || token.length === 0) return { error: 'Invalid token' };
  if (typeof amount !== 'number' || !isFinite(amount) || amount < 0) return { error: 'Invalid amount' };
  if (!rates || typeof rates !== 'object') return { error: 'Invalid rates' };
  let rate = rates[token];
  if (rate === undefined) rate = rates[token.toUpperCase()];
  if (typeof rate !== 'number' || !isFinite(rate) || rate < 0) return { error: 'Unknown token rate' };
  const sol = Math.round(amount * rate * 1e9) / 1e9;
  return { token, amount, sol };
}
