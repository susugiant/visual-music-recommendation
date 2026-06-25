export function formatMatchAccuracy(matchAccuracy) {
  if (typeof matchAccuracy !== "number") {
    return "N/A";
  }

  return `${Math.round(matchAccuracy * 100)}%`;
}

export function formatConfidenceScore(score) {
  if (typeof score !== "number") {
    return "N/A";
  }

  return `${(score * 100).toFixed(1)}%`;
}