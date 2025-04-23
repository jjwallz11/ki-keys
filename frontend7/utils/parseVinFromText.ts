export function parseVinFromText(text: string): string | null {
    const cleanedText = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const vinMatch = cleanedText.match(/[A-HJ-NPR-Z0-9]{17}/);
  
    // VINs do not include I, O, Q
    if (vinMatch && !/[IOQ]/.test(vinMatch[0])) {
      return vinMatch[0];
    }
    return null;
  }