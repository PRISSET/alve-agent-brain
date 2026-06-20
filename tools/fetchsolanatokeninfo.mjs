export function run(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input must be an object');
  }
  const { mintAddress, rpcEndpoint, mint, holders } = input;
  const base58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (typeof mintAddress !== 'string' || !base58.test(mintAddress)) {
    throw new Error('invalid mintAddress: must be a base58 Solana address');
  }
  if (typeof rpcEndpoint !== 'string' || !/^https?:\/\/.+/i.test(rpcEndpoint)) {
    throw new Error('invalid rpcEndpoint: must be an http(s) URL');
  }
  if (mint === null || typeof mint !== 'object' || Array.isArray(mint)) {
    throw new Error('mint info is required');
  }
  const decimals = mint.decimals;
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) {
    throw new Error('decimals must be an integer between 0 and 18');
  }
  const rawSupply = typeof mint.rawSupply === 'string' ? Number(mint.rawSupply) : mint.rawSupply;
  if (typeof rawSupply !== 'number' || !Number.isFinite(rawSupply) || rawSupply < 0) {
    throw new Error('rawSupply must be a non-negative number');
  }
  const factor = Math.pow(10, decimals);
  const round = (n, p) => {
    const f = Math.pow(10, p);
    return Math.round((n + Number.EPSILON) * f) / f;
  };
  const totalSupply = round(rawSupply / factor, decimals);
  const list = Array.isArray(holders) ? holders : [];
  const topN = Number.isInteger(input.topN) && input.topN > 0 ? input.topN : 10;
  const processed = list.map((h, i) => {
    if (h === null || typeof h !== 'object' || Array.isArray(h)) {
      throw new Error('each holder must be an object at index ' + i);
    }
    if (typeof h.address !== 'string' || !base58.test(h.address)) {
      throw new Error('invalid holder address at index ' + i);
    }
    const raw = typeof h.rawAmount === 'string' ? Number(h.rawAmount) : h.rawAmount;
    if (typeof raw !== 'number' || !Number.isFinite(raw) || raw < 0) {
      throw new Error('invalid rawAmount at index ' + i);
    }
    const amount = round(raw / factor, decimals);
    const percentage = totalSupply > 0 ? round((amount / totalSupply) * 100, 4) : 0;
    return { address: h.address, amount, percentage };
  });
  processed.sort((a, b) => b.amount - a.amount || (a.address < b.address ? -1 : a.address > b.address ? 1 : 0));
  const topHolders = processed.slice(0, topN);
  return {
    name: typeof mint.name === 'string' ? mint.name : '',
    ticker: typeof mint.ticker === 'string' ? mint.ticker : '',
    decimals,
    totalSupply,
    topHolders
  };
}
