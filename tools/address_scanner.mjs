export function run(input) {
  const raw = typeof input === 'string' ? input : (input && typeof input === 'object' && typeof input.address === 'string' ? input.address : '');
  const trimmed = raw.trim();
  const postalMatch = trimmed.match(/\b\d{5,6}\b/);
  const postalCode = postalMatch ? postalMatch[0] : null;
  const houseNumbers = (trimmed.match(/\b\d{1,4}[A-Za-zА-Яа-я]?\b/g) || []).filter(function (h) { return h !== postalCode; });
  const parts = trimmed.split(',').map(function (p) { return p.trim(); }).filter(function (p) { return p.length > 0; });
  const tokens = trimmed.length === 0 ? [] : trimmed.split(/\s+/);
  return { raw: trimmed, isEmpty: trimmed.length === 0, postalCode: postalCode, houseNumbers: houseNumbers, parts: parts, tokenCount: tokens.length };
}
