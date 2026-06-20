export function run(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('input must be an object');
  }
  const { privateKey, solBalance, price, slippageBps, feeSol } = input;
  if (typeof privateKey !== 'string' || privateKey.trim() === '') {
    throw new Error('privateKey must be a non-empty string');
  }
  const base58re = /^[1-9A-HJ-NP-Za-km-z]+$/;
  if (!base58re.test(privateKey) || privateKey.length < 32 || privateKey.length > 128) {
    throw new Error('privateKey is not a valid base58 key');
  }
  if (typeof solBalance !== 'number' || !isFinite(solBalance) || solBalance < 0) {
    throw new Error('solBalance must be a non-negative finite number');
  }
  if (typeof price !== 'number' || !isFinite(price) || price <= 0) {
    throw new Error('price (USDC per SOL) must be a positive finite number');
  }
  const fee = feeSol === undefined ? 0.000005 : feeSol;
  if (typeof fee !== 'number' || !isFinite(fee) || fee < 0) {
    throw new Error('feeSol must be a non-negative finite number');
  }
  const bps = slippageBps === undefined ? 50 : slippageBps;
  if (typeof bps !== 'number' || !isFinite(bps) || bps < 0 || bps > 10000) {
    throw new Error('slippageBps must be between 0 and 10000');
  }
  if (input.amountSol !== undefined && input.percent !== undefined) {
    throw new Error('provide either amountSol or percent, not both');
  }
  let amountSol;
  if (input.amountSol !== undefined) {
    if (typeof input.amountSol !== 'number' || !isFinite(input.amountSol) || input.amountSol <= 0) {
      throw new Error('amountSol must be a positive finite number');
    }
    amountSol = input.amountSol;
  } else if (input.percent !== undefined) {
    if (typeof input.percent !== 'number' || !isFinite(input.percent) || input.percent <= 0 || input.percent > 100) {
      throw new Error('percent must be in (0, 100]');
    }
    const spendable = Math.max(0, solBalance - fee);
    amountSol = spendable * (input.percent / 100);
  } else {
    throw new Error('provide amountSol or percent to convert');
  }
  const totalNeeded = amountSol + fee;
  if (totalNeeded > solBalance + 1e-9) {
    throw new Error('insufficient SOL balance for amount plus fee');
  }
  const round = (n, d) => {
    const f = Math.pow(10, d);
    return Math.round((n + Number.EPSILON) * f) / f;
  };
  const grossUsdc = amountSol * price;
  const minReceiveUsdc = grossUsdc * (1 - bps / 10000);
  return {
    valid: true,
    keyFingerprint: privateKey.slice(0, 4) + '...' + privateKey.slice(-4),
    fromToken: 'SOL',
    toToken: 'USDC',
    price: price,
    amountSol: round(amountSol, 9),
    networkFeeSol: fee,
    estimatedUsdc: round(grossUsdc, 6),
    slippageBps: bps,
    minReceiveUsdc: round(minReceiveUsdc, 6),
    remainingSol: round(solBalance - amountSol - fee, 9)
  };
}
