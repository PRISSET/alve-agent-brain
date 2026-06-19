export function run(input) {
  const kb = {
    'токен': 'Нативный токен сети TON называется Toncoin (TON).',
    'toncoin': 'Нативный токен сети TON называется Toncoin (TON).',
    'создатель': 'TON изначально разработан командой Telegram (братьями Дуровыми), сейчас развивается сообществом TON Foundation.',
    'основатель': 'TON изначально разработан командой Telegram (братьями Дуровыми), сейчас развивается сообществом TON Foundation.',
    'консенсус': 'TON использует механизм консенсуса Proof-of-Stake (BFT).',
    'смарт-контракт': 'Смарт-контракты в TON пишут на языках FunC, Tact и Tolk, компилируются в TVM.',
    'смарт контракт': 'Смарт-контракты в TON пишут на языках FunC, Tact и Tolk, компилируются в TVM.',
    'кошелёк': 'Популярные кошельки TON: Tonkeeper, Wallet в Telegram, MyTonWallet.',
    'кошелек': 'Популярные кошельки TON: Tonkeeper, Wallet в Telegram, MyTonWallet.',
    'шардинг': 'TON поддерживает динамический шардинг: блокчейн делится на воркчейны и шарды для масштабирования.',
    'tvm': 'TVM (TON Virtual Machine) исполняет смарт-контракты сети TON.',
    'комиссия': 'Комиссии в сети TON оплачиваются в Toncoin и обычно очень малы.'
  };
  if (typeof input !== 'string') return 'нет данных';
  const q = input.trim().toLowerCase();
  if (q === '') return 'нет данных';
  if (Object.prototype.hasOwnProperty.call(kb, q)) return kb[q];
  const keys = Object.keys(kb).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (q.includes(key)) return kb[key];
  }
  return 'нет данных';
}
