/**
 * Government PDF Report Generator for Field Data Statistics
 * People's Republic of Bangladesh - Ministry of Agriculture Report
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// English month names
const ENGLISH_MONTHS: { [key: string]: string } = {
  '1': 'January', '2': 'February', '3': 'March',
  '4': 'April', '5': 'May', '6': 'June',
  '7': 'July', '8': 'August', '9': 'September',
  '10': 'October', '11': 'November', '12': 'December'
};

// Season name mapping (Bangla to English)
const SEASON_NAMES: { [key: string]: string } = {
  'রবি': 'Rabi (Winter)',
  'খরিফ-১': 'Kharif-1 (Pre-Monsoon)',
  'খরিফ-২': 'Kharif-2 (Monsoon)',
  'জায়েদ': 'Zayed (Summer)',
};

// Crop name mapping (Bangla to English)
const CROP_NAMES: { [key: string]: string } = {
  'ধান': 'Rice (Paddy)',
  'আমন ধান': 'Aman Rice',
  'বোরো ধান': 'Boro Rice',
  'আউশ ধান': 'Aus Rice',
  'গম': 'Wheat',
  'ভুট্টা': 'Maize (Corn)',
  'পাট': 'Jute',
  'আলু': 'Potato',
  'টমেটো': 'Tomato',
  'বেগুন': 'Brinjal (Eggplant)',
  'মরিচ': 'Chili',
  'পেঁয়াজ': 'Onion',
  'রসুন': 'Garlic',
  'আদা': 'Ginger',
  'হলুদ': 'Turmeric',
  'সরিষা': 'Mustard',
  'মসুর ডাল': 'Lentil',
  'ছোলা': 'Chickpea',
  'মাষকলাই': 'Black Gram',
  'মুগ ডাল': 'Mung Bean',
  'তিল': 'Sesame',
  'সূর্যমুখী': 'Sunflower',
  'ইক্ষু': 'Sugarcane',
  'আখ': 'Sugarcane',
  'কলা': 'Banana',
  'আম': 'Mango',
  'কাঁঠাল': 'Jackfruit',
  'লিচু': 'Litchi',
  'পেয়ারা': 'Guava',
  'লাউ': 'Bottle Gourd',
  'কুমড়া': 'Pumpkin',
  'শসা': 'Cucumber',
  'করলা': 'Bitter Gourd',
  'ঢেঁড়স': 'Okra (Lady Finger)',
  'পটল': 'Pointed Gourd',
  'ফুলকপি': 'Cauliflower',
  'বাঁধাকপি': 'Cabbage',
  'মূলা': 'Radish',
  'গাজর': 'Carrot',
  'শিম': 'Bean',
  'বরবটি': 'Yard Long Bean',
  'পালং শাক': 'Spinach',
  'লাল শাক': 'Red Amaranth',
  'পুঁইশাক': 'Malabar Spinach',
};

// Translate Bangla text to English using mappings
const translateToEnglish = (text: string | null | undefined): string => {
  if (!text) return 'N/A';
  // Check if it's a known crop name
  if (CROP_NAMES[text]) return CROP_NAMES[text];
  // Check if it's a known season
  if (SEASON_NAMES[text]) return SEASON_NAMES[text];
  // If it's already English, return as-is
  if (/^[a-zA-Z\s\-.,()0-9]+$/.test(text)) return text;
  // Otherwise return original (may not render correctly)
  return text;
};

// Safe number conversion helper
const toSafeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Format number with commas
const formatNumber = (num: any): string => {
  const safeNum = toSafeNumber(num);
  return safeNum.toLocaleString('en-US');
};

// Format currency in BDT
const formatCurrency = (num: any): string => {
  return `BDT ${formatNumber(num)}`;
};

// Safe toFixed helper
const safeToFixed = (value: any, decimals: number = 2): string => {
  return toSafeNumber(value).toFixed(decimals);
};

// Transliterate Bangla location names to English (basic)
const transliterate = (text: string | null | undefined): string => {
  if (!text) return 'N/A';
  // If it's already English, return as-is
  if (/^[a-zA-Z\s\-.,()0-9]+$/.test(text)) return text;
  // Otherwise just return the text (it may not render in PDF but at least won't crash)
  return text;
};

interface ReportFilters {
  division: string | null;
  district: string | null;
  upazila: string | null;
  year: string;
  month: string;
  season: string;
}

interface ReportData {
  statistics: any;
  filters: ReportFilters;
}

export const generateGovtPdfReport = async (data: ReportData): Promise<void> => {
  const { statistics, filters } = data;
  const doc = new jsPDF('p', 'mm', 'a4');

  // Load Bangla font (NotoSansBengali)
  // Note: For production, you need to embed Bangla font
  // This is a workaround using standard fonts with Unicode support

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  let yPos = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number = 30) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      addHeader();
    }
  };

  // Add Header
  const addHeader = () => {
    // Government Logo placeholder
    doc.setFillColor(0, 100, 0);
    doc.rect(margin, yPos, 15, 15, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('BD', margin + 4, yPos + 9);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('People\'s Republic of Bangladesh', margin + 20, yPos + 5);
    doc.setFontSize(10);
    doc.text('Ministry of Agriculture', margin + 20, yPos + 11);
    doc.text('Field Data Collection Report', margin + 20, yPos + 16);

    yPos += 25;
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
  };

  // Add Title Section
  const addTitleSection = () => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('AGRICULTURAL FIELD DATA REPORT', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Location info - use English names directly
    let locationText = 'Coverage: ';
    if (filters.upazila) locationText += `${filters.upazila} Upazila, `;
    if (filters.district) locationText += `${filters.district} District, `;
    if (filters.division) locationText += `${filters.division} Division`;
    if (!filters.division && !filters.district && !filters.upazila) locationText += 'All Bangladesh';
    
    doc.text(locationText, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    // Period info
    let periodText = `Report Period: ${filters.year}`;
    if (filters.month) periodText += ` - ${ENGLISH_MONTHS[filters.month] || filters.month}`;
    if (filters.season) periodText += ` (${SEASON_NAMES[filters.season] || filters.season})`;
    
    doc.text(periodText, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    // Generated date
    const now = new Date();
    doc.text(`Generated: ${now.toLocaleDateString('en-GB')} at ${now.toLocaleTimeString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  };

  // Section 1: Executive Summary
  const addExecutiveSummary = () => {
    checkPageBreak(60);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. EXECUTIVE SUMMARY', margin, yPos);
    yPos += 8;

    const overview = statistics.overview || {};
    const summaryData = [
      ['Total Farmers Surveyed', formatNumber(overview.totalFarmers)],
      ['Total Land Area (Decimals)', formatNumber(overview.totalLandArea)],
      ['Average Land per Farmer (Decimals)', safeToFixed(overview.averageLandSize, 2)],
      ['Total Production (Kg)', formatNumber(overview.totalProduction)],
      ['Average Production per Farmer (Kg)', safeToFixed(overview.averageProduction, 2)],
      ['Total Expenses (BDT)', formatCurrency(overview.totalExpenses)],
      ['Estimated Market Value (BDT)', formatCurrency(overview.totalMarketValue)],
      ['Verified Records', formatNumber(overview.verifiedCount)],
      ['Pending Verification', formatNumber(overview.pendingCount)],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Indicator', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [0, 100, 0], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right' }
      },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  };

  // Section 2: Land Statistics
  const addLandStatistics = () => {
    checkPageBreak(70);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. LAND STATISTICS', margin, yPos);
    yPos += 8;

    // Land Size Distribution
    if (statistics.landStats?.landSizeDistribution?.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('2.1 Farmer Classification by Land Size', margin, yPos);
      yPos += 5;

      const landData = statistics.landStats.landSizeDistribution.map((item: any) => [
        item.category_en || item.category || 'N/A',
        formatNumber(item.count || 0),
        formatNumber(item.totalArea || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Category', 'Farmers', 'Total Area (Decimals)']],
        body: landData,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 34] },
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // Irrigation Status
    if (statistics.landStats?.irrigationStatus?.length > 0) {
      checkPageBreak(40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('2.2 Irrigation Facilities', margin, yPos);
      yPos += 5;

      const irrigationData = statistics.landStats.irrigationStatus.map((item: any) => [
        item.type || 'N/A',
        formatNumber(item.count || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Irrigation Type', 'Number of Farmers']],
        body: irrigationData,
        theme: 'striped',
        headStyles: { fillColor: [70, 130, 180] },
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin },
        tableWidth: 'wrap',
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }
  };

  // Section 3: Crop Statistics
  const addCropStatistics = () => {
    checkPageBreak(70);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. CROP PRODUCTION STATISTICS', margin, yPos);
    yPos += 8;

    // Crop Distribution
    if (statistics.cropStats?.cropDistribution?.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('3.1 Crop Distribution', margin, yPos);
      yPos += 5;

      const cropData = statistics.cropStats.cropDistribution.slice(0, 10).map((item: any) => [
        translateToEnglish(item.name) || 'N/A',
        formatNumber(item.value || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Crop Name', 'Number of Farmers']],
        body: cropData,
        theme: 'striped',
        headStyles: { fillColor: [60, 179, 113] },
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin },
        tableWidth: 'wrap',
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // Season Distribution
    if (statistics.cropStats?.seasonDistribution?.length > 0) {
      checkPageBreak(40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('3.2 Season-wise Cultivation', margin, yPos);
      yPos += 5;

      const seasonData = statistics.cropStats.seasonDistribution.map((item: any) => [
        translateToEnglish(item.name) || 'N/A',
        formatNumber(item.value || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Season', 'Farmers']],
        body: seasonData,
        theme: 'striped',
        headStyles: { fillColor: [255, 165, 0] },
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin },
        tableWidth: 'wrap',
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }
  };

  // Section 4: Financial Analysis
  const addFinancialAnalysis = () => {
    checkPageBreak(70);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('4. FINANCIAL ANALYSIS', margin, yPos);
    yPos += 8;

    // Revenue Stats
    if (statistics.financialStats?.revenueStats) {
      const revenue = statistics.financialStats.revenueStats;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('4.1 Revenue Summary', margin, yPos);
      yPos += 5;

      const revenueData = [
        ['Estimated Total Revenue', formatCurrency(revenue.estimatedRevenue || 0)],
        ['Total Expenses', formatCurrency(revenue.totalExpenses || 0)],
        ['Estimated Net Profit', formatCurrency(revenue.estimatedProfit || 0)],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Amount (BDT)']],
        body: revenueData,
        theme: 'grid',
        headStyles: { fillColor: [128, 0, 128] },
        styles: { fontSize: 9 },
        margin: { left: margin, right: margin },
        tableWidth: 'wrap',
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // Expense Distribution
    if (statistics.financialStats?.expenseDistribution?.length > 0) {
      checkPageBreak(50);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('4.2 Expense Distribution', margin, yPos);
      yPos += 5;

      const expenseData = statistics.financialStats.expenseDistribution.map((item: any) => [
        item.category_en || item.category || 'N/A',
        formatNumber(item.count || 0),
        formatCurrency(item.totalExpense || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Expense Range', 'Farmers', 'Total Expense']],
        body: expenseData,
        theme: 'striped',
        headStyles: { fillColor: [220, 20, 60] },
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }
  };

  // Section 5: Regional Breakdown
  const addRegionalBreakdown = () => {
    checkPageBreak(80);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('5. REGIONAL BREAKDOWN', margin, yPos);
    yPos += 8;

    if (statistics.locationBreakdown?.length > 0) {
      const locationData = statistics.locationBreakdown.map((item: any) => [
        item.name_en || item.name || 'N/A',
        formatNumber(item.farmers || 0),
        formatNumber(item.landArea || 0),
        formatNumber(item.production || 0),
        formatCurrency(item.expenses || 0),
        formatCurrency(item.revenue || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Region', 'Farmers', 'Land (Dec)', 'Production', 'Expenses', 'Revenue']],
        body: locationData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 139] },
        styles: { fontSize: 7 },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }
  };

  // Section 6: Fertilizer Usage
  const addFertilizerSection = () => {
    checkPageBreak(50);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('6. FERTILIZER USAGE ANALYSIS', margin, yPos);
    yPos += 8;

    if (statistics.fertilizerStats) {
      const fertData = [
        ['Organic Fertilizer Users', formatNumber(statistics.fertilizerStats.organicUsage?.count), `${toSafeNumber(statistics.fertilizerStats.organicUsage?.percentage)}%`],
        ['Chemical Fertilizer Users', formatNumber(statistics.fertilizerStats.chemicalUsage?.count), `${toSafeNumber(statistics.fertilizerStats.chemicalUsage?.percentage)}%`],
        ['Both Types Users', formatNumber(statistics.fertilizerStats.bothUsage?.count), '-'],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Category', 'Count', 'Percentage']],
        body: fertData,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 34] },
        styles: { fontSize: 9 },
        margin: { left: margin, right: margin },
        tableWidth: 'wrap',
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }
  };

  // Add Footer
  const addFooter = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(0, 100, 0);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Ministry of Agriculture, Government of Bangladesh', margin, pageHeight - 10);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
      doc.text('Confidential - For Official Use Only', pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  };

  // Generate the report
  addHeader();
  addTitleSection();
  addExecutiveSummary();
  addLandStatistics();
  addCropStatistics();
  addFinancialAnalysis();
  addRegionalBreakdown();
  addFertilizerSection();
  addFooter();

  // Generate filename
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const filename = `Agricultural_Field_Report_${filters.year}_${dateStr}.pdf`;

  // Save the PDF
  doc.save(filename);
};

export default generateGovtPdfReport;
