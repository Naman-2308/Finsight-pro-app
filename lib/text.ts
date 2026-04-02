/**
 * Turns a plaintext bullet list into clean, display-ready lines.
 * Handles "-", "*", and "•" prefixes and trims whitespace.
 */
export function parseBulletedLines(text: string) {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•]\s*/, ""))
    .filter(Boolean);
}

