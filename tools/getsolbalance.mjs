export function run(input) {
  const cfg = (typeof input === 'string') ? { address: input } : input;
  if (cfg === null || typeof cfg !== 'object') {
    throw new TypeError('input must be a base58 address string or a config object');
  }
  const address = cfg.address;
  if (typeof address !== 'string' || address.length === 0) {
    throw new TypeError('address must be a non-empty base58 string');
  }
  const BASE58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (!BASE58.test(address)) {
    throw new Error('invalid base58 Solana address: ' + address);
  }
  const endpoint = (cfg.endpoint === undefined) ? 'https://api.mainnet-beta.solana.com' : cfg.endpoint;
  if (typeof endpoint !== 'string' || !/^https?:\/\//.test(endpoint)) {
    throw new Error('endpoint must be an http(s) URL');
  }
  const commitment = (cfg.commitment === undefined) ? 'finalized' : cfg.commitment;
  if (!['processed', 'confirmed', 'finalized'].includes(commitment)) {
    throw new Error('commitment must be processed, confirmed or finalized');
  }
  const parse = (resp) => {
    if (resp === null || typeof resp !== 'object') {
      throw new Error('RPC response must be an object');
    }
    if (resp.error) {
      const e = resp.error;
      const msg = (e && typeof e === 'object' && e.message) ? e.message : String(e);
      throw new Error('RPC error: ' + msg);
    }
    const result = resp.result;
    if (result === null || typeof result !== 'object' || !('value' in result)) {
      throw new Error('RPC response missing result.value');
    }
    const lamports = result.value;
    if (typeof lamports !== 'number' || !Number.isFinite(lamports) || !Number.isInteger(lamports) || lamports < 0) {
      throw new Error('lamports must be a non-negative integer');
    }
    const sol = Number((lamports / 1e9).toFixed(9));
    return { lamports, sol };
  };
  if (cfg.response !== undefined) {
    return parse(cfg.response);
  }
  if (typeof fetch !== 'function') {
    throw new Error('no fetch available and no response provided');
  }
  const body = { jsonrpc: '2.0', id: 1, method: 'getBalance', params: [address, { commitment }] };
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then((r) => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(parse);
}
