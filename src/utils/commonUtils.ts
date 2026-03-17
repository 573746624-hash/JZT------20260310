export async function simulateDelay(delay: number = 0): Promise<void> {
  if (delay <= 0) return;
  await new Promise<void>((resolve) => setTimeout(resolve, delay));
}

export function getMatchColor(score: number): string {
  if (score >= 80) return "#52c41a";
  if (score >= 60) return "#faad14";
  return "#ff4d4f";
}

export function getMatchTag(score: number): { color: string; text: string } {
  if (score >= 80) return { color: "success", text: "高度匹配" };
  if (score >= 60) return { color: "processing", text: "较高匹配" };
  return { color: "error", text: "匹配度一般" };
}

export function generateApplicationId(prefix: string = "AP"): string {
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `${prefix}${Date.now()}${random}`;
}
