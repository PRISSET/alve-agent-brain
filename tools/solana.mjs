export function run(input) {
  const src = input && Array.isArray(input.tokens) ? input.tokens : [];
  const tokens = src.map((t) => {
    const decimals = t && Number.isFinite(t.decimals) ? t.decimals : 0;
    const raw = Number(t && t.rawAmount != null ? t.rawAmount : 0);
    const balance = Number.isFinite(raw) ? raw / Math.pow(10, decimals) : 0;
    return {
      mint: t && t.mint != null ? String(t.mint) : "",
      balance: balance,
      metadata: t && t.metadata != null ? t.metadata : null,
      priceUSD: t && typeof t.priceUSD === "number" ? t.priceUSD : null
    };
  });
  return { tokens: tokens };
}
