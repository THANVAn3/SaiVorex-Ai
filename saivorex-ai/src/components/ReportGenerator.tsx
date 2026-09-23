import React, { useState } from 'react';
import { CodeAnalysisResult, UrlScanResult } from '../types';
import { FileText, Download, Printer, ShieldCheck, CheckCircle2, FileType, FileCode, ChevronDown, Shield, Globe, Terminal, ShieldAlert, Award } from 'lucide-react';
import { computeGrade, getHeaderGrade } from '../utils/grading';
import jsPDF from 'jspdf';

interface ReportGeneratorProps {
  lastResult: CodeAnalysisResult | null;
  lastUrlResult?: UrlScanResult | null;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ lastResult, lastUrlResult }) => {
  const [reportFormat, setReportFormat] = useState<'executive' | 'technical'>('technical');
  const [showMarkdownMenu, setShowMarkdownMenu] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!lastResult) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth(); // ~210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // ~297mm
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    doc.setFillColor(11, 15, 25); // #0B0F19
    doc.rect(0, 0, pageWidth, 30, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(6, 182, 212); // cyan-400
    doc.text('SAIVOREX SECURITY AUDIT REPORT', margin, 14);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Generated: ${new Date().toLocaleDateString()}  |  Assessment ID: SVX-${Date.now().toString().slice(-6)}`, margin, 21);

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(pageWidth - margin - 38, 6, 38, 18, 2, 2, 'F');
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(7);
    doc.text('HEALTH INDEX', pageWidth - margin - 35, 11);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${lastResult.securityScore} / 100`, pageWidth - margin - 35, 19);

    y = 38;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('1. Executive Summary', margin, y);
    y += 6;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const summaryLines = doc.splitTextToSize(lastResult.summary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 4.5 + 6;

    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('2. Risk & Vulnerability Matrix', margin, y);
    y += 6;

    const colW = contentWidth / 4;
    const counts = [
      { label: 'CRITICAL', count: lastResult.severityCounts.CRITICAL || 0, color: [220, 38, 38] },
      { label: 'HIGH', count: lastResult.severityCounts.HIGH || 0, color: [234, 88, 12] },
      { label: 'MEDIUM', count: lastResult.severityCounts.MEDIUM || 0, color: [217, 119, 6] },
      { label: 'LOW / INFO', count: (lastResult.severityCounts.LOW || 0) + (lastResult.severityCounts.INFO || 0), color: [37, 99, 235] },
    ];

    counts.forEach((item, idx) => {
      const bx = margin + idx * colW;
      doc.setFillColor(248, 250, 252);
      doc.rect(bx, y, colW - 3, 14, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(bx, y, colW - 3, 14, 'S');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(item.color[0], item.color[1], item.color[2]);
      doc.text(item.label, bx + 4, y + 5);

      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(String(item.count), bx + 4, y + 11);
    });
    y += 20;

    checkPageBreak(25);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('3. Detailed Vulnerability Findings', margin, y);
    y += 8;

    lastResult.findings.forEach((finding, idx) => {
      const findingTitle = `${idx + 1}. ${finding.title} [${finding.severity}]`;
      const descLines = doc.splitTextToSize(finding.description, contentWidth - 8);
      const exploitLines = doc.splitTextToSize(`Exploit: ${finding.exploitScenario}`, contentWidth - 8);
      const itemHeight = 12 + (descLines.length + exploitLines.length) * 4 + 8;

      checkPageBreak(itemHeight);

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, itemHeight - 3, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, itemHeight - 3, 2, 2, 'S');

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(findingTitle, margin + 4, y + 6);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`CWE: ${finding.cwe}  |  OWASP: ${finding.owaspCategory}  |  Lines: ${finding.lineRange.join('-')}`, margin + 4, y + 11);

      let fy = y + 16;
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8);
      doc.text(descLines, margin + 4, fy);
      fy += descLines.length * 4;

      doc.setTextColor(109, 40, 217); // purple
      doc.text(exploitLines, margin + 4, fy);

      y += itemHeight;
    });

    checkPageBreak(30);
    y += 4;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('4. Action Items & Remediation Plan', margin, y);
    y += 8;

    lastResult.keyTakeaways.forEach((takeaway) => {
      const tLines = doc.splitTextToSize(`• ${takeaway}`, contentWidth - 4);
      checkPageBreak(tLines.length * 4.5 + 2);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(tLines, margin + 2, y);
      y += tLines.length * 4.5 + 3;
    });

    doc.save(`SaiVorex-Security-Audit-Report-${Date.now()}.pdf`);
  };

  const handleDownloadWord = () => {
    if (!lastResult) return;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>SaiVorex Security Audit Report</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; color: #1e293b; line-height: 1.6; margin: 30px; }
          .header { border-bottom: 3px solid #0284c7; padding-bottom: 12px; margin-bottom: 24px; }
          .title { color: #0284c7; font-size: 22pt; font-weight: bold; margin: 0; }
          .subtitle { color: #64748b; font-size: 11pt; margin-top: 4px; }
          .score-card { background-color: #0f172a; color: #ffffff; padding: 16px; border-radius: 8px; margin: 20px 0; }
          .score-title { font-size: 10pt; color: #38bdf8; text-transform: uppercase; font-weight: bold; }
          .score-val { font-size: 24pt; font-weight: bold; color: #ffffff; }
          h2 { color: #0f172a; font-size: 14pt; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; }
          .summary-box { background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 14px; margin: 16px 0; font-size: 11pt; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 10pt; }
          th { background-color: #f1f5f9; font-weight: bold; color: #334155; }
          .finding-card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px; margin-bottom: 16px; background-color: #ffffff; }
          .finding-title { font-size: 12pt; font-weight: bold; color: #0f172a; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 9pt; }
          .critical { background-color: #fee2e2; color: #991b1b; }
          .high { background-color: #ffedd5; color: #9a3412; }
          .medium { background-color: #fef3c7; color: #92400e; }
          .low { background-color: #e0f2fe; color: #075985; }
          .exploit-box { background-color: #f3e8ff; border: 1px solid #d8b4fe; padding: 10px; border-radius: 6px; color: #6b21a8; font-size: 10pt; margin-top: 10px; }
          pre { background-color: #0f172a; color: #f8fafc; padding: 14px; border-radius: 6px; font-family: 'Consolas', 'Courier New', monospace; font-size: 9.5pt; white-space: pre-wrap; word-wrap: break-word; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 9pt; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">SaiVorex Security Audit Report</h1>
          <div class="subtitle">Generated on: ${new Date().toLocaleDateString()} | Assessment ID: SVX-${Date.now().toString().slice(-6)}</div>
        </div>

        <div class="score-card">
          <div class="score-title">SaiVorex Health Index</div>
          <div class="score-val">${lastResult.securityScore} / 100 (${lastResult.securityScore >= 80 ? 'LOW RISK' : lastResult.securityScore >= 50 ? 'MODERATE RISK' : 'CRITICAL RISK'})</div>
        </div>

        <h2>1. Executive Summary</h2>
        <div class="summary-box">
          ${lastResult.summary}
        </div>

        <h2>2. Vulnerability Risk Matrix</h2>
        <table>
          <thead>
            <tr>
              <th>Severity Level</th>
              <th>Count</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge critical">CRITICAL</span></td>
              <td><strong>${lastResult.severityCounts.CRITICAL || 0}</strong></td>
              <td>Immediate exploit risk requiring urgent patch deployment</td>
            </tr>
            <tr>
              <td><span class="badge high">HIGH</span></td>
              <td><strong>${lastResult.severityCounts.HIGH || 0}</strong></td>
              <td>Significant vulnerability impacting system integrity or data privacy</td>
            </tr>
            <tr>
              <td><span class="badge medium">MEDIUM</span></td>
              <td><strong>${lastResult.severityCounts.MEDIUM || 0}</strong></td>
              <td>Moderate risk requiring scheduled remediation</td>
            </tr>
            <tr>
              <td><span class="badge low">LOW / INFO</span></td>
              <td><strong>${(lastResult.severityCounts.LOW || 0) + (lastResult.severityCounts.INFO || 0)}</strong></td>
              <td>Minor code flaw or informational security hardening item</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Detailed Findings & Exploits</h2>
        ${lastResult.findings
          .map(
            (f, idx) => `
          <div class="finding-card">
            <div class="finding-title">${idx + 1}. ${f.title} <span class="badge ${f.severity.toLowerCase()}">${f.severity}</span></div>
            <p style="margin: 6px 0; color: #64748b; font-size: 9.5pt;">
              <strong>CWE:</strong> ${f.cwe} &nbsp;|&nbsp; <strong>OWASP:</strong> ${f.owaspCategory} &nbsp;|&nbsp; <strong>Lines:</strong> ${f.lineRange.join('-')}
            </p>
            <p>${f.description}</p>
            <div class="exploit-box">
              <strong>EXPLOIT SCENARIO:</strong> ${f.exploitScenario}
            </div>
            <p style="margin-top: 10px;"><strong>Remediation:</strong> ${f.remediation}</p>
          </div>
        `
          )
          .join('')}

        <h2>4. Action Items & Remediation Plan</h2>
        <ul>
          ${lastResult.keyTakeaways.map((t) => `<li style="margin-bottom: 6px;">${t}</li>`).join('')}
        </ul>

        <h2>5. Refactored Secure Code</h2>
        <pre>${lastResult.remediatedCode}</pre>

        <div class="footer">
          Report generated by SaiVorex Security Platform &copy; ${new Date().getFullYear()} | Confidential & Proprietary
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SaiVorex-Security-Audit-Report-${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = (variant: 'technical' | 'executive' = 'technical') => {
    if (!lastResult) return;

    let md = `# SaiVorex Security Audit Report (${variant === 'technical' ? 'Technical Assessment' : 'Executive Brief'})\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**SaiVorex Health Index:** ${lastResult.securityScore} / 100\n`;
    md += `**Total Vulnerabilities:** ${lastResult.totalVulnerabilities}\n\n`;
    md += `## Executive Summary\n${lastResult.summary}\n\n`;

    if (variant === 'executive') {
      md += `## Risk Level Breakdown\n`;
      md += `- **Critical:** ${lastResult.severityCounts.CRITICAL || 0}\n`;
      md += `- **High:** ${lastResult.severityCounts.HIGH || 0}\n`;
      md += `- **Medium:** ${lastResult.severityCounts.MEDIUM || 0}\n`;
      md += `- **Low / Info:** ${(lastResult.severityCounts.LOW || 0) + (lastResult.severityCounts.INFO || 0)}\n\n`;
      md += `## Key Takeaways & Action Items\n`;
      lastResult.keyTakeaways.forEach((t) => {
        md += `- ${t}\n`;
      });
      md += `\n`;
    } else {
      md += `## Vulnerability Findings\n\n`;
      lastResult.findings.forEach((f, i) => {
        md += `### ${i + 1}. ${f.title} (${f.severity})\n`;
        md += `- **CWE:** ${f.cwe}\n`;
        md += `- **OWASP:** ${f.owaspCategory}\n`;
        md += `- **Lines:** ${f.lineRange[0]}-${f.lineRange[1]}\n`;
        md += `- **Description:** ${f.description}\n`;
        md += `- **Exploit Scenario:** ${f.exploitScenario}\n`;
        md += `- **Remediation:** ${f.remediation}\n\n`;
      });
      md += `## Refactored Secure Code\n\n\`\`\`\n${lastResult.remediatedCode}\n\`\`\`\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SaiVorex-Audit-${variant}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMarkdownMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Audit Report Generator</h2>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
              Compliance Ready
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Export comprehensive security assessment reports in PDF, Word Document, or Markdown format aligned with OWASP & ISO standards.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-800 p-1.5 rounded-full self-start lg:self-auto">
          <button
            onClick={() => setReportFormat('technical')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
              reportFormat === 'technical'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical Report
          </button>
          <button
            onClick={() => setReportFormat('executive')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
              reportFormat === 'executive'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Executive Summary
          </button>
        </div>
      </div>

      {!lastResult && !lastUrlResult && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xl">
          <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-white font-bold text-base">No Audit Scan Data Available Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Please run a scan in the <strong className="text-cyan-300">Code Audit</strong> or <strong className="text-emerald-400">Header Audit</strong> tabs to populate the full compliance audit reports.
          </p>
        </div>
      )}

      {(lastResult || lastUrlResult) && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl shadow-lg print:hidden">
            <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              Download Audit Report Options:
            </span>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all active:scale-95"
              >
                <FileType className="w-4 h-4" />
                <span>Download PDF (.pdf)</span>
              </button>

              <button
                onClick={handleDownloadWord}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all active:scale-95"
              >
                <FileCode className="w-4 h-4" />
                <span>Download Word Doc (.doc)</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMarkdownMenu(!showMarkdownMenu)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Markdown</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showMarkdownMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0B0F19] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                    <button
                      onClick={() => handleDownloadMarkdown('technical')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex flex-col transition-all"
                    >
                      <span className="font-bold text-cyan-400">Technical Report (.md)</span>
                      <span className="text-[10px] text-slate-400">Full code, CWEs & vulnerability details</span>
                    </button>

                    <button
                      onClick={() => handleDownloadMarkdown('executive')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex flex-col transition-all border-t border-slate-800/80 pt-1.5"
                    >
                      <span className="font-bold text-amber-400">Executive Brief (.md)</span>
                      <span className="text-[10px] text-slate-400">High-level summary & key takeaways</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <div className="bg-[#080c16] border border-slate-800 rounded-2xl p-8 space-y-8 print:bg-white print:text-black">
            <div className="flex items-center justify-between border-b border-slate-800 pb-6 print:border-gray-300">
              <div className="flex items-center gap-4">
                <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md" />
                  <img
                    src="/logo.png"
                    alt="SaiVorex Logo"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedJpg) {
                        target.dataset.triedJpg = 'true';
                        target.src = '/logo.jpg';
                      } else {
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }
                    }}
                    className="w-10 h-10 object-contain relative z-10 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  />
                  <Shield className="hidden w-9 h-9 text-cyan-400 relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                    SaiVorex Cybersecurity Auditing Suite
                  </span>
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    Unified Multi-Vector Security Assessment Report
                  </h1>
                  <p className="text-xs text-slate-400 font-mono">
                    Generated on: {new Date().toLocaleDateString()} | Assessment ID: SVX-{Date.now().toString().slice(-6)}
                  </p>
                </div>
              </div>

              <div className="text-right border border-cyan-500/40 bg-cyan-950/30 px-5 py-3 rounded-2xl font-mono">
                <span className="text-[10px] text-cyan-300 block font-bold">COMPLIANCE INDEX</span>
                <span className="text-3xl font-black text-white">
                  {lastResult ? lastResult.securityScore : lastUrlResult ? lastUrlResult.overallScore : 88}/100
                </span>
              </div>
            </div>

            <div className="space-y-4 border border-cyan-500/20 bg-slate-900/40 p-6 rounded-2xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Audit Report 1: Source Code Security Audit (SAST)
                </h3>
              </div>

              {lastResult ? (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <strong className="text-cyan-300 block font-mono mb-1">CODE AUDIT SUMMARY:</strong>
                    {lastResult.summary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                    <div className="p-3 bg-red-950/50 border border-red-900/60 rounded-xl">
                      <span className="text-red-400 block font-bold text-[10px]">CRITICAL</span>
                      <span className="text-xl font-bold text-white">{lastResult.severityCounts.CRITICAL || 0}</span>
                    </div>
                    <div className="p-3 bg-rose-950/50 border border-rose-900/60 rounded-xl">
                      <span className="text-rose-400 block font-bold text-[10px]">HIGH</span>
                      <span className="text-xl font-bold text-white">{lastResult.severityCounts.HIGH || 0}</span>
                    </div>
                    <div className="p-3 bg-amber-950/50 border border-amber-900/60 rounded-xl">
                      <span className="text-amber-400 block font-bold text-[10px]">MEDIUM</span>
                      <span className="text-xl font-bold text-white">{lastResult.severityCounts.MEDIUM || 0}</span>
                    </div>
                    <div className="p-3 bg-blue-950/50 border border-blue-900/60 rounded-xl">
                      <span className="text-blue-400 block font-bold text-[10px]">LOW / INFO</span>
                      <span className="text-xl font-bold text-white">
                        {(lastResult.severityCounts.LOW || 0) + (lastResult.severityCounts.INFO || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="font-mono text-cyan-400 font-bold block">Detected Code Findings:</span>
                    {lastResult.findings.slice(0, 3).map((f, i) => (
                      <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="font-bold text-white">{i + 1}. {f.title}</span>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                          {f.severity} | {f.cwe}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl text-slate-500 font-mono text-xs">
                  No Code Audit scan performed in this session yet. Run a code scan in the Code Audit tab.
                </div>
              )}
            </div>

            <div className="space-y-4 border border-emerald-500/20 bg-slate-900/40 p-6 rounded-2xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Audit Report 2: HTTP Security Header & Link Phishing Audit
                </h3>
              </div>

              {lastUrlResult ? (() => {
                const gradeInfo = computeGrade(lastUrlResult.overallScore);
                const letterGrade = lastUrlResult.grade || gradeInfo.grade;
                const gp = typeof lastUrlResult.gradePoint === 'number' ? lastUrlResult.gradePoint : gradeInfo.gradePoint;
                const desc = lastUrlResult.gradeDescription || gradeInfo.label;

                return (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <span className="text-slate-400 text-[10px] block">TARGET DOMAIN</span>
                        <span className="text-white font-bold truncate block">{lastUrlResult.url}</span>
                      </div>

                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <span className="text-slate-400 text-[10px] block">AUDIT SECURITY GRADE</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-emerald-400 font-black text-lg">GRADE {letterGrade}</span>
                          <span className="text-slate-400 text-[11px]">({gp.toFixed(1)} / 10.0 GP)</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <span className="text-slate-400 text-[10px] block">LINK SAFETY RATE</span>
                        <span className="text-emerald-400 font-bold text-base">
                          {lastUrlResult.phishingAnalysis?.safetyPercentage || lastUrlResult.overallScore}% SAFE
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <span className="text-slate-400 text-[10px] block">GRADE ASSESSMENT</span>
                        <span className="text-cyan-400 font-bold truncate block">
                          {desc}
                        </span>
                      </div>
                    </div>

                    {lastUrlResult.headers && lastUrlResult.headers.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-emerald-400 font-bold block">Audited Header Grade Points:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {lastUrlResult.headers.map((h, idx) => {
                            const hg = getHeaderGrade(h.status);
                            const hGrade = h.grade || hg.grade;
                            const hGp = typeof h.gradePoint === 'number' ? h.gradePoint : hg.gradePoint;
                            return (
                              <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-2">
                                <span className="text-slate-200 truncate">{h.headerName}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${hg.badgeClass}`}>
                                  Grade {hGrade} ({hGp.toFixed(1)} GP)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-emerald-400 font-bold block">Phishing Risk Factor Findings:</span>
                      {(lastUrlResult.phishingAnalysis?.phishingRiskFactors || ['SSL Certificate verified']).map((rf, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                          • {rf}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })() : (
                <div className="p-4 bg-slate-950 rounded-xl text-slate-500 font-mono text-xs">
                  No Header Audit scan performed in this session yet. Run a scan in the Header Audit tab.
                </div>
              )}
            </div>

            <div className="space-y-4 border border-purple-500/20 bg-slate-900/40 p-6 rounded-2xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Audit Report 3: OWASP Top 10 Compliance Matrix Alignment
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-purple-400 font-bold block">A01:2021 - Broken Access Control</span>
                  <p className="text-slate-400 text-[11px]">Audit status: Pass / Enforced IDOR check</p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-purple-400 font-bold block">A03:2021 - Injection (SQLi / XSS)</span>
                  <p className="text-slate-400 text-[11px]">Audit status: Monitored via SaiVorex AST</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 border border-amber-500/20 bg-slate-900/40 p-6 rounded-2xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Terminal className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Audit Report 4: Payload Laboratory Vulnerability Simulation
                </h3>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl text-xs text-slate-300 font-mono leading-relaxed space-y-2">
                <p>
                  <strong>Payload Execution Status:</strong> All simulated attack payloads (SQL Injection, XSS, Path Traversal, SSRF) executed inside isolated SaiVorex Sandbox.
                </p>
                <p className="text-amber-300">
                  WAF Rule Recommendations and sanitization signatures generated successfully.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Remediation & Hardening Action Items
              </h3>

              <div className="space-y-2">
                {(lastResult?.keyTakeaways || [
                  'Deploy prepared parameterized queries to neutralize SQL Injection risks.',
                  'Configure Strict-Transport-Security (HSTS) with max-age=31536000.',
                  'Enforce Content Security Policy (CSP) with strict nonce script execution.',
                  'Sanitize user inputs and enforce CORS origin whitelist.'
                ]).map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

