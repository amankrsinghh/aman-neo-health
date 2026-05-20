import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PrescriptionDispensing = () => {
  return (
    <div style={{ background: "#f4f6f8", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: 1120, margin: "0 auto", background: "#fff", border: "1px solid #e5e7eb" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>Prescription Dispensing Record</div>
            <div style={{ fontSize: 12 }}>City Diagnostics & Lab</div>
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
            ["DISPENSING ID", "NHC-AMB-DISP-2026-0412-00001"],
            ["PRESCRIPTION REF", "NHC-RX-2026-0412-00007"],
            ["PHARMACY INVOICE", "NHC-PHARM-2026-0412-00022"],
            ["PHARMACIST", "Ravi Sharma NHC-T-PH-00321"],
            ["STATUS", "Dispensed"]
          ].map((item, i) => (
            <div key={i} style={{ padding: "10px 14px", borderRight: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 10, color: "#6b7280" }}>{item[0]}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: i === 4 ? "#0ea5a4" : "#111827" }}>
                {item[1]}
              </div>
            </div>
          ))}
        </div>

        {/* PATIENT */}
        <div style={{ display: "flex", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Vijay Kumar</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", fontSize: 12, rowGap: 6 }}>
              <div>Age / Sex: 24 / Male</div>
              <div>Email Address: V@gmail.com</div>
              <div>Patient ID: NHC-P-2026-MH-000123</div>

              <div>DOB: 15/03/2001</div>
              <div>Address: 32-A, Vashali Nagar, Jaipur</div>
              <div>Prescribed By: Dr Amit Mishra</div>

              <div>Blood: B+</div>
              <div>Contact no: +91 9658265898</div>
              <div>Pharmacy: Apollo MedPlus</div>

              <div></div>
              <div></div>
              <div>Allergy Alert: No known drug allergies</div>
            </div>
          </div>

          {/* QR */}
          <div style={{ width: 120, textAlign: "center" }}>
            <div style={{ width: 90, height: 90, border: "1px solid #d1d5db", margin: "0 auto" }} />
            <div style={{ fontSize: 10 }}>Scan to verify</div>
            <div style={{ fontSize: 10, color: "#0ea5a4" }}>verify.neohealthcard.in</div>
          </div>
        </div>

        {/* TABLE */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>MEDICINES DISPENSED</div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                {[
                  "MEDICINE",
                  "PRESCRIBED DOSE",
                  "DISPENSED QTY",
                  "BATCH NO",
                  "EXPIRY",
                  "SUBSTITUTED",
                  "PHARMACIST CHECK"
                ].map((h, i) => (
                  <th key={i} style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Paracetamol 500mg", "1 Tab BD × 5D", "10 Tabs", "B-4821", "06/2027", "No", "OK"],
                ["Ibuprofen 400mg", "1 Tab TDS × 3D", "9 Tabs", "B-3210", "03/2027", "No", "OK"],
                ["Amoxicillin 250mg", "1 Cap HS × 7D", "7 Caps", "B-1109", "12/2026", "No", "OK"],
                ["Cetirizine 10mg", "1 Tab OD × 30D", "10 Tabs", "B-5543", "09/2027", "No", "OK"]
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ border: "1px solid #e5e7eb", padding: 8 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NOTES */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
            PHARMACIST’S COUNSELLING NOTES — GIVEN TO PATIENT
          </div>
          <ol style={{ fontSize: 12, marginLeft: 16 }}>
            <li>Complete the full antibiotic course (Amoxicillin) even if feeling better.</li>
            <li>Take Iron tablet after food, avoid tea/coffee for 1 hour after.</li>
            <li>Ibuprofen should be taken before food to prevent stomach upset.</li>
            <li>All medicines checked against prescription — no contraindications found.</li>
          </ol>
        </div>

        {/* SIGNATURE */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", padding: 20, borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
          <div>
            <div>Ravi Sharma</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Pharmacist · Apollo MedPlus</div>
          </div>
          <div>
            <div>Apollo MedPlus Pharmacy</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Drug Lic: MH-PH-2018-04892</div>
          </div>
          <div>
            <div>Vijay Kumar</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Patient — Received Medicines</div>
          </div>
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

export default PrescriptionDispensing;