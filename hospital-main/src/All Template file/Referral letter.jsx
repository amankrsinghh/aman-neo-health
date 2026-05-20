import React from "react";

const S = {
  page: {
    background: "#0B0B0B",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    fontFamily: "Inter, sans-serif",
  },

  sheet: {
    width: 880,
    background: "#FFFFFF",
    color: "#1C1C1C",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "18px 24px 12px",
    borderBottom: "1px solid #DCDCDC",
  },

  title: { fontSize: 20, fontWeight: 600 },
  sub: { fontSize: 12, color: "#4A4A4A" },
  small: { fontSize: 10, color: "#868686", lineHeight: "14px" },

  badge: {
    border: "1px solid #14B8A6",
    color: "#14B8A6",
    fontSize: 10,
    padding: "2px 10px",
    borderRadius: 20,
  },

  section: {
    padding: "14px 24px",
    borderBottom: "1px solid #DCDCDC",
  },

  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    columnGap: 16,
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    columnGap: 16,
    rowGap: 6,
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: 24,
  },

  label: { fontSize: 10, color: "#868686" },
  value: { fontSize: 11, fontWeight: 500 },

  qrBox: {
    width: 72,
    height: 72,
    background: "#E6E6E6",
  },

  tableHeader: {
    fontSize: 9,
    color: "#868686",
    borderBottom: "1px solid #DCDCDC",
    paddingBottom: 6,
    marginBottom: 6,
  },

  tableGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr 1.5fr",
    gap: 12,
  },

  notesBox: {
    margin: "16px 24px",
    border: "1px solid #DCDCDC",
    borderRadius: 6,
    background: "#FAFAFA",
    overflow: "hidden",
  },

  notesHeader: {
    padding: "8px 12px",
    borderBottom: "1px solid #E5E5E5",
    fontSize: 9,
    fontWeight: 600,
    color: "#868686",
  },

  notesBody: {
    padding: "10px 14px",
    fontSize: 10,
    color: "#6B6B6B",
    lineHeight: "16px",
  },

  footerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    borderTop: "1px solid #DCDCDC",
  },

  footerCell: {
    padding: "14px 24px",
    textAlign: "center",
    borderRight: "1px solid #DCDCDC",
  },

  footerBar: {
    background: "#0EA5A4",
    color: "#fff",
    fontSize: 10,
    padding: "6px 24px",
    display: "flex",
    justifyContent: "space-between",
  },
};

const KV = ({ k, v }) => (
  <div>
    <div style={S.label}>{k}</div>
    <div style={S.value}>{v}</div>
  </div>
);

export default function ReferralLetter() {
  return (
    <div style={S.page}>
      <div style={S.sheet}>

        {/* HEADER */}
        <div style={S.header}>
          <div>
            <div style={S.title}>Referral Letter</div>
            <div style={S.sub}>Apollo General Hospital</div>
            <div style={S.small}>
              NHC-H-2022-MH-000009 · Reg. MH-HOSP-2010-00891 · NABH Accredited
            </div>
            <div style={S.small}>
              Plot 22, Healthcare Ave, Andheri West, Mumbai – 400053
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={S.badge}>NeoHealthCard Network</div>
            <div style={S.small}>Fully Automated · Ecosystem Connected</div>
            <div style={S.small}>
              hospital@apollogeneral.com · +91 98765 43210
            </div>
          </div>
        </div>

        {/* META */}
        <div style={{ ...S.section, ...S.grid4 }}>
          <KV k="REFERRAL ID" v="NHC-TRF-2026-0412-00001" />
          <KV k="REFERRAL DATE" v="12/04/2026 10:30" />
          <KV k="URGENCY" v="Emergency" />
          <KV k="STATUS" v="Issued" />
        </div>

        {/* PATIENT */}
        <div style={{ ...S.section, display: "flex" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              Vijay Kumar
            </div>

            <div style={{ ...S.grid3, marginTop: 10 }}>
              <KV k="Age / Sex" v="24 / Male" />
              <KV k="Email Address" v="V@gmail.com" />
              <KV k="Patient ID" v="NHC-P-2026-MH-000123" />

              <KV k="DOB" v="15/03/2001" />
              <KV k="Address" v="32-A, Vaishali Nagar, Jaipur" />
              <div />

              <KV k="Blood" v="B+" />
              <KV k="Contact no" v="+91 9658265898" />
              <div />
            </div>
          </div>

          <div style={{
            width: 100,
            borderLeft: "1px solid #DCDCDC",
            paddingLeft: 16,
            textAlign: "center",
          }}>
            <div style={S.qrBox}></div>
            <div style={{ ...S.small, marginTop: 6 }}>Scan to verify</div>
            <div style={{ ...S.small, color: "#14B8A6" }}>
              verify.neohealthcard.in
            </div>
          </div>
        </div>

        {/* DOCTORS */}
        <div style={{ ...S.section, ...S.grid2 }}>
          <div>
            <div style={S.small}>REFERRED FROM</div>
            <KV k="Doctor" v="Dr. Amit Mishra" />
            <KV k="Specialisation" v="General Physician" />
            <KV k="Hospital" v="Apollo General Hospital" />
            <KV k="Contact" v="+91 22 4269 6969" />
          </div>

          <div>
            <div style={S.small}>REFERRED TO</div>
            <KV k="Doctor" v="Dr. Rahul Mehta" />
            <KV k="Specialisation" v="Haematologist" />
            <KV k="Hospital" v="Lilavati Hospital" />
            <KV k="Contact" v="+91 98765 11223" />
          </div>
        </div>

        {/* TABLE */}
        <div style={S.section}>
          <div style={{ ...S.small, marginBottom: 8 }}>
            REASON FOR REFERRAL & CLINICAL DETAILS
          </div>

          <div style={S.tableHeader}>
            <div style={S.tableGrid}>
              <div>Diagnosis</div>
              <div>Reason for Referral</div>
              <div>Medication</div>
              <div>Tests Done</div>
              <div>Tests Requested</div>
            </div>
          </div>

          <div style={{ ...S.tableGrid, fontSize: 11 }}>
            <div>Acute Viral Fever · Moderate Anemia (Hb 8.5)</div>
            <div>Specialist opinion required for persistent anemia</div>
            <div>Paracetamol · Ibuprofen · ORS</div>
            <div>CBC · Blood Culture</div>
            <div>Bone Marrow Biopsy · Iron Studies</div>
          </div>
        </div>

        {/* NOTES */}
        <div style={S.notesBox}>
          <div style={S.notesHeader}>REFERRING DOCTOR’S NOTES</div>
          <div style={S.notesBody}>
            Patient has been presenting with fever and weight loss for 3 weeks.
            CBC shows Hb 8.5 g/dL indicating moderate anemia. Fever partially
            responding to treatment but not resolving completely. Referral for
            specialist evaluation recommended.
          </div>
        </div>

        {/* SIGN */}
        <div style={S.footerGrid}>
          <div style={S.footerCell}>
            <div style={{ fontSize: 11, fontWeight: 500 }}>
              Dr. Amit Mishra
            </div>
            <div style={S.small}>Referring Physician</div>
          </div>

          <div style={{ ...S.footerCell, borderRight: "none" }}>
            <div style={{ fontSize: 11, fontWeight: 500 }}>
              Apollo Hospital Admin
            </div>
            <div style={S.small}>Authorised Signatory</div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={S.footerBar}>
          <span>
            Apollo General Hospital · hospital@apollogeneral.com · +91 98765 43210
          </span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>
  );
}