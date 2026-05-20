import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { getApiData } from "../Service/api";
import { Link, NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import base_url from "../baseUrl";
import { calculateAge } from "../Service/globalFunction";


const S = {
  page: {
    background: "#f4f6f7",
    // minHeight: "100vh",
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
  logo: {
    width: 34,
    height: 34,
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
  },

  tableRow: {
    fontSize: 11,
    paddingTop: 10,
  },

  footerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
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

export default function PatientTransferLetter() {
  const { id } = useParams()
  const pdfRef = useRef();
  const { hospitalBasic } = useSelector(state => state.user)
  const [transferData, setTransferData] = useState()
  const [organization, setOrganization] = useState()
  const [patientData, setPatientData] = useState()
  async function fetchTransferData(params) {
    try {
      const res = await getApiData(`api/hospital/transfer-data/${id}`)
      if (res.success) {
        setTransferData(res.data)
        setOrganization(res.organization)
        setPatientData(res.patientData)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    fetchTransferData()
  }, [id])
  const handleDownload = () => {
    const element = pdfRef.current;

    const opt = {
      margin: 0,
      filename: `Patient-Transfer-${transferData?.fromHospital?.nh12}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2, // better quality
        useCORS: true
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait"
      }
    };

    html2pdf().set(opt).from(element).save();
  };
  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row ">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Patient Transfer Letter</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <NavLink to="/dashboard" className="breadcrumb-link">
                        Dashboard
                      </NavLink>
                    </li>
                    <li
                      className="breadcrumb-item active"
                      aria-current="page"
                    >
                      Transfer
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="">
              <button className="add-nw-btn nw-thm-btn" onClick={handleDownload}>Download</button>
            </div>
          </div>
        </div>
        <div style={S.page} ref={pdfRef}>
          <div style={S.sheet}>

            {/* HEADER */}
            <div style={S.header}>
              <div className="d-flex gap-3">
                <div style={S.logo}>
                  <img src={organization?.logoFileId ?
                    `${base_url}/api/file/${organization?.logoFileId}` : "/logo.png"} alt="" />
                </div>
                <div>
                  <div style={S.title}>Patient Transfer Letter</div>
                  <div style={S.sub}>{organization?.name}</div>
                  <div style={S.small}>
                    {/* {organization?.nh12} · Reg. MH-HOSP-2010-00891 · NABH Accredited */}
                    {organization?.nh12}

                  </div>
                  <div style={S.small}>
                    {organization?.address}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={S.badge}>NeoHealthCard Network</div>
                <div style={S.small}>Fully Automated · Ecosystem Connected</div>
                <div style={S.small}>
                  {organization?.email} · {organization?.contactNumber}
                </div>
              </div>
            </div>

            {/* META */}
            <div style={{ ...S.section, ...S.grid4 }}>
              <KV k="TRANSFER ID" v="NHC-TRF-2026-0412-00001" />
              <KV k="REF: DISCHARGE ID" v="NHC-DS-2026-0412-00001" />
              <KV k="TRANSFER DATE" v="12/04/2026 10:30" />
              <KV k="STATUS" v={transferData?.status} />
            </div>

            {/* PATIENT */}
            <div style={{ ...S.section, display: "flex" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {transferData?.patientId?.name}
                </div>

                <div style={{ ...S.grid3, marginTop: 10 }}>
                  <KV k="Age / Sex" v={`${calculateAge(patientData?.dob, transferData?.createdAt)} / ${patientData?.gender}`} />
                  <KV k="Email Address" v={transferData?.patientId?.email} />
                  <KV k="Patient ID" v={transferData?.patientId?.nh12} />

                  <KV k="DOB" v={new Date(patientData?.dob)?.toLocaleDateString('en-GB')} />
                  <KV k="Address" v={patientData?.fullAddress || '-'} />
                  <div />

                  <KV k="Blood" v="B+" />
                  <KV k="Contact no" v={transferData?.patientId?.contactNumber} />
                  <div />
                </div>
              </div>

              <div style={{
                width: 100,
                borderLeft: "1px solid #DCDCDC",
                paddingLeft: 16,
                textAlign: "center",
              }}>
                <div style={S.qrBox}>
                  <QRCodeCanvas
                    value={`https://www.neohealthcard.com/transfer-certificate/${transferData?._id}`}
                    size={256}
                    className="qr-code"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                <div style={{ ...S.small, marginTop: 6 }}>Scan to verify</div>
                <div style={{ ...S.small, color: "#14B8A6" }}>
                  verify.neohealthcard.in
                </div>
              </div>
            </div>

            {/* FROM / TO */}
            <div style={{ ...S.section, ...S.grid2 }}>
              <div>
                <div style={S.small}>TRANSFERRING FROM</div>
                <KV k="Hospital" v={organization?.name} />
                <KV k="Dept / Ward" v={transferData?.departmentTo?.departmentName} />
                <KV k="Doctor" v={transferData?.sendingDoctor?.name} />
                <KV k="Transfer Time" v="12/04/2026 13:00" />
              </div>

              <div>
                <div style={S.small}>TRANSFERRING TO</div>
                <KV k="Hospital" v={transferData?.toHospital?.name} />
                <KV k="Department" v={transferData?.departmentTo?.departmentName} />
                <KV k="Doctor" v={transferData?.receivingDoctor?.name} />
                <KV k="Contact" v={transferData?.toHospital?.contactNumber} />
              </div>
            </div>

            {/* TABLE */}
            <div style={S.section}>
              <div style={{ ...S.small, marginBottom: 8 }}>
                REASON FOR TRANSFER & CLINICAL SUMMARY
              </div>

              <div style={S.tableHeader}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr 2fr 2fr",
                  gap: 12,
                }}>
                  <div>Diagnosis</div>
                  <div>Transfer Reason</div>
                  <div>Condition</div>
                  <div>Treatment Given</div>
                  <div>Documents Sent</div>
                </div>
              </div>

              <div style={S.tableRow}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr 2fr 2fr",
                  gap: 12,
                }}>
                  <div>{transferData?.reasonForTransfer?.diagnosis}</div>
                  <div>{transferData?.reasonForTransfer?.reason}</div>
                  <div>{transferData?.reasonForTransfer?.conditionAtTransfer}</div>
                  <div>{transferData?.reasonForTransfer?.treatmentGiven}</div>
                  <div>{transferData?.documentShared?.dischargeSummary && 'Discharge Summary'} {transferData?.documentShared?.prescriptions && "· Prescriptions"} {transferData?.documentShared?.labReports?.length > 0 && "· Lab Reports"} </div>
                </div>
              </div>
            </div>

            {/* SIGNATURES */}
            <div style={S.footerGrid}>
              <div style={S.footerCell}>
                <div style={{ fontSize: 11, fontWeight: 500 }}>
                  {transferData?.sendingDoctor?.name}
                </div>
                <div style={S.small}>Transferring Physician</div>
              </div>

              <div style={S.footerCell}>
                <div style={{ fontSize: 11, fontWeight: 500 }}>
                  {organization?.name}
                </div>
                <div style={S.small}>Authorised Signatory</div>
              </div>

              <div style={{ ...S.footerCell, borderRight: "none" }}>
                <div style={{ fontSize: 11, fontWeight: 500 }}>
                  Suresh Kumar
                </div>
                <div style={S.small}>Patient's Guardian</div>
              </div>
            </div>

            {/* FOOTER */}
            <div style={S.footerBar}>
              <span>
                {organization?.name} · {organization?.email} · {organization?.contactNumber}
              </span>
              <span>Wishing you a speedy recovery</span>
            </div>

          </div>
        </div>
        <div className="text-end">
          <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
        </div>
      </div>
    </>
  );
}