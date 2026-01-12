/**
 * Bangla Font Loader for jsPDF
 * Uses NotoSansBengali font for proper Bangla text rendering
 */

import { jsPDF } from 'jspdf';

// Load the font dynamically from multiple sources
let fontLoaded = false;
let fontBase64: string | null = null;

export const loadBanglaFont = async (): Promise<string> => {
  if (fontBase64) return fontBase64;
  
  // Try multiple font sources
  const fontUrls = [
    '/fonts/NotoSansBengali-Regular.ttf',
    'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-bengali@5.0.8/files/noto-sans-bengali-all-400-normal.woff',
  ];

  for (const url of fontUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Convert to base64
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      fontBase64 = btoa(binary);
      console.log('Bangla font loaded successfully from:', url);
      return fontBase64;
    } catch (error) {
      console.warn('Failed to load font from:', url);
    }
  }
  
  throw new Error('Could not load Bangla font from any source');
};

export const addBanglaFontToDoc = async (doc: jsPDF): Promise<boolean> => {
  try {
    const base64 = await loadBanglaFont();
    doc.addFileToVFS('NotoSansBengali-Regular.ttf', base64);
    doc.addFont('NotoSansBengali-Regular.ttf', 'NotoSansBengali', 'normal');
    fontLoaded = true;
    return true;
  } catch (error) {
    console.error('Could not add Bangla font to PDF:', error);
    return false;
  }
};

// Bangla number conversion
const BANGLA_DIGITS: { [key: string]: string } = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export const toBanglaNumber = (num: number | string): string => {
  return String(num).replace(/[0-9]/g, (digit) => BANGLA_DIGITS[digit] || digit);
};

export const formatBanglaNumber = (num: any): string => {
  const safeNum = Number(num) || 0;
  const formatted = safeNum.toLocaleString('en-IN'); // Indian numbering system (lakhs, crores)
  return toBanglaNumber(formatted);
};

export const formatBanglaCurrency = (num: any): string => {
  const safeNum = Number(num) || 0;
  const formatted = safeNum.toLocaleString('en-IN');
  return `৳ ${toBanglaNumber(formatted)}`;
};

// Bangla month names
export const BANGLA_MONTHS: { [key: string]: string } = {
  '1': 'জানুয়ারি', '2': 'ফেব্রুয়ারি', '3': 'মার্চ',
  '4': 'এপ্রিল', '5': 'মে', '6': 'জুন',
  '7': 'জুলাই', '8': 'আগস্ট', '9': 'সেপ্টেম্বর',
  '10': 'অক্টোবর', '11': 'নভেম্বর', '12': 'ডিসেম্বর'
};

export default { loadBanglaFont, addBanglaFontToDoc, toBanglaNumber, formatBanglaNumber, formatBanglaCurrency, BANGLA_MONTHS };
