export function run(input) {
  const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const isB58 = (s) => { for (let i = 0; i < s.length; i++) { if (B58.indexOf(s[i]) === -1) return false; } return true; };
  const validateAddress = (addr) => {
    if (typeof addr !== 'string') return { valid: false, reason: 'address must be a string' };
    const a = addr.trim();
    if (a.length === 0) return { valid: false, reason: 'address is empty' };
    if (a.length < 32 || a.length > 44) return { valid: false, reason: 'address length must be 32-44 chars' };
    if (!isB58(a)) return { valid: false, reason: 'address contains non-base58 characters' };
    return { valid: true, address: a };
  };

  let address, lamportsRaw;
  if (typeof input === 'string') { address = input; lamportsRaw = 0; }
  else if (input && typeof input === 'object') {
    address = input.address;
    lamportsRaw = input.lamports !== undefined ? input.lamports : (input.balanceLamports !== undefined ? input.balanceLamports : 0);
  } else {
    return { ok: false, error: 'input must be a wallet address string or an object { address, lamports }' };
  }

  const av = validateAddress(address);
  if (!av.valid) return { ok: false, error: av.reason, address: typeof address === 'string' ? address : null };

  let lamports;
  if (typeof lamportsRaw === 'string' && /^[0-9]+$/.test(lamportsRaw.trim())) lamports = Number(lamportsRaw.trim());
  else if (typeof lamportsRaw === 'number') lamports = lamportsRaw;
  else return { ok: false, error: 'lamports must be a non-negative integer (number or numeric string)', address: av.address };

  if (!Number.isFinite(lamports) || !Number.isInteger(lamports) || lamports < 0) {
    return { ok: false, error: 'lamports must be a non-negative integer', address: av.address };
  }

  const LAMPORTS_PER_SOL = 1000000000;
  const sol = lamports / LAMPORTS_PER_SOL;
  const wholeSol = Math.floor(lamports / LAMPORTS_PER_SOL);
  const remainder = lamports - wholeSol * LAMPORTS_PER_SOL;

  return {
    ok: true,
    address: av.address,
    lamports: lamports,
    sol: sol,
    solFormatted: sol.toFixed(9).replace(/0+$/, '').replace(/\.$/, ''),
    breakdown: { wholeSol: wholeSol, fractionalLamports: remainder },
    isEmpty: lamports === 0
  };
}
