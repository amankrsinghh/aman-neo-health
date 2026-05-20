import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .wrap {
    background: #d1d5db;
    min-height: 100vh;
    padding: 24px;
    font-family: 'Inter', Arial, sans-serif;
    display: flex;
    justify-content: center;
  }

  .doc {
    background: #fff;
    width: 860px;
    border: 1px solid #c8ccd2;
    border-radius: 6px;
    overflow: hidden;
    font-size: 12px;
    color: #1a1a1a;
    height: fit-content;
  }

  /* ── HEADER ── */
  .hdr {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 20px 14px;
    border-bottom: 1px solid #e2e4e8;
  }
  .hdr-left { display: flex; align-items: flex-start; gap: 10px; }
  .logo-circle {
    width: 34px; height: 34px; border-radius: 50%;
    background: #1e4db7;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 2px;
  }
  .logo-circle svg { width: 18px; height: 18px; }
  .hdr-title { font-size: 19px; font-weight: 700; color: #111; line-height: 1.2; }
  .hdr-org { font-size: 12.5px; font-weight: 600; color: #222; margin-top: 2px; }
  .hdr-meta { font-size: 10.5px; color: #6b7280; margin-top: 3px; line-height: 1.65; }

  .hdr-right { text-align: right; }
  .nhc-pill {
    display: inline-flex; align-items: center; gap: 5px;
    border: 1px solid #93c5fd; border-radius: 20px;
    padding: 3px 11px 3px 8px;
    font-size: 11px; font-weight: 600; color: #1d4ed8;
    background: #eff6ff;
  }
  .nhc-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; }
  .hdr-tagline { font-size: 10.5px; color: #6b7280; margin-top: 6px; line-height: 1.6; }
  .hdr-tagline a { color: #2563eb; text-decoration: none; }

  /* ── DISPATCH META BAR ── */
  .meta-bar {
    display: flex;
    border-bottom: 1px solid #e2e4e8;
    background: #f9fafb;
    padding: 10px 20px;
    gap: 0;
  }
  .meta-cell { flex: 1; padding-right: 12px; }
  .meta-cell:last-child { padding-right: 0; flex: 0.6; }
  .ml { font-size: 9px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .mv { font-size: 12px; font-weight: 500; color: #111; }
  .mv-mono { font-size: 11.5px; font-weight: 500; color: #111; font-family: 'Courier New', monospace; }
  .status-badge {
    display: inline-block;
    color: #15803d; font-weight: 700; font-size: 12.5px;
  }

  /* ── PATIENT BLOCK ── */
  .patient-section {
    border-bottom: 1px solid #e2e4e8;
    padding: 14px 20px 14px;
    display: flex;
    gap: 0;
  }
  .patient-main { flex: 1; }
  .pt-label { font-size: 9px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .pt-name { font-size: 22px; font-weight: 700; color: #111; letter-spacing: -0.3px; margin-bottom: 10px; }
  .pt-grid {
    display: grid;
    grid-template-columns: 160px 240px 1fr;
    row-gap: 5px;
    column-gap: 0;
  }
  .pt-row { display: contents; }
  .pt-key { font-size: 11.5px; color: #374151; }
  .pt-val { font-size: 11.5px; color: #111; font-weight: 400; }
  .pt-val-mono { font-size: 11px; color: #111; font-family: 'Courier New', monospace; }
  .blood-tag {
    display: inline-block;
    font-size: 11.5px; font-weight: 600; color: #dc2626;
  }

  .patient-qr {
    width: 90px; display: flex; flex-direction: column; align-items: center;
    flex-shrink: 0; padding-top: 20px;
  }
  .qr-box {
    width: 72px; height: 72px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    background: #f9fafb;
    margin-bottom: 5px;
  }
  .qr-scan { font-size: 9.5px; color: #6b7280; text-align: center; line-height: 1.5; }
  .qr-scan a { color: #2563eb; text-decoration: none; font-size: 9px; }

  /* ── DISPATCH DETAILS ── */
  .dispatch-section {
    border-bottom: 1px solid #e2e4e8;
    padding: 12px 20px;
  }
  .ds-label { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 9px; }
  .ds-body { display: flex; gap: 0; }
  .ds-col { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .ds-row { display: flex; justify-content: space-between; align-items: center; min-height: 18px; }
  .ds-key { font-size: 11.5px; color: #374151; }
  .ds-val { font-size: 11.5px; color: #111; font-weight: 500; text-align: right; }
  .ds-val-mono { font-size: 11px; color: #111; font-weight: 500; font-family: 'Courier New', monospace; text-align: right; }
  .critical-text { font-size: 11.5px; font-weight: 700; color: #111; }
  .ds-divider { width: 1px; background: #e2e4e8; margin: 0 20px; }

  /* ── VITALS TABLE ── */
  .table-section { border-bottom: 1px solid #e2e4e8; }
  .table-title {
    font-size: 9.5px; font-weight: 700; color: #374151;
    text-transform: uppercase; letter-spacing: 0.6px;
    text-align: center;
    padding: 10px 0 0;
  }
  .vtable { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .vtable th {
    font-size: 9px; font-weight: 700; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.4px;
    padding: 6px 20px 6px;
    text-align: left;
    border-top: 1px solid #e2e4e8;
    border-bottom: 1px solid #e2e4e8;
    background: #f9fafb;
    white-space: nowrap;
  }
  .vtable td {
    font-size: 12px; color: #1f2937;
    padding: 7px 20px;
    border-bottom: 1px solid #f3f4f6;
  }
  .vtable tr:last-child td { border-bottom: none; }

  /* ── EQUIPMENT TABLE ── */
  .etable-section { border-bottom: 1px solid #e2e4e8; }
  .etable-title {
    font-size: 9.5px; font-weight: 700; color: #374151;
    text-transform: uppercase; letter-spacing: 0.6px;
    text-align: center;
    padding: 10px 0 0;
  }
  .etable { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .etable th {
    font-size: 9px; font-weight: 700; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.4px;
    padding: 6px 20px 6px;
    text-align: left;
    border-top: 1px solid #e2e4e8;
    border-bottom: 1px solid #e2e4e8;
    background: #f9fafb;
    white-space: nowrap;
  }
  .etable th.med-col { max-width: 130px; line-height: 1.3; }
  .etable td {
    font-size: 12px; color: #1f2937;
    padding: 8px 20px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
  }
  .etable tr:last-child td { border-bottom: none; }

  /* ── EMPTY SPACE (matches original) ── */
  .spacer { height: 90px; }

  /* ── NOTES ── */
  .notes-section { border-top: 1px solid #e2e4e8; padding: 12px 20px; border-bottom: 1px solid #e2e4e8; }
  .notes-label { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 10px; }
  .notes-box { border: 1px solid #e2e4e8; border-radius: 4px; padding: 12px 14px; }
  .note-item { display: flex; gap: 8px; font-size: 12px; color: #374151; line-height: 1.55; margin-bottom: 5px; }
  .note-item:last-child { margin-bottom: 0; }
  .note-n { min-width: 14px; color: #374151; }

  /* ── SIGNATURES ── */
  .sigs {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-top: 1px solid #e2e4e8;
  }
  .sig-cell {
    padding: 16px 20px;
    text-align: center;
    border-right: 1px solid #e2e4e8;
  }
  .sig-cell:last-child { border-right: none; }
  .sig-name { font-size: 13.5px; font-weight: 700; color: #111; }
  .sig-role { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .sig-id { font-size: 9.5px; color: #9ca3af; font-family: 'Courier New', monospace; margin-top: 3px; }
  .sig-nhc { font-size: 9.5px; color: #2563eb; font-family: 'Courier New', monospace; margin-top: 1px; }

  /* ── FOOTER ── */
  .footer {
    background: #1e3a5f;
    padding: 9px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-l { font-size: 10.5px; color: #93c5fd; }
  .footer-r { font-size: 10.5px; color: #93c5fd; font-style: italic; }
`;

const QR = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <rect x="2" y="2" width="18" height="18" rx="1.5" stroke="#555" strokeWidth="1.8" fill="none"/>
    <rect x="6" y="6" width="10" height="10" rx="0.5" fill="#555" fillOpacity="0.5"/>
    <rect x="36" y="2" width="18" height="18" rx="1.5" stroke="#555" strokeWidth="1.8" fill="none"/>
    <rect x="40" y="6" width="10" height="10" rx="0.5" fill="#555" fillOpacity="0.5"/>
    <rect x="2" y="36" width="18" height="18" rx="1.5" stroke="#555" strokeWidth="1.8" fill="none"/>
    <rect x="6" y="40" width="10" height="10" rx="0.5" fill="#555" fillOpacity="0.5"/>
    <rect x="24" y="2" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="30" y="2" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="24" y="8" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="24" y="14" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="30" y="14" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="36" y="24" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="42" y="24" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="48" y="24" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="2" y="24" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="8" y="24" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="14" y="24" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="20" y="24" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="24" y="24" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="30" y="24" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="36" y="30" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="42" y="30" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="24" y="30" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="30" y="30" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="24" y="36" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="36" y="36" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="42" y="36" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="48" y="36" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="24" y="42" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="30" y="42" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="48" y="42" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="24" y="48" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="36" y="48" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="42" y="48" width="4" height="4" fill="#555" fillOpacity="0.6"/>
    <rect x="48" y="48" width="4" height="4" fill="#555" fillOpacity="0.4"/>
    <rect x="30" y="36" width="4" height="4" fill="#555" fillOpacity="0.6"/>
  </svg>
);

const HeartWave = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M2 12h3l3-8 4 16 3-8h3l2-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AmbulanceDispatchSheet() {
  const vitals = [
    { time: "12:15", bp: "118/76", pulse: "88", spo: "97%", temp: "101F", gcs: "15/15", notes: "Stable at pickup" },
    { time: "12:30", bp: "116/78", pulse: "90", spo: "96%", temp: "101F", gcs: "15/15", notes: "IV fluids running" },
    { time: "3:00",  bp: "114/76", pulse: "86", spo: "90%", temp: "100F", gcs: "15/15", notes: "Handed over — stable" },
    { time: "4:30",  bp: "115/75", pulse: "83", spo: "96%", temp: "96F",  gcs: "15/15", notes: "IV fluids running" },
  ];

  const equipment = [
    { equip: "Stretcher",            status: "Used & Sanitized",   med: "Normal Saline (IV)", dose: "500ml", time: "12:20", by: "Sunil Verma" },
    { equip: "Oxygen Cylinder",      status: "Used — 2L/min",      med: "–",                 dose: "–",     time: "–",     by: "–" },
    { equip: "AED (Defibrillator)",  status: "Standby — Not Used", med: "–",                 dose: "–",     time: "–",     by: "–" },
    { equip: "IV Line",              status: "Established",         med: "Paracetamol IV",    dose: "1g",    time: "12:25", by: "Sunil Verma" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="wrap">
        <div className="doc">

          {/* ── HEADER ── */}
          <div className="hdr">
            <div className="hdr-left">
              <div className="logo-circle"><HeartWave /></div>
              <div>
                <div className="hdr-title">Ambulance Dispatch Sheet</div>
                <div className="hdr-org">Apollo Ambulance Services</div>
                <div className="hdr-meta">
                  NHC-H-2022-MH-000009 · Reg. MH-HOSP-2010-00891 · NABH Accredited<br />
                  Plot 22, Healthcare Ave, Andheri West, Mumbai — 400053
                </div>
              </div>
            </div>
            <div className="hdr-right">
              <div className="nhc-pill">
                <span className="nhc-dot" />
                NeoHealthCard Network
              </div>
              <div className="hdr-tagline">
                Fully Automated · Ecosystem Connected<br />
                <a href="mailto:hospital@apollogeneral.com">hospital@apollogeneral.com</a> · +91 98765 43210
              </div>
            </div>
          </div>

          {/* ── DISPATCH META BAR ── */}
          <div className="meta-bar">
            <div className="meta-cell">
              <div className="ml">Dispatch ID</div>
              <div className="mv-mono">NHC-AMB-DISP2026-0412-00001</div>
            </div>
            <div className="meta-cell">
              <div className="ml">Call Received</div>
              <div className="mv">12/04/2026 12:05</div>
            </div>
            <div className="meta-cell">
              <div className="ml">Ambulance No</div>
              <div className="mv">MH-01-AB-0042</div>
            </div>
            <div className="meta-cell">
              <div className="ml">Driver</div>
              <div className="mv">Ramesh Patil · DLMH-0099</div>
            </div>
            <div className="meta-cell">
              <div className="ml">Status</div>
              <div className="status-badge">Completed</div>
            </div>
          </div>

          {/* ── PATIENT BLOCK ── */}
          <div className="patient-section">
            <div className="patient-main">
              <div className="pt-label">Patient Being Transported</div>
              <div className="pt-name">Vijay Kumar</div>
              <div className="pt-grid">
                <div className="pt-key">Age / Sex</div>
                <div className="pt-val">24 / Male</div>
                <div style={{display:"flex",gap:32}}>
                  <div><span style={{fontSize:11,color:"#6b7280"}}>Email Address&nbsp;&nbsp;</span><span className="pt-val">V@gmail.com</span></div>
                  <div><span style={{fontSize:11,color:"#6b7280"}}>Patient ID&nbsp;&nbsp;</span><span className="pt-val-mono">NHC - P-2026-MH-000123</span></div>
                </div>

                <div className="pt-key">DOB</div>
                <div className="pt-val">15/03/2001</div>
                <div style={{display:"flex",gap:32}}>
                  <div><span style={{fontSize:11,color:"#6b7280"}}>Address&nbsp;&nbsp;</span><span className="pt-val">32 – A, Vashali Nagar</span></div>
                  <div><span style={{fontSize:11,color:"#6b7280"}}>Dr Name&nbsp;&nbsp;</span><span className="pt-val">Dr. Amit Mishra</span></div>
                </div>

                <div className="pt-key">Blood</div>
                <div className="pt-val"><span className="blood-tag">B+</span></div>
                <div style={{display:"flex",gap:32}}>
                  <div><span className="pt-val" style={{marginLeft:72,color:"#374151"}}>, Jaipur</span></div>
                  <div><span style={{fontSize:11,color:"#6b7280"}}>Dr ID&nbsp;&nbsp;</span><span className="pt-val-mono">NHC-D-2024-MH-007821</span></div>
                </div>

                <div className="pt-key">Contact no</div>
                <div className="pt-val">+91 9658265898</div>
                <div></div>
              </div>
            </div>
            <div className="patient-qr">
              <div className="qr-box"><QR /></div>
              <div className="qr-scan">Scan to verify<br /><a href="#">verify.neohealthcard.in</a></div>
            </div>
          </div>

          {/* ── DISPATCH DETAILS ── */}
          <div className="dispatch-section">
            <div className="ds-label">Dispatch Details</div>
            <div className="ds-body">
              <div className="ds-col">
                <div className="ds-row"><span className="ds-key">Call Type</span><span className="ds-val">Emergency Transfer</span></div>
                <div className="ds-row"><span className="ds-key">Priority: P1</span><span className="critical-text">Critical</span></div>
                <div className="ds-row"><span className="ds-key">Dispatch Time</span><span className="ds-val-mono">12/04/2026 12:10</span></div>
                <div className="ds-row"><span className="ds-key">Departure Time</span><span className="ds-val-mono">12/04/2026 12:15</span></div>
                <div className="ds-row"><span className="ds-key">Crew — Paramedic</span><span className="ds-val-mono" style={{fontSize:10.5}}>Sunil Verma · NHC-T-2024-MH-00441</span></div>
              </div>
              <div className="ds-divider" />
              <div className="ds-col">
                <div className="ds-row"><span className="ds-key">Pickup Location</span><span className="ds-val">Apollo General Hospital, Andheri West</span></div>
                <div className="ds-row"><span className="ds-key">Drop Location</span><span className="ds-val">Kokilaben Dhirubhai Ambani Hospital</span></div>
                <div className="ds-row"><span className="ds-key">Arrival Time</span><span className="ds-val-mono">12/04/2026 13:00</span></div>
                <div className="ds-row"><span className="ds-key">Total Trip Time</span><span className="ds-val">45 minutes</span></div>
                <div className="ds-row"><span className="ds-key">Distance Covered</span><span className="ds-val">12.4 km</span></div>
              </div>
            </div>
          </div>

          {/* ── VITALS TABLE ── */}
          <div className="table-section">
            <div className="table-title">Patient Condition During Transport</div>
            <table className="vtable">
              <thead>
                <tr>
                  <th>Time</th><th>BP</th><th>Pulse</th><th>SpO</th>
                  <th>Temperature</th><th>GCS Score</th><th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {vitals.map((r, i) => (
                  <tr key={i}>
                    <td>{r.time}</td><td>{r.bp}</td><td>{r.pulse}</td><td>{r.spo}</td>
                    <td>{r.temp}</td><td>{r.gcs}</td><td>{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── EQUIPMENT TABLE ── */}
          <div className="etable-section">
            <div className="etable-title">Equipment Used &amp; Handover</div>
            <table className="etable">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Status</th>
                  <th className="med-col">Medication<br/>Administered</th>
                  <th>Dose</th>
                  <th>Time</th>
                  <th>Given By</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((r, i) => (
                  <tr key={i}>
                    <td>{r.equip}</td><td>{r.status}</td><td>{r.med}</td>
                    <td>{r.dose}</td><td>{r.time}</td><td>{r.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── SPACER ── */}
          <div className="spacer" />

          {/* ── PARAMEDIC NOTES ── */}
          <div className="notes-section">
            <div className="notes-label">Paramedic Handover Notes</div>
            <div className="notes-box">
              {[
                "Patient received conscious, alert, and oriented. Active fever 101F. IV fluids administered en route.",
                "No cardiac events or respiratory distress during transport. IV line patent and running on arrival.",
                "Handed over to Dr. Prakash Mehta (NHC-D-2020-MH-000003) at Kokilaben ICU at 13:00.",
                "All equipment returned to ambulance. Vehicle sanitised post-transport.",
              ].map((n, i) => (
                <div className="note-item" key={i}>
                  <span className="note-n">{i + 1}.</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── SIGNATURES ── */}
          <div className="sigs">
            <div className="sig-cell">
              <div className="sig-name">Ramesh Patil</div>
              <div className="sig-role">Driver</div>
              <div className="sig-id">MH-01-AB-0042NHC-AMB-202MH-000012</div>
              <div className="sig-nhc">NHC-AMB-2023-MH-000012</div>
            </div>
            <div className="sig-cell">
              <div className="sig-name">Sunil Verma</div>
              <div className="sig-role">Paramedic · Crew</div>
              <div className="sig-id">&nbsp;</div>
              <div className="sig-nhc">NHC-T-2024-MH-00441</div>
            </div>
            <div className="sig-cell">
              <div className="sig-name">Dr. Prakash Mehta</div>
              <div className="sig-role">Receiving Doctor · Kokilaben</div>
              <div className="sig-id">&nbsp;</div>
              <div className="sig-nhc">NHC-D-2020-MH-000003</div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div className="footer">
            <span className="footer-l">Apollo General Hospital, Mumbai · hospital@apollogeneral.com · +91 98765 43210</span>
            <span className="footer-r">Wishing you a speedy recovery</span>
          </div>

        </div>
      </div>
    </>
  );
}
