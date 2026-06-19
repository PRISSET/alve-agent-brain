export function run(input) {
  const NANO_PER_TON = 1000000000n;
  if (input === null || typeof input !== 'object') {
    return { error: 'input must be an object' };
  }
  const { amount, from } = input;
  const dir = from === 'nano' ? 'nano' : 'ton';
  if (typeof amount !== 'number' && typeof amount !== 'string') {
    return { error: 'amount must be a number or string' };
  }
  const str = String(amount).trim();
  if (!/^[0-9]+(\.[0-9]+)?$/.test(str)) {
    return { error: 'amount must be a non-negative numeric value' };
  }
  if (dir === 'nano') {
    if (str.includes('.')) {
      return { error: 'nanoTON must be an integer' };
    }
    const nano = BigInt(str);
    const whole = nano / NANO_PER_TON;
    const frac = nano % NANO_PER_TON;
    const fracStr = frac.toString().padStart(9, '0').replace(/0+$/, '');
    const ton = fracStr ? `${whole}.${fracStr}` : `${whole}`;
    return { ton, nano: nano.toString() };
  }
  const parts = str.split('.');
  const wholePart = parts[0];
  const fracPart = (parts[1] || '').padEnd(9, '0');
  if (fracPart.length > 9) {
    return { error: 'TON supports at most 9 decimal places' };
  }
  const nano = BigInt(wholePart) * NANO_PER_TON + BigInt(fracPart || '0');
  const tonNorm = parts[1] ? `${wholePart}.${parts[1].replace(/0+$/, '') || '0'}` : wholePart;
  return { ton: tonNorm, nano: nano.toString() };
}
