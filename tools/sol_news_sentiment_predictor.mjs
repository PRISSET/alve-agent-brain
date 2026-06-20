export function run(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("input must be an object");
  }
  const asset = typeof input.asset === "string" && input.asset.trim() ? input.asset.trim().toUpperCase() : "SOL";
  const rawNews = input.news;
  if (!Array.isArray(rawNews) || rawNews.length === 0) {
    throw new Error("input.news must be a non-empty array");
  }
  const bullishWords = ["surge","rally","adoption","partnership","bullish","upgrade","gain","soar","record","approval","institutional","integration","growth","rise","boost","breakout"];
  const bearishWords = ["crash","hack","ban","lawsuit","selloff","bearish","plunge","outage","exploit","decline","drop","dump","fraud","fear","downtime"];
  const countMatches = (text, words) => {
    let c = 0;
    for (const w of words) {
      const re = new RegExp("\\b" + w + "\\b", "g");
      const m = text.match(re);
      if (m) c += m.length;
    }
    return c;
  };
  let totalScore = 0;
  let totalWeight = 0;
  let totalBull = 0;
  let totalBear = 0;
  const details = [];
  for (let i = 0; i < rawNews.length; i++) {
    const item = rawNews[i];
    let text;
    let weight = 1;
    if (typeof item === "string") {
      text = item;
    } else if (item && typeof item === "object" && !Array.isArray(item)) {
      if (typeof item.headline !== "string") {
        throw new Error("news item at index " + i + " must have a string headline");
      }
      text = item.headline;
      if (item.weight !== undefined) {
        if (typeof item.weight !== "number" || !isFinite(item.weight) || item.weight < 0) {
          throw new Error("news item weight at index " + i + " must be a non-negative finite number");
        }
        weight = item.weight;
      }
    } else {
      throw new Error("news item at index " + i + " must be a string or object");
    }
    const lower = text.toLowerCase();
    const bull = countMatches(lower, bullishWords);
    const bear = countMatches(lower, bearishWords);
    const net = bull - bear;
    const weighted = net * weight;
    totalScore += weighted;
    totalWeight += weight;
    totalBull += bull * weight;
    totalBear += bear * weight;
    details.push({ index: i, bullish: bull, bearish: bear, score: weighted });
  }
  let direction;
  if (totalScore > 0) direction = "rise";
  else if (totalScore < 0) direction = "fall";
  else direction = "neutral";
  const avg = totalWeight > 0 ? totalScore / totalWeight : 0;
  let confidence = Math.min(1, Math.abs(avg) / 3);
  confidence = Math.round(confidence * 100) / 100;
  const round2 = (n) => Math.round(n * 100) / 100;
  return {
    asset,
    direction,
    score: round2(totalScore),
    netSignal: round2(avg),
    signals: { bullish: round2(totalBull), bearish: round2(totalBear) },
    confidence,
    itemsAnalyzed: rawNews.length,
    details
  };
}
