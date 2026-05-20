// AmbulanceInvoice.jsx
// Pure React component — no external CSS framework needed.
// Uses inline <style> tag with scoped class names.
// Import and render <AmbulanceInvoice /> in your React app.

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ai-page {
    background: #e5e7eb;
    min-height: 100vh;
    padding: 28px 20px;
    font-family: 'Inter', Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  /* ── CARD ── */
  .ai-card {
    background: #ffffff;
    width: 860px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
    font-size: 12px;
    color: #111827;
  }

  /* ── HEADER ── */
  .ai-hdr {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 18px 22px 14px;
    border-bottom: 1px solid #e5e7eb;
  }
  .ai-hdr-left { display: flex; align-items: flex-start; gap: 11px; }
  .ai-logo {
    width: 36px; height: 36px; border-radius: 50%;
    background: #1d4ed8;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 2px;
  }
  .ai-title   { font-size: 20px; font-weight: 700; color: #111827; line-height: 1.15; letter-spacing: -0.2px; }
  .ai-org     { font-size: 12.5px; font-weight: 600; color: #1f2937; margin-top: 2px; }
  .ai-meta    { font-size: 10.5px; color: #6b7280; margin-top: 3px; line-height: 1.65; }
  .ai-hdr-right { text-align: right; flex-shrink: 0; }
  .ai-nhc-pill {
    display: inline-flex; align-items: center; gap: 5px;
    border: 1px solid #93c5fd; border-radius: 20px;
    padding: 3px 12px 3px 8px;
    font-size: 11px; font-weight: 600; color: #1d4ed8;
    background: #eff6ff; white-space: nowrap;
  }
  .ai-ndot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; display: inline-block; }
  .ai-tagline { font-size: 10.5px; color: #6b7280; margin-top: 7px; line-height: 1.65; }
  .ai-tagline a { color: #2563eb; text-decoration: none; }

  /* ── META BAR ── */
  .ai-meta-bar {
    display: flex;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding: 10px 22px;
  }
  .ai-mc       { flex: 1; }
  .ai-ml       { font-size: 9px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.55px; margin-bottom: 3px; }
  .ai-mv       { font-size: 12px; font-weight: 500; color: #111827; }
  .ai-mv-mono  { font-size: 11px; font-weight: 500; color: #111827; font-family: 'Courier New', monospace; }
  .ai-paid     { color: #16a34a; font-weight: 700; font-size: 12.5px; }

  /* ── PATIENT ── */
  .ai-pat-sec {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    padding: 14px 22px;
  }
  .ai-pat-main   { flex: 1; }
  .ai-pat-lbl    { font-size: 9px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.55px; margin-bottom: 6px; }
  .ai-pat-name   { font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.4px; margin-bottom: 9px; }
  .ai-pat-rows   { display: flex; flex-direction: column; gap: 4px; }
  .ai-pat-row    { display: grid; grid-template-columns: 100px 130px 100px 160px 90px 1fr; gap: 0; align-items: baseline; }
  .ai-pk         { font-size: 11.5px; color: #374151; }
  .ai-pv         { font-size: 11.5px; color: #111827; }
  .ai-pv-red     { font-size: 11.5px; color: #dc2626; font-weight: 600; }
  .ai-pv-gray    { font-size: 11.5px; color: #6b7280; }
  .ai-pv-mono    { font-size: 11px; color: #111827; font-family: 'Courier New', monospace; }
  .ai-gray-lbl   { font-size: 11px; color: #6b7280; }
  .ai-pat-qr     { width: 90px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; padding-top: 18px; }
  .ai-qr-wrap    { width: 72px; height: 72px; border: 1px solid #d1d5db; border-radius: 4px; background: #f9fafb; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; }
  .ai-qr-txt     { font-size: 9px; color: #6b7280; text-align: center; line-height: 1.5; }
  .ai-qr-txt a   { color: #2563eb; text-decoration: none; }

  /* ── TRIP DETAILS ── */
  .ai-trip-sec  { border-bottom: 1px solid #e5e7eb; padding: 12px 22px; }
  .ai-sec-lbl   { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 9px; }
  .ai-trip-body { display: flex; }
  .ai-trip-col  { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .ai-trip-row  { display: flex; justify-content: space-between; align-items: baseline; min-height: 17px; }
  .ai-tk        { font-size: 11.5px; color: #374151; flex-shrink: 0; }
  .ai-tv        { font-size: 11.5px; color: #111827; font-weight: 500; text-align: right; }
  .ai-tv-mono   { font-size: 10.5px; color: #111827; font-weight: 500; text-align: right; font-family: 'Courier New', monospace; }
  .ai-tv-sm     { font-size: 11px; color: #111827; font-weight: 500; text-align: right; }
  .ai-vdiv      { width: 1px; background: #e5e7eb; margin: 0 22px; }

  /* ── CHARGES ── */
  .ai-charges-sec   { border-bottom: 1px solid #e5e7eb; position: relative; }
  .ai-charges-title {
    font-size: 9.5px; font-weight: 700; color: #374151;
    text-transform: uppercase; letter-spacing: 0.65px;
    text-align: center; padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
  }
  .ai-wm {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-80%, -20%);
    opacity: 0.06; pointer-events: none; z-index: 0;
  }
  .ai-ctable { width: 100%; border-collapse: collapse; position: relative; z-index: 1; }
  .ai-ctable thead tr th {
    font-size: 9px; font-weight: 700; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.45px;
    padding: 6px 22px; text-align: left;
    background: #f9fafb; border-bottom: 1px solid #e5e7eb;
  }
  .ai-ctable thead tr th.ai-th-r { text-align: right; }
  .ai-ctable tbody tr td {
    font-size: 12px; color: #1f2937;
    padding: 8px 22px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
  }
  .ai-ctable tbody tr:last-child td { border-bottom: none; }
  .ai-ctable tbody tr td.ai-td-r   { text-align: right; }

  /* ── TOTALS ── */
  .ai-totals-block  { display: flex; justify-content: flex-end; padding: 10px 22px 14px; position: relative; z-index: 1; }
  .ai-totals-inner  { width: 260px; }
  .ai-tot-row       { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
  .ai-tot-lbl       { font-size: 12px; color: #374151; }
  .ai-tot-val       { font-size: 12px; color: #111827; font-weight: 500; }
  .ai-tot-divider   { height: 1px; background: #e5e7eb; margin: 6px 0; }
  .ai-tot-grand-lbl { font-size: 15px; font-weight: 600; color: #111827; }
  .ai-tot-grand-val { font-size: 17px; font-weight: 700; color: #111827; }

  /* ── SPACER ── */
  .ai-spacer { height: 140px; }

  /* ── PAYMENT ── */
  .ai-pay-row {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }
  .ai-pay-cell      { padding: 16px 22px; border-right: 1px solid #e5e7eb; }
  .ai-pay-cell:last-child { border-right: none; }
  .ai-pay-lbl       { font-size: 12.5px; font-weight: 600; color: #111827; margin-bottom: 4px; }
  .ai-pay-val       { font-size: 12px; color: #374151; }
  .ai-pay-val-mono  { font-size: 11.5px; color: #374151; font-family: 'Courier New', monospace; }

  /* ── TERMS ── */
  .ai-terms-sec { padding: 14px 22px; border-bottom: 1px solid #e5e7eb; }
  .ai-terms-box { border: 1px solid #e5e7eb; border-radius: 4px; padding: 12px 14px; }
  .ai-terms-lbl { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 9px; }
  .ai-t-item    { display: flex; gap: 8px; font-size: 12px; color: #374151; line-height: 1.55; margin-bottom: 5px; }
  .ai-t-item:last-child { margin-bottom: 0; }
  .ai-t-n       { min-width: 14px; }

  /* ── FOOTER ── */
  .ai-footer { background: #0d9488; padding: 9px 22px; display: flex; justify-content: space-between; align-items: center; }
  .ai-footer-l { font-size: 10.5px; color: #ffffff; }
  .ai-footer-r { font-size: 10.5px; color: #ffffff; font-style: italic; }
`;

/* ── SVG helpers ── */
const WaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M2 12h3l3-8 4 16 3-8h3l2-4" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const QRCode = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <rect x="2" y="2" width="17" height="17" rx="1.5" stroke="#6b7280" strokeWidth="1.6" fill="none"/>
    <rect x="6" y="6" width="9" height="9" rx="0.5" fill="#6b7280" fillOpacity="0.55"/>
    <rect x="35" y="2" width="17" height="17" rx="1.5" stroke="#6b7280" strokeWidth="1.6" fill="none"/>
    <rect x="39" y="6" width="9" height="9" rx="0.5" fill="#6b7280" fillOpacity="0.55"/>
    <rect x="2" y="35" width="17" height="17" rx="1.5" stroke="#6b7280" strokeWidth="1.6" fill="none"/>
    <rect x="6" y="39" width="9" height="9" rx="0.5" fill="#6b7280" fillOpacity="0.55"/>
    {[23,29].map(x => [2,8,14].map(y => (
      <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#6b7280" fillOpacity="0.5"/>
    )))}
    {[2,8,14,20,23,29].map((x,i) => (
      <rect key={`r-${i}`} x={x} y={23} width="4" height="4" fill="#6b7280" fillOpacity="0.5"/>
    ))}
    {[35,41,47,23,29].map((x,i) => (
      <rect key={`r2-${i}`} x={x} y={29} width="4" height="4" fill="#6b7280" fillOpacity="0.5"/>
    ))}
    {[23,35,41,47,29].map((x,i) => (
      <rect key={`r3-${i}`} x={x} y={35} width="4" height="4" fill="#6b7280" fillOpacity="0.5"/>
    ))}
    {[23,29,47].map((x,i) => (
      <rect key={`r4-${i}`} x={x} y={41} width="4" height="4" fill="#6b7280" fillOpacity="0.5"/>
    ))}
    {[23,35,41,47].map((x,i) => (
      <rect key={`r5-${i}`} x={x} y={47} width="4" height="4" fill="#6b7280" fillOpacity="0.5"/>
    ))}
  </svg>
);

const Watermark = () => (
  <svg width="260" height="260" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="48" stroke="#1d4ed8" strokeWidth="3"/>
    <rect x="42" y="20" width="16" height="60" rx="4" fill="#1d4ed8"/>
    <rect x="20" y="42" width="60" height="16" rx="4" fill="#1d4ed8"/>
  </svg>
);

/* ── DATA ── */
const ITEMS = [
  { desc: "Base Ambulance Charge — ALS", sac: "996511", rate: "Rs.1,500.00",  qty: "1 Trip",      gst: "5%",  amt: "Rs.1,575.00" },
  { desc: "Distance Charge — 12.4 km",   sac: "996511", rate: "Rs.30.00/km", qty: "12.4 km",     gst: "5%",  amt: "Rs.390.60"   },
  { desc: "Paramedic Charge",             sac: "996519", rate: "Rs.800.00",   qty: "1 Paramedic", gst: "5%",  amt: "Rs.840.00"   },
  { desc: "Oxygen Cylinder Usage",        sac: "996519", rate: "Rs.5.00/min", qty: "45 min",      gst: "12%", amt: "Rs.236.25"   },
];

const TERMS = [
  "Ambulance charges are calculated from dispatch time to patient handover.",
  "Medication and consumables used en route are billed at standard MRP.",
  "Emergency surcharge applies for calls between 10PM–6AM and on public holidays.",
  "Insurance claims must be submitted within 30 days with this invoice and dispatch sheet.",
];

/* ── COMPONENT ── */
export default function AmbulanceInvoice() {
  return (
    <>
      <style>{css}</style>
      <div className="ai-page">
        <div className="ai-card">

          {/* HEADER */}
          <div className="ai-hdr">
            <div className="ai-hdr-left">
              <div className="ai-logo"><WaveIcon /></div>
              <div>
                <div className="ai-title">Ambulance Invoice</div>
                <div className="ai-org">Apollo Ambulance Services</div>
                <div className="ai-meta">
                  NHC-H-2022-MH-000009 · Reg. MH-HOSP-2010-00891 · NABH Accredited<br />
                  Plot 22, Healthcare Ave, Andheri West, Mumbai — 400053
                </div>
              </div>
            </div>
            <div className="ai-hdr-right">
              <div className="ai-nhc-pill"><span className="ai-ndot"/>NeoHealthCard Network</div>
              <div className="ai-tagline">
                Fully Automated · Ecosystem Connected<br />
                <a href="mailto:hospital@apollogeneral.com">hospital@apollogeneral.com</a> · +91 98765 43210
              </div>
            </div>
          </div>

          {/* META BAR */}
          <div className="ai-meta-bar">
            <div className="ai-mc">
              <div className="ai-ml">Invoice ID</div>
              <div className="ai-mv-mono">NHC-AMB-2026-0412-00001</div>
            </div>
            <div className="ai-mc">
              <div className="ai-ml">Dispatch Ref</div>
              <div className="ai-mv-mono">NHC-AMB-DISP2026-0412-00001</div>
            </div>
            <div className="ai-mc" style={{flex:"0 0 110px"}}>
              <div className="ai-ml">Date</div>
              <div className="ai-mv">12/04/2026</div>
            </div>
            <div className="ai-mc" style={{flex:"0 0 130px"}}>
              <div className="ai-ml">Ambulance</div>
              <div className="ai-mv">MH-01-AB-0042</div>
            </div>
            <div className="ai-mc" style={{flex:"0 0 70px"}}>
              <div className="ai-ml">Status</div>
              <div className="ai-paid">Paid</div>
            </div>
          </div>

          {/* PATIENT */}
          <div className="ai-pat-sec">
            <div className="ai-pat-main">
              <div className="ai-pat-lbl">Patient / Billed To</div>
              <div className="ai-pat-name">Vijay Kumar</div>
              <div className="ai-pat-rows">
                <div className="ai-pat-row">
                  <span className="ai-pk">Age / Sex</span><span className="ai-pv">24 / Male</span>
                  <span className="ai-gray-lbl">Email Address</span><span className="ai-pv">V@gmail.com</span>
                  <span className="ai-gray-lbl">Patient ID</span><span className="ai-pv-mono">NHC - P-2026-MH-000123</span>
                </div>
                <div className="ai-pat-row">
                  <span className="ai-pk">DOB</span><span className="ai-pv">15/03/2001</span>
                  <span className="ai-gray-lbl">Address</span><span className="ai-pv">32 – A, Vashali Nagar</span>
                  <span className="ai-gray-lbl">Dr Name</span><span className="ai-pv">Dr. Amit Mishra</span>
                </div>
                <div className="ai-pat-row">
                  <span className="ai-pk">Blood</span><span className="ai-pv-red">B+</span>
                  <span></span><span className="ai-pv-gray">, Jaipur</span>
                  <span className="ai-gray-lbl">Dr ID</span><span className="ai-pv-mono">NHC-D-2024-MH-007821</span>
                </div>
                <div className="ai-pat-row">
                  <span className="ai-pk">Contact no</span><span className="ai-pv">+91 9658265898</span>
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>
            <div className="ai-pat-qr">
              <div className="ai-qr-wrap"><QRCode /></div>
              <div className="ai-qr-txt">Scan to verify<br /><a href="#">verify.neohealthcard.in</a></div>
            </div>
          </div>

          {/* TRIP DETAILS */}
          <div className="ai-trip-sec">
            <div className="ai-sec-lbl">Trip Details</div>
            <div className="ai-trip-body">
              <div className="ai-trip-col">
                {[
                  ["Trip Type",  "Emergency Inter-Hospital Transfer"],
                  ["Pickup",     "Apollo General Hospital, Andheri West"],
                  ["Drop",       "Kokilaben Dhirubhai Ambani, Andheri"],
                  ["Distance",   "12.4 km"],
                  ["Duration",   "45 minutes"],
                ].map(([k, v]) => (
                  <div className="ai-trip-row" key={k}>
                    <span className="ai-tk">{k}</span>
                    <span className="ai-tv">{v}</span>
                  </div>
                ))}
              </div>
              <div className="ai-vdiv"/>
              <div className="ai-trip-col">
                <div className="ai-trip-row"><span className="ai-tk">Pickup Location</span><span className="ai-tv">ALS — Advanced Life Support</span></div>
                <div className="ai-trip-row"><span className="ai-tk">Drop Location</span><span className="ai-tv">1 Driver + 1 Paramedic</span></div>
                <div className="ai-trip-row"><span className="ai-tk">Arrival Time</span><span className="ai-tv-mono">12/04/2026 12:15</span></div>
                <div className="ai-trip-row"><span className="ai-tk">Total Trip Time</span><span className="ai-tv-mono">12/04/2026 13:00</span></div>
                <div className="ai-trip-row"><span className="ai-tk">Distance Covered</span><span className="ai-tv-sm">Hospital Admin · NHC-H-2022-MH-000009</span></div>
              </div>
            </div>
          </div>

          {/* CHARGES */}
          <div className="ai-charges-sec">
            <div className="ai-charges-title">Charges Breakdown</div>
            <div className="ai-wm"><Watermark /></div>
            <table className="ai-ctable">
              <thead>
                <tr>
                  <th>Service / Description</th>
                  <th className="ai-th-r">SAC Code</th>
                  <th className="ai-th-r">Rate</th>
                  <th className="ai-th-r">Qty / Unit</th>
                  <th className="ai-th-r">GST%</th>
                  <th className="ai-th-r">Amount</th>
                </tr>
              </thead>
              <tbody>
                {ITEMS.map((r, i) => (
                  <tr key={i}>
                    <td>{r.desc}</td>
                    <td className="ai-td-r">{r.sac}</td>
                    <td className="ai-td-r">{r.rate}</td>
                    <td className="ai-td-r">{r.qty}</td>
                    <td className="ai-td-r">{r.gst}</td>
                    <td className="ai-td-r">{r.amt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ai-totals-block">
              <div className="ai-totals-inner">
                <div className="ai-tot-row"><span className="ai-tot-lbl">Sub Total</span><span className="ai-tot-val">Rs.3,713.85</span></div>
                <div className="ai-tot-row"><span className="ai-tot-lbl">GST Total</span><span className="ai-tot-val">Rs.186.15</span></div>
                <div className="ai-tot-row"><span className="ai-tot-lbl">Insurance Covered</span><span className="ai-tot-val">– Rs.1,900.00</span></div>
                <div className="ai-tot-divider"/>
                <div className="ai-tot-row">
                  <span className="ai-tot-grand-lbl">Grand Total</span>
                  <span className="ai-tot-grand-val">Rs.2,000.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* SPACER */}
          <div className="ai-spacer"/>

          {/* PAYMENT */}
          <div className="ai-pay-row">
            <div className="ai-pay-cell"><div className="ai-pay-lbl">Payment Mode</div><div className="ai-pay-val">Cash</div></div>
            <div className="ai-pay-cell"><div className="ai-pay-lbl">Transaction ID</div><div className="ai-pay-val-mono">TXN-2026041200083</div></div>
            <div className="ai-pay-cell"><div className="ai-pay-lbl">Status</div><div className="ai-pay-val">Paid</div></div>
          </div>

          {/* TERMS */}
          <div className="ai-terms-sec">
            <div className="ai-terms-box">
              <div className="ai-terms-lbl">Terms &amp; Conditions</div>
              {TERMS.map((t, i) => (
                <div className="ai-t-item" key={i}>
                  <span className="ai-t-n">{i + 1}.</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="ai-footer">
            <span className="ai-footer-l">Apollo General Hospital, Mumbai · hospital@apollogeneral.com · +91 98765 43210</span>
            <span className="ai-footer-r">Wishing you a speedy recovery</span>
          </div>

        </div>
      </div>
    </>
  );
}
