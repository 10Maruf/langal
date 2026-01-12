/**
 * Government PDF Report Generator for Field Data Statistics (Bangla Version)
 * গণপ্রজাতন্ত্রী বাংলাদেশ সরকার - কৃষি মন্ত্রণালয় প্রতিবেদন
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { addBanglaFontToDoc, formatBanglaNumber, formatBanglaCurrency, toBanglaNumber, BANGLA_MONTHS } from './banglaFont';

// Season names in Bangla
const SEASON_NAMES: { [key: string]: string } = {
  'রবি': 'রবি মৌসুম',
  'খরিফ-১': 'খরিফ-১ মৌসুম',
  'খরিফ-২': 'খরিফ-২ মৌসুম',
  'জায়েদ': 'জায়েদ মৌসুম',
};

// Safe number conversion helper
const toSafeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Safe toFixed helper
const safeToFixed = (value: any, decimals: number = 2): string => {
  return toBanglaNumber(toSafeNumber(value).toFixed(decimals));
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

export const generateBanglaPdfReport = async (data: ReportData): Promise<void> => {
  const { statistics, filters } = data;
  const doc = new jsPDF('p', 'mm', 'a4');

  // Load and add Bangla font
  let banglaFontAvailable = false;
  try {
    banglaFontAvailable = await addBanglaFontToDoc(doc);
    if (banglaFontAvailable) {
      doc.setFont('NotoSansBengali', 'normal');
    }
  } catch (error) {
    console.warn('Bangla font not loaded, PDF may not display Bangla text correctly');
  }

  // If font not available, show alert and return
  if (!banglaFontAvailable) {
    alert('বাংলা ফন্ট লোড হয়নি। অনুগ্রহ করে English PDF ব্যবহার করুন।');
    return;
  }

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

  // Set Bangla font for all text
  const setBanglaFont = (size: number = 10, style: string = 'normal') => {
    try {
      doc.setFont('NotoSansBengali', style);
    } catch {
      doc.setFont('helvetica', style);
    }
    doc.setFontSize(size);
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
    setBanglaFont(14);
    doc.text('গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', margin + 20, yPos + 5);
    setBanglaFont(10);
    doc.text('কৃষি মন্ত্রণালয়', margin + 20, yPos + 11);
    doc.text('মাঠ পর্যায়ের তথ্য সংগ্রহ প্রতিবেদন', margin + 20, yPos + 16);

    yPos += 25;
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
  };

  // Add Title Section
  const addTitleSection = () => {
    setBanglaFont(16);
    doc.text('কৃষি মাঠ তথ্য প্রতিবেদন', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    setBanglaFont(10);
    
    // Location info
    let locationText = 'এলাকা: ';
    if (filters.upazila) locationText += `${filters.upazila} উপজেলা, `;
    if (filters.district) locationText += `${filters.district} জেলা, `;
    if (filters.division) locationText += `${filters.division} বিভাগ`;
    if (!filters.division && !filters.district && !filters.upazila) locationText += 'সমগ্র বাংলাদেশ';
    
    doc.text(locationText, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    // Period info
    let periodText = `প্রতিবেদন সময়কাল: ${toBanglaNumber(filters.year)}`;
    if (filters.month) periodText += ` - ${BANGLA_MONTHS[filters.month] || filters.month}`;
    if (filters.season) periodText += ` (${SEASON_NAMES[filters.season] || filters.season})`;
    
    doc.text(periodText, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    // Generated date
    const now = new Date();
    const dateStr = `${toBanglaNumber(now.getDate())}/${toBanglaNumber(now.getMonth() + 1)}/${toBanglaNumber(now.getFullYear())}`;
    doc.text(`তৈরির তারিখ: ${dateStr}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  };

  // Section 1: Executive Summary
  const addExecutiveSummary = () => {
    checkPageBreak(60);
    
    setBanglaFont(12);
    doc.text('১. সংক্ষিপ্ত বিবরণী', margin, yPos);
    yPos += 8;

    const overview = statistics.overview || {};
    const summaryData = [
      ['মোট জরিপকৃত কৃষক', formatBanglaNumber(overview.totalFarmers)],
      ['মোট জমির পরিমাণ (শতক)', formatBanglaNumber(overview.totalLandArea)],
      ['কৃষক প্রতি গড় জমি (শতক)', safeToFixed(overview.averageLandSize, 2)],
      ['মোট উৎপাদন (কেজি)', formatBanglaNumber(overview.totalProduction)],
      ['কৃষক প্রতি গড় উৎপাদন (কেজি)', safeToFixed(overview.averageProduction, 2)],
      ['মোট ব্যয় (টাকা)', formatBanglaCurrency(overview.totalExpenses)],
      ['আনুমানিক বাজার মূল্য (টাকা)', formatBanglaCurrency(overview.totalMarketValue)],
      ['যাচাইকৃত রেকর্ড', formatBanglaNumber(overview.verifiedCount)],
      ['যাচাই বাকি', formatBanglaNumber(overview.pendingCount)],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['সূচক', 'মান']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [0, 100, 0], textColor: 255, font: 'NotoSansBengali' },
      styles: { fontSize: 9, cellPadding: 3, font: 'NotoSansBengali' },
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

    setBanglaFont(12);
    doc.text('২. জমি সংক্রান্ত পরিসংখ্যান', margin, yPos);
    yPos += 8;

    // Land Size Distribution
    if (statistics.landStats?.landSizeDistribution?.length > 0) {
      setBanglaFont(10);
      doc.text('২.১ জমির আকার অনুযায়ী কৃষক শ্রেণিবিভাগ', margin, yPos);
      yPos += 5;

      const landData = statistics.landStats.landSizeDistribution.map((item: any) => [
        item.category || 'অজানা',
        formatBanglaNumber(item.count || 0),
        formatBanglaNumber(item.totalArea || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['শ্রেণি', 'কৃষক সংখ্যা', 'মোট জমি (শতক)']],
        body: landData,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 34], font: 'NotoSansBengali' },
        styles: { fontSize: 8, font: 'NotoSansBengali' },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // Irrigation Status
    if (statistics.landStats?.irrigationStatus?.length > 0) {
      checkPageBreak(40);
      setBanglaFont(10);
      doc.text('২.২ সেচ সুবিধা', margin, yPos);
      yPos += 5;

      const irrigationData = statistics.landStats.irrigationStatus.map((item: any) => [
        item.type || 'অজানা',
        formatBanglaNumber(item.count || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['সেচ প্রকার', 'কৃষক সংখ্যা']],
        body: irrigationData,
        theme: 'striped',
        headStyles: { fillColor: [70, 130, 180], font: 'NotoSansBengali' },
        styles: { fontSize: 8, font: 'NotoSansBengali' },
        margin: { left: margin, right: margin },
        tableWidth: 'wrap',
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }
  };

  // Section 3: Crop Statistics
  const addCropStatistics = () => {
    checkPageBreak(70);

    setBanglaFont(12);
    doc.text('৩. ফসল উৎপাদন পরিসংখ্যান', margin, yPos);
    yPos += 8;

    // Crop Distribution
    if (statistics.cropStats?.cropDistribution?.length > 0) {
      setBanglaFont(10);
      doc.text('৩.১ ফসল বিন্যাস', margin, yPos);
      yPos += 5;

      const cropData = statistics.cropStats.cropDistribution.slice(0, 10).map((item: any) => [
        item.name || 'অজানা',
        formatBanglaNumber(item.value || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['ফসলের নাম', 'কৃষক সংখ্যা']],
        body: cropData,
        theme: 'striped',
        headStyles: { fillColor: [60, 179, 113], font: 'NotoSansBengali' },
        styles: { fontSize: 8, font: 'NotoSansBengali' },
        margin: { left: margin, right: margin },
        tableWidth: 'wrap',
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // Season Distribution
    if (statistics.cropStats?.seasonDistribution?.length > 0) {
      checkPageBreak(40);
      setBanglaFont(10);
      doc.text('৩.২ মৌসুম ভিত্তিক চাষাবাদ', margin, yPos);
      yPos += 5;

      const seasonData = statistics.cropStats.seasonDistribution.map((item: any) => [
        item.name || 'অজানা',
        formatBanglaNumber(item.value || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['মৌসুম', 'কৃষক সংখ্যা']],
        body: seasonData,
        theme: 'striped',
        headStyles: { fillColor: [255, 165, 0], font: 'NotoSansBengali' },
        styles: { fontSize: 8, font: 'NotoSansBengali' },
        margin: { left: margin, right: margin },
        tableWidth: 'wrap',
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }
  };

  // Section 4: Financial Analysis
  const addFinancialAnalysis = () => {
    checkPageBreak(70);

    setBanglaFont(12);
    doc.text('৪. আর্থিক বিশ্লেষণ', margin, yPos);
    yPos += 8;

    // Revenue Stats
    if (statistics.financialStats?.revenueStats) {
      const revenue = statistics.financialStats.revenueStats;
      
      setBanglaFont(10);
      doc.text('৪.১ আয়ের সারসংক্ষেপ', margin, yPos);
      yPos += 5;

      const revenueData = [
        ['আনুমানিক মোট আয়', formatBanglaCurrency(revenue.estimatedRevenue || 0)],
        ['মোট ব্যয়', formatBanglaCurrency(revenue.totalExpenses || 0)],
        ['আনুমানিক নিট লাভ', formatBanglaCurrency(revenue.estimatedProfit || 0)],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['বিবরণ', 'পরিমাণ (টাকা)']],
        body: revenueData,
        theme: 'grid',
        headStyles: { fillColor: [128, 0, 128], font: 'NotoSansBengali' },
        styles: { fontSize: 9, font: 'NotoSansBengali' },
        margin: { left: margin, right: margin },
        tableWidth: 'wrap',
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }

    // Expense Distribution
    if (statistics.financialStats?.expenseDistribution?.length > 0) {
      checkPageBreak(50);
      setBanglaFont(10);
      doc.text('৪.২ ব্যয় বিন্যাস', margin, yPos);
      yPos += 5;

      const expenseData = statistics.financialStats.expenseDistribution.map((item: any) => [
        item.category || 'অজানা',
        formatBanglaNumber(item.count || 0),
        formatBanglaCurrency(item.totalExpense || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['ব্যয়ের সীমা', 'কৃষক সংখ্যা', 'মোট ব্যয়']],
        body: expenseData,
        theme: 'striped',
        headStyles: { fillColor: [220, 20, 60], font: 'NotoSansBengali' },
        styles: { fontSize: 8, font: 'NotoSansBengali' },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 8;
    }
  };

  // Section 5: Regional Breakdown
  const addRegionalBreakdown = () => {
    checkPageBreak(80);

    setBanglaFont(12);
    doc.text('৫. এলাকাভিত্তিক বিভাজন (ডাকঘর অনুযায়ী)', margin, yPos);
    yPos += 8;

    if (statistics.locationBreakdown?.length > 0) {
      const locationData = statistics.locationBreakdown.map((item: any) => [
        item.name || 'অজানা',
        formatBanglaNumber(item.farmers || 0),
        formatBanglaNumber(item.landArea || 0),
        formatBanglaNumber(item.production || 0),
        formatBanglaCurrency(item.expenses || 0),
        formatBanglaCurrency(item.revenue || 0)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['এলাকা', 'কৃষক', 'জমি (শতক)', 'উৎপাদন', 'ব্যয়', 'আয়']],
        body: locationData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 139], font: 'NotoSansBengali' },
        styles: { fontSize: 7, font: 'NotoSansBengali' },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }
  };

  // Section 6: Fertilizer Usage
  const addFertilizerSection = () => {
    checkPageBreak(50);

    setBanglaFont(12);
    doc.text('৬. সার ব্যবহার বিশ্লেষণ', margin, yPos);
    yPos += 8;

    if (statistics.fertilizerStats) {
      const fertData = [
        ['জৈব সার ব্যবহারকারী', formatBanglaNumber(statistics.fertilizerStats.organicUsage?.count), `${toBanglaNumber(toSafeNumber(statistics.fertilizerStats.organicUsage?.percentage))}%`],
        ['রাসায়নিক সার ব্যবহারকারী', formatBanglaNumber(statistics.fertilizerStats.chemicalUsage?.count), `${toBanglaNumber(toSafeNumber(statistics.fertilizerStats.chemicalUsage?.percentage))}%`],
        ['উভয় প্রকার ব্যবহারকারী', formatBanglaNumber(statistics.fertilizerStats.bothUsage?.count), '-'],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['বিভাগ', 'সংখ্যা', 'শতাংশ']],
        body: fertData,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 34], font: 'NotoSansBengali' },
        styles: { fontSize: 9, font: 'NotoSansBengali' },
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
      setBanglaFont(8);
      doc.setTextColor(100, 100, 100);
      doc.text('কৃষি মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', margin, pageHeight - 10);
      doc.text(`পৃষ্ঠা ${toBanglaNumber(i)} / ${toBanglaNumber(totalPages)}`, pageWidth - margin - 25, pageHeight - 10);
      doc.text('গোপনীয় - সরকারি ব্যবহারের জন্য', pageWidth / 2, pageHeight - 10, { align: 'center' });
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
  const filename = `কৃষি_মাঠ_তথ্য_প্রতিবেদন_${filters.year}_${dateStr}.pdf`;

  // Save the PDF
  doc.save(filename);
};

export default generateBanglaPdfReport;
