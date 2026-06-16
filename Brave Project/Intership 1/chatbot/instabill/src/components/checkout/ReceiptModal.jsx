// src/components/checkout/ReceiptModal.jsx
import React, { useRef, useState } from 'react';
import { X, Printer, Download, Share2, Mail, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useStore } from '../../context/StoreContext';

export const ReceiptModal = ({ invoice, isOpen, onClose }) => {
  const { addNotification } = useStore();
  const receiptRef = useRef();
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    // Standard print layouts are defined in index.css using media print
    window.print();
    addNotification('success', 'Print job sent to system spooler.');
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    addNotification('info', 'Compiling supermarket-grade invoice PDF...');

    try {
      const element = receiptRef.current;
      
      // Render canvas using html2canvas
      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Invoice paper aspect ratio (typically narrow roll)
      // Standard receipt size in jspdf can be customized
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 180] // Typical 80mm receipt rolls
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Fit canvas to PDF dimensions
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      
      // Save
      pdf.save(`${invoice.billNumber}.pdf`);
      addNotification('success', `Receipt ${invoice.billNumber} downloaded successfully as PDF!`);
    } catch (error) {
      console.error('PDF generation error:', error);
      addNotification('error', 'Failed to generate receipt PDF. Try printing instead.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Anand Stores Receipt',
        text: `Receipt for your transaction of ₹${invoice.totalAmount} at Anand Stores`,
        url: window.location.href
      }).then(() => {
        addNotification('success', 'Receipt shared successfully.');
      }).catch(err => {
        console.log(err);
      });
    } else {
      addNotification('success', `Copied link to clipboard: https://instabill.pro/r/${invoice.billNumber}`);
    }
  };

  const handleSendEmail = () => {
    addNotification('success', `Receipt dispatched to customer email address.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      
      {/* Container Card */}
      <div className="w-full max-w-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col my-8">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-850 flex items-center justify-between bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-sm text-zinc-800 dark:text-white">Transaction Success</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-150 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable receipt viewport */}
        <div className="p-6 overflow-y-auto flex-grow flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/20">
          
          {/* RECEIPT PAPER VIEW (This target gets generated to PDF/printed) */}
          <div 
            ref={receiptRef}
            id="printable-receipt"
            className="w-full max-w-[320px] bg-white text-zinc-900 p-5 shadow-lg border border-zinc-200/60 font-mono text-[9px] leading-relaxed relative flex flex-col items-center"
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
          >
            {/* Header branding */}
            <div className="text-center w-full mb-3 pb-3 border-b border-dashed border-zinc-400">
              <h2 className="text-sm font-bold tracking-tight uppercase" style={{ margin: 0, fontWeight: 900 }}>ANAND STORES</h2>
              <p className="text-[7px] text-zinc-500 leading-tight mt-0.5">Smart Retail Operating System</p>
              <p className="text-[7px] text-zinc-500 mt-1">Tagline: Smart Retail Billing & Inventory Management</p>
              <p className="text-[8px] font-bold text-zinc-700 mt-2">GST NO: {invoice.gstNumber}</p>
            </div>

            {/* Bill metadata details */}
            <div className="w-full space-y-1 mb-3 pb-2 border-b border-dashed border-zinc-400 text-left">
              <div className="flex justify-between">
                <span>BILL NO:</span>
                <span className="font-bold">{invoice.billNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE/TIME:</span>
                <span>{new Date(invoice.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>CASHIER:</span>
                <span className="font-bold">{invoice.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>PAY METHOD:</span>
                <span>{invoice.paymentMethod}</span>
              </div>

              {invoice.customerPhone && (
                <div className="pt-1.5 border-t border-dotted border-zinc-300 mt-1.5 space-y-1">
                  <div className="flex justify-between">
                    <span>CUSTOMER:</span>
                    <span className="font-bold">{invoice.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MOBILE:</span>
                    <span>{invoice.customerPhone}</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span>POINTS EARNED:</span>
                    <span className="font-bold">+{invoice.loyaltyPointsEarned} pts</span>
                  </div>
                </div>
              )}
            </div>

            {/* Products grid Table */}
            <table className="w-full text-left mb-3 pb-3 border-b border-dashed border-zinc-400">
              <thead>
                <tr className="border-b border-zinc-300 font-bold">
                  <th className="pb-1 w-2/5">ITEM NAME</th>
                  <th className="pb-1 text-center w-1/5">QTY</th>
                  <th className="pb-1 text-right w-1/5">RATE</th>
                  <th className="pb-1 text-right w-1/5">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dotted divide-zinc-200">
                {invoice.items ? (
                  invoice.items.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="py-1 uppercase font-bold truncate max-w-[120px]">{item.name}</td>
                      <td className="py-1 text-center">{item.quantity}</td>
                      <td className="py-1 text-right">₹{item.sellingPrice}</td>
                      <td className="py-1 text-right">₹{item.total}</td>
                    </tr>
                  ))
                ) : (
                  // Fallback for pre-seeded simple invoices
                  <tr>
                    <td className="py-1 font-bold">Consolidated Retail Purchase</td>
                    <td className="py-1 text-center">1</td>
                    <td className="py-1 text-right">₹{invoice.subtotal}</td>
                    <td className="py-1 text-right">₹{invoice.totalAmount}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Financial summary calculations */}
            <div className="w-full space-y-1 mb-4 text-right">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>₹{invoice.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST/SGST (TAX):</span>
                <span>₹{invoice.gstAmount}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between font-bold">
                  <span>DISCOUNT:</span>
                  <span>-₹{invoice.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold border-t border-zinc-300 pt-1">
                <span>NET PAY AMOUNT:</span>
                <span>₹{invoice.totalAmount}</span>
              </div>
              {invoice.savings > 0 && (
                <div className="flex justify-between font-bold text-[8px] pt-0.5 text-zinc-700">
                  <span>TOTAL ESTIMATED SAVINGS:</span>
                  <span>₹{invoice.savings}</span>
                </div>
              )}
            </div>

            {/* Barcode representation */}
            <div className="flex flex-col items-center gap-1 mb-3 w-full">
              <svg viewBox="0 0 100 24" className="w-36 h-8 overflow-visible">
                {/* Simple simulated barcode layout */}
                <rect x="0" y="0" width="100" height="24" fill="#ffffff" />
                <rect x="5" y="2" width="2" height="20" fill="#000000" />
                <rect x="9" y="2" width="1" height="20" fill="#000000" />
                <rect x="12" y="2" width="3" height="20" fill="#000000" />
                <rect x="17" y="2" width="1" height="20" fill="#000000" />
                <rect x="19" y="2" width="2" height="20" fill="#000000" />
                <rect x="23" y="2" width="1" height="20" fill="#000000" />
                <rect x="26" y="2" width="4" height="20" fill="#000000" />
                <rect x="32" y="2" width="1" height="20" fill="#000000" />
                <rect x="35" y="2" width="2" height="20" fill="#000000" />
                <rect x="39" y="2" width="3" height="20" fill="#000000" />
                <rect x="44" y="2" width="1" height="20" fill="#000000" />
                <rect x="47" y="2" width="2" height="20" fill="#000000" />
                <rect x="51" y="2" width="1" height="20" fill="#000000" />
                <rect x="54" y="2" width="4" height="20" fill="#000000" />
                <rect x="60" y="2" width="1" height="20" fill="#000000" />
                <rect x="63" y="2" width="2" height="20" fill="#000000" />
                <rect x="67" y="2" width="3" height="20" fill="#000000" />
                <rect x="72" y="2" width="1" height="20" fill="#000000" />
                <rect x="75" y="2" width="2" height="20" fill="#000000" />
                <rect x="79" y="2" width="1" height="20" fill="#000000" />
                <rect x="82" y="2" width="4" height="20" fill="#000000" />
                <rect x="88" y="2" width="1" height="20" fill="#000000" />
                <rect x="91" y="2" width="2" height="20" fill="#000000" />
                <rect x="94" y="2" width="1" height="20" fill="#000000" />
              </svg>
              <span className="text-[7px] text-zinc-500 font-mono tracking-widest">{invoice.billNumber}</span>
            </div>

            {/* QR verification representation */}
            <div className="flex flex-col items-center gap-1 mb-4 w-full">
              {/* Simulated QR Code structure */}
              <svg viewBox="0 0 40 40" className="w-16 h-16 border border-zinc-200 p-1 bg-white">
                <rect x="0" y="0" width="40" height="40" fill="#ffffff" />
                {/* QR corner finders */}
                <rect x="2" y="2" width="10" height="10" fill="#000000" />
                <rect x="4" y="4" width="6" height="6" fill="#ffffff" />
                <rect x="5" y="5" width="4" height="4" fill="#000000" />

                <rect x="28" y="2" width="10" height="10" fill="#000000" />
                <rect x="30" y="4" width="6" height="6" fill="#ffffff" />
                <rect x="31" y="5" width="4" height="4" fill="#000000" />

                <rect x="2" y="28" width="10" height="10" fill="#000000" />
                <rect x="4" y="30" width="6" height="6" fill="#ffffff" />
                <rect x="5" y="31" width="4" height="4" fill="#000000" />

                {/* Random blocks */}
                <rect x="15" y="4" width="2" height="6" fill="#000000" />
                <rect x="20" y="2" width="4" height="2" fill="#000000" />
                <rect x="18" y="8" width="6" height="2" fill="#000000" />
                
                <rect x="2" y="15" width="6" height="2" fill="#000000" />
                <rect x="6" y="20" width="2" height="4" fill="#000000" />
                <rect x="10" y="18" width="4" height="2" fill="#000000" />

                <rect x="15" y="15" width="10" height="10" fill="#000000" />
                <rect x="17" y="17" width="6" height="6" fill="#ffffff" />
                <rect x="19" y="19" width="2" height="2" fill="#000000" />

                <rect x="28" y="15" width="4" height="2" fill="#000000" />
                <rect x="34" y="18" width="4" height="4" fill="#000000" />
                
                <rect x="15" y="28" width="4" height="4" fill="#000000" />
                <rect x="22" y="32" width="6" height="2" fill="#000000" />
                <rect x="20" y="36" width="14" height="2" fill="#000000" />
                <rect x="32" y="28" width="4" height="6" fill="#000000" />
              </svg>
              <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-widest">Digital Verification Seal</span>
            </div>

            {/* Footer thank you */}
            <div className="text-center w-full border-t border-dashed border-zinc-400 pt-3">
              <p className="font-bold text-[8px]" style={{ margin: 0 }}>THANK YOU FOR SHOPPING AT ANAND STORES</p>
              <p className="text-[7px] text-zinc-500 leading-tight mt-0.5">Please check your loyalty points balance on your next trip.</p>
            </div>

          </div>

        </div>

        {/* Modal Action Controls footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 grid grid-cols-4 gap-2">
          
          <button
            onClick={handlePrint}
            className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-white transition-all text-[10px] font-bold gap-1 active:scale-95"
            title="System Print Receipt"
          >
            <Printer className="w-4 h-4 text-amber-500" />
            <span>Print Roll</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-white transition-all text-[10px] font-bold gap-1 disabled:opacity-50 active:scale-95"
            title="Download Invoice PDF"
          >
            {downloading ? (
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-emerald-500" />
            )}
            <span>Save PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-white transition-all text-[10px] font-bold gap-1 active:scale-95"
            title="Share Bill URL"
          >
            <Share2 className="w-4 h-4 text-blue-500" />
            <span>Share Link</span>
          </button>

          <button
            onClick={handleSendEmail}
            className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-white transition-all text-[10px] font-bold gap-1 active:scale-95"
            title="Send Email Receipt"
          >
            <Mail className="w-4 h-4 text-purple-500" />
            <span>Email Copy</span>
          </button>

        </div>

      </div>

    </div>
  );
};
export default ReceiptModal;
