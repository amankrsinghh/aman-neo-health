import React from "react";

export default function LabInvoice() {
  return (
    <div className="bg-[#0b0b0b] flex items-center justify-center min-h-screen p-6">
      <div className="w-[880px] bg-white rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.25)] text-[#1C1C1C] text-[12px]">

        {/* HEADER */}
        <div className="flex justify-between px-6 pt-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-[20px] font-semibold">Lab Invoice</h1>
            <p className="text-[12px] text-gray-500">City Diagnostics & Lab</p>
            <p className="text-[10px] text-gray-400 mt-1">
              NHC-H-2022-MH-000009 · NABH Accredited
            </p>
            <p className="text-[10px] text-gray-400">
              Plot 22, Healthcare Ave, Andheri West, Mumbai – 400053
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="border border-[#14b8a6] text-[#14b8a6] text-[10px] px-3 py-1 rounded-full">
              NeoHealthCard Network
            </div>
            <p className="text-[10px] text-gray-400">Fully Automated · Ecosystem Connected</p>
            <p className="text-[10px] text-gray-400">hospital@apollogeneral.com · +91 98765 43210</p>
          </div>
        </div>

        {/* META ROW */}
        <div className="grid grid-cols-5 px-6 py-4 text-[11px] gap-4 border-b border-gray-200">
          {[
            ["INVOICE ID", "NHC-AMB-DISP-2026-0412-00001"],
            ["LAB ORDER REF", "NHC-LO-2026-0412-00007"],
            ["REPORT REF", "NHC-OPD-2026-0412-00022"],
            ["DATE", "12/04/2026"],
            ["STATUS", "Paid"]
          ].map((item, i) => (
            <div key={i}>
              <p className="text-gray-400 text-[10px] tracking-wide">{item[0]}</p>
              <p className={i === 4 ? "text-[#16a34a] font-medium" : "font-medium"}>{item[1]}</p>
            </div>
          ))}
        </div>

        {/* PATIENT + QR */}
        <div className="flex px-6 py-5 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-[16px] font-semibold">Vijay Kumar</h2>

            <div className="grid grid-cols-3 gap-y-2 gap-x-6 mt-3 text-[11px]">
              <p><span className="text-gray-400">Age / Sex</span><br />24 / Male</p>
              <p><span className="text-gray-400">Email</span><br />v@gmail.com</p>
              <p><span className="text-gray-400">Patient ID</span><br />NHC-P-2026-MH-000123</p>

              <p><span className="text-gray-400">DOB</span><br />15/03/2001</p>
              <p><span className="text-gray-400">Address</span><br />32-A, Vashali Nagar, Jaipur</p>
              <p><span className="text-gray-400">Doctor</span><br />Dr Amit Mishra</p>

              <p><span className="text-gray-400">Blood</span><br />B+</p>
              <p><span className="text-gray-400">Contact</span><br />+91 9658265898</p>
              <p><span className="text-gray-400">Lab</span><br />City Diagnostics</p>
            </div>
          </div>

          <div className="w-[120px] flex flex-col items-center justify-center border-l border-gray-200">
            <div className="w-[80px] h-[80px] bg-gray-200" />
            <p className="text-[10px] text-gray-400 mt-2">Scan to verify</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="px-6 py-4">
          <table className="w-full text-[11px] border border-gray-200">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-3 py-2">TEST NAME</th>
                <th className="px-3 py-2">SAC CODE</th>
                <th className="px-3 py-2 text-right">MRP</th>
                <th className="px-3 py-2">DISCOUNT</th>
                <th className="px-3 py-2">GST%</th>
                <th className="px-3 py-2 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Complete Blood Count (CBC)", "998331", "Rs.300.00", "10%", "5%", "Rs.283.50"],
                ["Peripheral Blood Smear", "998331", "Rs.200.00", "10%", "5%", "Rs.189.00"],
                ["Serum Iron + TIBC + Ferritin", "998332", "Rs.800.00", "10%", "5%", "Rs.756.00"],
                ["Vitamin B12 + Folate", "998332", "Rs.700.00", "10%", "5%", "Rs.661.50"],
                ["LFT – Liver Function Test", "998332", "Rs.250.00", "10%", "5%", "Rs.236.25"],
                ["Blood Culture x 2 Sets", "998334", "Rs.1200.00", "10%", "5%", "Rs.1134.00"],
                ["Widal Test", "998333", "Rs.250.00", "10%", "5%", "Rs.236.25"],
                ["NS1 Antigen (Dengue)", "998333", "Rs.400.00", "10%", "5%", "Rs.378.00"]
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-3 py-2">{row[0]}</td>
                  <td className="px-3 py-2 text-center">{row[1]}</td>
                  <td className="px-3 py-2 text-right">{row[2]}</td>
                  <td className="px-3 py-2 text-center">{row[3]}</td>
                  <td className="px-3 py-2 text-center">{row[4]}</td>
                  <td className="px-3 py-2 text-right font-medium">{row[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}
        <div className="flex justify-end px-6 pb-4">
          <div className="w-[240px] text-[12px]">
            <div className="flex justify-between py-1">
              <span>Total MRP</span>
              <span>Rs.4,350.00</span>
            </div>
            <div className="flex justify-between py-1 text-gray-500">
              <span>NHC Discount (10%)</span>
              <span>-Rs.435.00</span>
            </div>
            <div className="flex justify-between py-1 text-gray-500">
              <span>GST (5%)</span>
              <span>Rs.195.75</span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t font-semibold text-[14px]">
              <span>Grand Total</span>
              <span>Rs.4,110.75</span>
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="grid grid-cols-3 border-t border-gray-200 text-[11px]">
          <div className="p-4">
            <p className="text-gray-400 text-[10px]">Payment Mode</p>
            <p className="font-medium">UPI</p>
          </div>
          <div className="p-4 border-l border-gray-200">
            <p className="text-gray-400 text-[10px]">Transaction ID</p>
            <p className="font-medium">TXN-202604120083</p>
          </div>
          <div className="p-4 border-l border-gray-200">
            <p className="text-gray-400 text-[10px]">Status</p>
            <p className="font-medium text-[#16a34a]">Paid</p>
          </div>
        </div>

        {/* TERMS */}
        <div className="px-6 py-4 text-[10px] text-gray-500">
          <p>1. Reports will be available on NeoHealthCard app as soon as processed.</p>
          <p>2. Critical values will be immediately communicated to ordering doctor.</p>
          <p>3. Sample storage: 72 hours post-reporting for repeat testing if required.</p>
          <p>4. Disputes must be raised within 7 days of report date.</p>
        </div>

        {/* FOOTER */}
        <div className="bg-[#0ea5a4] text-white text-[11px] flex justify-between px-6 py-2">
          <span>Apollo General Hospital, Mumbai · hospital@apollogeneral.com · +91 98765 43210</span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>
  );
}
