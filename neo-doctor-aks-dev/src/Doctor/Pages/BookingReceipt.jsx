import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { calculateAge } from "../../Services/globalFunction";
import { getApiData } from "../../Services/api";

const styles = {
    page: {
        // background: "#0B0B0B",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        fontFamily: "Inter, sans-serif",
    },
    sheet: {
        width: 880,
        background: "#fff",
        position: "relative",
        color: "#1C1C1C",
    },
    section: {
        padding: "14px 24px",
        borderBottom: "1px solid #DCDCDC",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        padding: "18px 24px 12px",
        borderBottom: "1px solid #DCDCDC",
    },
    h1: {
        fontSize: 20,
        fontWeight: 600,
        margin: 0,
        lineHeight: "22px",
    },
    sub: {
        fontSize: 12,
        color: "#4A4A4A",
        marginTop: 2,
    },
    small: {
        fontSize: 10,
        color: "#868686",
        lineHeight: "14px",
    },
    badge: {
        border: "1px solid #14b8a6",
        color: "#14b8a6",
        padding: "2px 10px",
        fontSize: 10,
        borderRadius: 20,
        display: "inline-block",
        marginBottom: 4,
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
    label: {
        fontSize: 10,
        color: "#868686",
        marginBottom: 2,
    },
    value: {
        fontSize: 11,
        fontWeight: 500,
    },
    qr: {
        width: 72,
        height: 72,
        background: "#E6E6E6",
    },
    totals: {
        width: 210,
        marginLeft: "auto",
        fontSize: 11,
        lineHeight: "18px",
    },
    footerBar: {
        background: "#0ea5a4",
        color: "#fff",
        fontSize: 10,
        padding: "6px 24px",
        display: "flex",
        justifyContent: "space-between",
    },
};

const KV = ({ k, v }) => (
    <div>
        <div style={styles.label}>{k}</div>
        <div style={styles.value}>{v}</div>
    </div>
);

export default function DoctorAptBookingReceipt({ paymentId, pdfLoading, endLoading }) {
    const { id } = useParams()
    const [ptData, setPtData] = useState()
    const [aptData, setAptData] = useState()
    async function fetchAptPayment() {
        try {
            const res = await getApiData(`api/comman/doctor-appointment-payment/${paymentId || id}`)

            if (res.success) {
                setAptData(res.data)
                setPtData(res.ptData)
            } else {
                toast.error(res.message)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchAptPayment()
    }, [paymentId])
    const invoiceRef = useRef()
    const handleDownload = () => {
        try {

            const element = invoiceRef.current;
            document.body.classList.add("hide-buttons");
            const opt = {
                margin: 0.5,
                filename: `Invoice-${aptData?.transactionId}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
            };

            html2pdf().from(element).set(opt).save().then(() => {
                document.body.classList.remove("hide-buttons");
            });
        } catch (error) {

        } finally {
            if (pdfLoading) endLoading();
            setAptData({});
        }
    };
    useEffect(() => {
        if (ptData && aptData && pdfLoading) {
            const timer = setTimeout(() => {
                handleDownload();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [ptData, aptData, pdfLoading]);
    return (
        <div style={styles.page} ref={invoiceRef}>
            <div style={styles.sheet}>

                {/* HEADER */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.h1}>Booking Receipt</h1>
                        <div style={styles.sub}>{aptData?.orgName}</div>
                        <div style={styles.small}>
                            {aptData?.orgNh12}
                        </div>
                        <div style={styles.small}>
                            {aptData?.orgAddress}
                        </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <div style={styles.badge}>NeoHealthCard Network</div>
                        <div style={styles.small}>Fully Automated · Ecosystem Connected</div>
                        <div style={styles.small}>
                            {aptData?.orgEmail} · {aptData?.orgContactNumber}
                        </div>
                    </div>
                </div>

                {/* META */}
                <div style={{ ...styles.section, ...styles.grid4 }}>
                    <KV k="BOOKING ID" v={aptData?.bookingId} />
                    <KV k="TRANSACTION ID" v={aptData?.transactionId} />
                    <KV k="APPOINTMENT" v={new Date(aptData?.appointmentDate)?.toLocaleDateString('en-GB')} />
                    <KV k="STATUS" v={aptData?.status?.charAt(0)?.toUpperCase() + aptData?.status?.slice(1)} />
                </div>

                {/* PATIENT */}
                <div style={{ ...styles.section, display: "flex" }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>
                            {ptData?.name}
                        </div>

                        <div style={{ ...styles.grid3, marginTop: 10 }}>
                            <KV k="Age / Sex" v={`${calculateAge(ptData?.dob)} / ${ptData?.gender?.charAt(0)?.toUpperCase() + ptData?.gender?.slice(1)}`} />
                            <KV k="Email Address" v={ptData?.email} />
                            <KV k="Patient ID" v={ptData?.nh12} />

                            <KV k="DOB" v={new Date(ptData?.dob)?.toLocaleDateString('en-GB')} />
                            <KV k="Address" v={ptData?.address || '-'} />
                            <div />

                            <KV k="Blood" v={ptData?.bloodGroup} />
                            <KV k="Contact no" v={ptData?.contactNumber} />
                            <div />
                        </div>
                    </div>

                    <div style={{
                        width: 100,
                        borderLeft: "1px solid #DCDCDC",
                        paddingLeft: 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                        <div style={styles.qr}>
                            <QRCodeCanvas
                                value={`https://www.neohealthcard.com/doctor-appointment-receipt/${paymentId}`}
                                size={256}
                                className="qr-code"
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            />
                        </div>
                        <div style={{ ...styles.small, marginTop: 6 }}>Scan to verify</div>
                        <div style={{ ...styles.small, color: "#14b8a6" }}>
                            verify.neohealthcard.in
                        </div>
                    </div>
                </div>

                {/* DETAILS */}
                <div style={{ ...styles.section, ...styles.grid2 }}>
                    <div>
                        <div style={styles.small}>APPOINTMENT DETAILS</div>
                        <KV k="Doctor" v={`Dr. ${aptData?.doctorName}`} />
                        <KV k="Specialisation" v={aptData?.specialization} />
                        <KV k="Slot" v={new Date(aptData?.appointmentDate)?.toLocaleString('en-GB')} />
                        {/* <KV k="Booked Via" v="NeoHealthCard App" /> */}
                    </div>

                    <div>
                        <div style={styles.small}>BOOKING INFO</div>
                        <KV k="Booked On" v={new Date(aptData?.bookedOn)?.toLocaleString('en-GB')} />
                        {/* <KV k="Reminder" v="SMS + App · 1 hr before" /> */}
                        <KV k="Fees Paid" v={`₹${aptData?.fees}`} />
                    </div>
                </div>

                {/* TOTAL */}
                <div style={styles.section}>
                    <div style={styles.totals}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={styles.small}>Consultation Fee</span>
                            <span>₹{aptData?.fees}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={styles.small}>Discount </span>
                            <span>{aptData?.discountType == "Fixed" && "₹"}{aptData?.discountValue} {aptData?.discountType == "Percentage" && "(%)"}</span>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: 600,
                            fontSize: 13,
                        }}>
                            <span>Total Paid</span>
                            <span>₹{aptData?.totalAmount}</span>
                        </div>
                    </div>
                </div>

                {/* PAYMENT */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    borderBottom: "1px solid #DCDCDC",
                }}>
                    <div style={{ padding: "12px 24px" }}>
                        <div style={styles.label}>Payment Mode</div>
                        <div style={styles.value}>{aptData?.paymentMethod}</div>
                    </div>
                    <div style={{ padding: "12px 24px", borderLeft: "1px solid #DCDCDC" }}>
                        <div style={styles.label}>Transaction ID</div>
                        <div style={styles.value}>{aptData?.transactionId}</div>
                    </div>
                    <div style={{ padding: "12px 24px", borderLeft: "1px solid #DCDCDC" }}>
                        <div style={styles.label}>Status</div>
                        <div style={styles.value} className="text-uppercase">{aptData?.paymentStatus}</div>
                    </div>
                </div>

                {/* NOTES */}
                <div style={styles.section}>
                    <div style={styles.small}>IMPORTANT NOTES</div>
                    <ol style={{ fontSize: 10, color: "#868686", marginLeft: 16 }}>
                        <li>Arrive 10 minutes before your scheduled appointment time.</li>
                        <li>Carry previous medical records and prescriptions.</li>
                        <li>Cancellation fee applies if cancelled less than 2 hours before appointment.</li>
                        <li>Appointment timings may vary slightly due to emergencies.</li>
                    </ol>
                </div>

                {/* FOOTER */}
                <div style={styles.footerBar}>
                    <span>
                        {aptData?.orgName}, Mumbai · {aptData?.orgEmail} · {aptData?.orgContactNumber}
                    </span>
                    <span>Wishing you a speedy recovery</span>
                </div>

            </div>
        </div>
    );
}