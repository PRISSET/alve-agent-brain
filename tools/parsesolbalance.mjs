export function run(input) {
  const LAMPORTS_PER_SOL = 1000000000;
  let raw = input;
  if (input !== null && typeof input === 'object') {
    raw = input.lamports;
  }
  if (typeof raw === 'string') raw = raw.trim();
  const lamports = Number(raw);
  if (!Number.isFinite(lamports) || lamports < 0 || !Number.isInteger(lamports)) {
    return { valid: false, lamports: null, sol: null };
  }
  const sol = lamports / LAMPORTS_PER_SOL;
  return { valid: true, lamports: lamports, sol: sol };
}
