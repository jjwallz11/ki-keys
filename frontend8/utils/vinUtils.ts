// utils/vinUtils.ts

/**
 * Extracts the first valid 17-character VIN from a string of OCR text.
 * VINs are alphanumeric (except I, O, Q) and always 17 characters long.
 */
export function extractVinFromText(text: string): string | null {
  if (!text) return null;

  // VINs do not contain I, O, or Q (to avoid confusion with 1 and 0)
  const vinRegex = /\b[A-HJ-NPR-Z0-9]{17}\b/g;

  const matches = text
    .toUpperCase()
    .replace(/[\s-]/g, '') // remove whitespace and dashes
    .match(vinRegex);

  if (matches && matches.length > 0) {
    return matches[0];
  }

  return null;
}