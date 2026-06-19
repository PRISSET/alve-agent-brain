export function run(input) {
  const LAMPORTS_PER_SOL = 1000000000;
  const data = input || {};
  const lamports = Number((data.balance && data.balance.value != null ? data.balance.value : data.lamports) || 0);
  const sol = lamports / LAMPORTS_PER_SOL;
  const accounts = (data.tokenAccounts && data.tokenAccounts.value) || data.tokenAccounts || [];
  const list = Array.isArray(accounts) ? accounts : [];
  const tokens = list.map((acc) => {
    const info = acc && acc.account && acc.account.data && acc.account.data.parsed && acc.account.data.parsed.info;
    const tokenAmount = info && info.tokenAmount ? info.tokenAmount : {};
    const decimals = Number(tokenAmount.decimals || 0);
    const raw = tokenAmount.amount != null ? Number(tokenAmount.amount) : 0;
    const amount = tokenAmount.uiAmount != null ? Number(tokenAmount.uiAmount) : raw / Math.pow(10, decimals);
    return { mint: info ? info.mint : null, amount: amount, decimals: decimals };
  });
  return { sol: sol, tokens: tokens };
}
