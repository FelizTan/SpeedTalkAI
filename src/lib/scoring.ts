/** Pure utility helpers. */

export const levenshtein = (a: string, b: string): number => {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 0;
  const m = s1.length;
  const n = s2.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};

/** Score 0–100 based on distance, tuned for single-word pronunciation drills. */
export const scorePronunciation = (target: string, said: string): number => {
  const cleanTarget = target.toLowerCase().trim();
  const cleanSaid = said.toLowerCase().trim();
  if (!cleanSaid) return 30;
  if (cleanSaid === cleanTarget) return 100;
  const dist = levenshtein(cleanTarget, cleanSaid);
  if (dist === 1) return 85;
  if (dist === 2) return 70;
  if (dist >= 3) return 50;
  return 50;
};

export const cn = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");
