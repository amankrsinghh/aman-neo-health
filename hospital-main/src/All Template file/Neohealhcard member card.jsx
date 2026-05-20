import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NeoHealthCard = () => {
  return (
    <div style={{ background: "#f4f6f8", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: 1120, margin: "0 auto", background: "#fff", border: "1px solid #e5e7eb" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>NeoHealthCard Member Card</div>
            <div style={{ fontSize: 12 }}>Apollo Ambulance Services</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>
              NHC-H-2022-MH-000009 · Reg. MH-HOSP-2010-00891 · NABH Accredited
            </div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>
              Plot 22, Healthcare Ave, Andheri West, Mumbai – 400053
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ border: "1px solid #0ea5a4", padding: "4px 12px", borderRadius: 20, fontSize: 11, color: "#0ea5a4" }}>
              NeoHealthCard Network
            </div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Fully Automated · Ecosystem Connected</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>hospital@apollogeneral.com · +91 98765 43210</div>
          </div>
        </div>

        {/* META */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", borderBottom: "1px solid #e5e7eb" }}>
          {[
            ["CARD ID", "NHC-INS-PA-2026-0410-00001"],
            ["ISSUE DATE", "10/04/2026 09:30"],
            ["CARD TYPE", "Gold Member"],
            ["VALID UNTIL", "11/04/2029 (3 Years)"],
            ["STATUS", "Active"]
          ].map((item, i) => (
            <div key={i} style={{ padding: "10px 14px", borderRight: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 10, color: "#6b7280" }}>{item[0]}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: i === 4 ? "#0ea5a4" : "#111827" }}>
                {item[1]}
              </div>
            </div>
          ))}
        </div>

        {/* CENTER CARD */}
        <div style={{ padding: "20px" }}>
          <div
            style={{
              border: "2px solid #0ea5a4",
              borderRadius: 12,
              padding: "28px 20px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 600, color: "#0ea5a4" }}>
              NeoHealthCard
            </div>

            <div style={{ fontSize: 12, marginTop: 4 }}>
              Fully Automated Healthcare · Ecosystem Connected
            </div>

            <div style={{ marginTop: 16, fontSize: 12 }}>
              This is to certify that:
            </div>

            <div style={{ marginTop: 10, fontSize: 13 }}>
              MEMBER NAME: Mr. Vijay Kumar
            </div>

            <div style={{ fontSize: 12, marginTop: 6 }}>
              NHC-P ID: NHC-P-2026-MH-000123
            </div>

            <div style={{ fontSize: 12 }}>
              DOB: 15/03/2002 | Blood Group: B+
            </div>

            <div style={{ fontSize: 12 }}>
              Emergency: +91 98745 12355
            </div>

            <div style={{ marginTop: 12, fontSize: 12 }}>
              PRIMARY DOCTOR: Dr. Payal Shah (NHC-D-2024-MH-004512)
            </div>

            <div style={{ fontSize: 12 }}>
              PRIMARY HOSPITAL: Apollo General Hospital (NHC-H-2022-MH-000009)
            </div>

            <div style={{ marginTop: 12, fontSize: 12 }}>
              Card Type: GOLD | Valid: 12/04/2026 – 11/04/2029
            </div>

            <div style={{ marginTop: 10, fontSize: 11 }}>
              Scan QR Code to verify: verify.neohealthcard.in
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div style={{ padding: "0 20px 20px 20px" }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
            MEMBER BENEFITS & LINKED PROVIDERS
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                {["SERVICE", "PROVIDER", "NHC ID", "BENEFIT"].map((h, i) => (
                  <th key={i} style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[
                ["Primary Hospital", "Apollo General Hospital", "NHC-H-2022-MH-000009", "Priority admission, 15% dis"],
                ["Primary Doctor", "Dr. Payal Shah", "NHC-D-2024-MH-004512", "Priority appointment"],
                ["Pharmacy", "Apollo MedPlus", "NHC-PH-2025-MH-000340", "10% member discount"],
                ["Lab", "City Diagnostics", "NHC-L-2023-MH-000071", "20% discount"]
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ border: "1px solid #e5e7eb", padding: 8 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NOTES */}
        <div style={{ padding: "0 20px 20px 20px" }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
            HOW TO USE YOUR NEOHEALTHCARD
          </div>
          <ol style={{ fontSize: 12, marginLeft: 16 }}>
            <li>Show your NHC-P ID or scan the QR code at any NeoHealthCard network provider.</li>
            <li>All your medical records, reports, and prescriptions are accessible via the NHC app.</li>
            <li>Your card enables instant verification — no paperwork needed at linked providers.</li>
            <li>Emergency contacts and blood group are visible to any NHC doctor upon scanning.</li>
          </ol>
        </div>

        {/* FOOTER */}
        <div style={{ background: "#0ea5a4", color: "#fff", fontSize: 11, padding: "8px 14px", display: "flex", justifyContent: "space-between" }}>
          <span>Apollo General Hospital, Mumbai · hospital@apollogeneral.com · +91 98765 43210</span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>
  );
};

export default NeoHealthCard;