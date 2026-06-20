export function run(input) {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new Error('input must be an object');
  }
  const { contractAddress, name, symbol, decimals, totalSupply, holders } = input;
  let topN = input.topN;

  if (typeof contractAddress !== 'string' || contractAddress.trim() === '') {
    throw new Error('contractAddress is required');
  }
  const ca = contractAddress.trim();
  const base58 = /^[1-9A-HJ-NP-Za-km-z]+$/;
  if (ca.length < 32 || ca.length > 44 || !base58.test(ca)) {
    throw new Error('invalid Solana contract address');
  }
  if (!Array.isArray(holders)) {
    throw new Error('holders must be an array');
  }

  const cleaned = holders.map((h, i) => {
    if (typeof h !== 'object' || h === null) throw new Error('holder at index ' + i + ' must be an object');
    const addr = h.address;
    const bal = Number(h.balance);
    if (typeof addr !== 'string' || addr.trim() === '') throw new Error('holder at index ' + i + ' has invalid address');
    if (!isFinite(bal) || bal < 0) throw new Error('holder at index ' + i + ' has invalid balance');
    return { address: addr.trim(), balance: bal };
  });

  let supply;
  if (totalSupply !== undefined && totalSupply !== null) {
    supply = Number(totalSupply);
    if (!isFinite(supply) || supply <= 0) throw new Error('totalSupply must be a positive number');
  } else {
    supply = cleaned.reduce((s, h) => s + h.balance, 0);
  }
  if (supply <= 0) throw new Error('total supply must be greater than zero');

  if (topN === undefined || topN === null) topN = 10;
  topN = Number(topN);
  if (!Number.isInteger(topN) || topN <= 0) throw new Error('topN must be a positive integer');

  const sorted = cleaned.slice().sort((a, b) => {
    if (b.balance !== a.balance) return b.balance - a.balance;
    return a.address < b.address ? -1 : a.address > b.address ? 1 : 0;
  });

  const round = (n) => Math.round(n * 100) / 100;

  const top = sorted.slice(0, topN).map((h, i) => ({
    rank: i + 1,
    address: h.address,
    balance: h.balance,
    percentage: round((h.balance / supply) * 100)
  }));

  const topConcentration = round(top.reduce((s, h) => s + (h.balance / supply) * 100, 0));

  return {
    contractAddress: ca,
    name: typeof name === 'string' && name.trim() !== '' ? name.trim() : 'Unknown',
    symbol: typeof symbol === 'string' && symbol.trim() !== '' ? symbol.trim().toUpperCase() : 'UNKNOWN',
    decimals: Number.isInteger(decimals) && decimals >= 0 ? decimals : null,
    totalSupply: supply,
    holderCount: cleaned.length,
    topHolders: top,
    topHoldersConcentrationPercent: topConcentration
  };
}
