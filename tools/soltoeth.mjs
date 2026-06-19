export function run(input) {
  if (input === null || typeof input !== 'object') throw new Error('input must be an object');
  const sol = typeof input.sol === 'number' ? input.sol : Number(input.sol);
  const rate = typeof input.rate === 'number' ? input.rate : Number(input.rate);
  if (!Number.isFinite(sol) || !Number.isFinite(rate)) throw new Error('sol and rate must be finite numbers');
  if (sol < 0 || rate < 0) throw new Error('sol and rate must be non-negative');
  const eth = sol * rate;
  return { sol: sol, rate: rate, eth: eth };
}
