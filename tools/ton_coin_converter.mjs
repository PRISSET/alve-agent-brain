export function run(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'input must be an object { amount, rate, direction?, currency?, decimals? }' };
  }
  const { amount, rate } = input;
  const direction = input.direction === undefined ? 'ton_to_fiat' : input.direction;
  const currency = typeof input.currency === 'string' && input.currency.trim() ? input.currency.trim().toUpperCase() : 'USD';
  let decimals = input.decimals === undefined ? (direction === 'fiat_to_ton' ? 9 : 2) : input.decimals;

  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return { ok: false, error: 'amount must be a finite number' };
  }
  if (amount < 0) {
    return { ok: false, error: 'amount must be >= 0' };
  }
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
    return { ok: false, error: 'rate must be a positive finite number (fiat per 1 TON)' };
  }
  if (direction !== 'ton_to_fiat' && direction !== 'fiat_to_ton') {
    return { ok: false, error: "direction must be 'ton_to_fiat' or 'fiat_to_ton'" };
  }
  if (typeof decimals !== 'number' || !Number.isInteger(decimals) || decimals < 0 || decimals > 18) {
    return { ok: false, error: 'decimals must be an integer between 0 and 18' };
  }

  const raw = direction === 'ton_to_fiat' ? amount * rate : amount / rate;
  const factor = Math.pow(10, decimals);
  const result = Math.round((raw + Number.EPSILON) * factor) / factor;

  return {
    ok: true,
    direction,
    rate,
    currency,
    input: amount,
    inputUnit: direction === 'ton_to_fiat' ? 'TON' : currency,
    result,
    resultUnit: direction === 'ton_to_fiat' ? currency : 'TON'
  };
}
