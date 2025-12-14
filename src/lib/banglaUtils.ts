/**
 * Utility functions for Bangla language support
 */

// Bangla to English number mapping
const banglaToEnglishMap: { [key: string]: string } = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
  '।': '.',
};

// English to Bangla number mapping
const englishToBanglaMap: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
  '.': '।',
};

/**
 * Convert Bangla numbers to English numbers
 * @param banglaNumber - String containing Bangla numbers
 * @returns String with English numbers
 */
export function banglaToEnglish(banglaNumber: string): string {
  if (!banglaNumber) return '';
  
  return banglaNumber
    .split('')
    .map(char => banglaToEnglishMap[char] || char)
    .join('');
}

/**
 * Convert English numbers to Bangla numbers
 * @param englishNumber - String or number containing English numbers
 * @returns String with Bangla numbers
 */
export function englishToBangla(englishNumber: string | number): string {
  const str = String(englishNumber);
  
  return str
    .split('')
    .map(char => englishToBanglaMap[char] || char)
    .join('');
}

/**
 * Validate if string contains only Bangla characters and allowed symbols
 * @param text - Text to validate
 * @returns true if valid Bangla text
 */
export function isBanglaText(text: string): boolean {
  if (!text) return true; // Allow empty
  
  // Bangla Unicode range: \u0980-\u09FF
  // Also allow spaces, commas, periods, hyphens, colons, parentheses, and Bangla numbers
  const banglaPattern = /^[\u0980-\u09FF\s,।\-০-৯:()]+$/;
  return banglaPattern.test(text);
}

/**
 * Validate if string contains only Bangla numbers and decimal point
 * @param text - Text to validate
 * @returns true if valid Bangla number
 */
export function isBanglaNumber(text: string): boolean {
  if (!text) return true;
  
  const banglaNumberPattern = /^[০-৯।]+$/;
  return banglaNumberPattern.test(text);
}

/**
 * Format Bangla number input (allows only Bangla digits and decimal point)
 * @param value - Input value
 * @returns Formatted Bangla number string
 */
export function formatBanglaNumberInput(value: string): string {
  // Remove any non-Bangla-number characters
  return value
    .split('')
    .filter(char => /[০-৯।]/.test(char))
    .join('');
}

/**
 * Parse Bangla number to JavaScript number
 * @param banglaNumber - Bangla number string
 * @returns JavaScript number or NaN if invalid
 */
export function parseBanglaNumber(banglaNumber: string): number {
  const englishNumber = banglaToEnglish(banglaNumber);
  return parseFloat(englishNumber);
}

/**
 * Farm size units in Bangla (aligned with database enum)
 */
export const farmSizeUnits = [
  { value: 'bigha', label: 'বিঘা' },
  { value: 'katha', label: 'কাঠা' },
  { value: 'acre', label: 'একর' },
] as const;

/**
 * Predefined farm types in Bangla
 */
export const farmTypes = [
  'ধান',
  'সবজি',
  'ফল',
  'ডাল',
  'তেল ফসল',
  'মশলা',
  'ফুল',
  'মৎস্য চাষ',
  'পোল্ট্রি',
  'মিশ্র চাষ',
  'অন্যান্য',
] as const;

/**
 * Get farm size unit label from value
 */
export function getFarmSizeUnitLabel(value: string): string {
  const unit = farmSizeUnits.find(u => u.value === value);
  return unit?.label || value;
}

/**
 * Validate Bangla text input for forms
 * @param value - Input value
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateBanglaInput(value: string, fieldName: string): string | null {
  if (!value) {
    return `${fieldName} প্রয়োজন`;
  }
  
  if (!isBanglaText(value)) {
    return `${fieldName} শুধুমাত্র বাংলায় লিখুন`;
  }
  
  return null;
}

/**
 * Validate Bangla number input
 * @param value - Input value
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateBanglaNumber(value: string, fieldName: string): string | null {
  if (!value) {
    return `${fieldName} প্রয়োজন`;
  }
  
  if (!isBanglaNumber(value)) {
    return `${fieldName} শুধুমাত্র বাংলা সংখ্যায় লিখুন (০-৯)`;
  }
  
  const num = parseBanglaNumber(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} সঠিক সংখ্যা নয়`;
  }
  
  return null;
}
