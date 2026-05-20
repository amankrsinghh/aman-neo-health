import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { faDownload, faShareNodes, faUserPlus, } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import { fetchPatientDetail } from "../../Redux/features/patient"
import { useEffect, useRef, useState } from "react"
import html2canvas from "html2canvas"
import { QRCodeCanvas } from "qrcode.react";
import { client_url } from "../../baseUrl"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"


function ShareHealthCard() {
    const dispatch = useDispatch()
    const cardRef = useRef()
    const userId = localStorage.getItem('userId')
    const { profiles, user, medicalHistory, demographic, labAppointment, kyc, prescription, isRequest, customId } = useSelector(state => state.patient)

    useEffect(() => {
        dispatch(fetchPatientDetail())
    }, [dispatch])
    // const navigat
    const handleCardDownload = (e) => {
        e.preventDefault()
        if (cardRef.current) {
            html2canvas(cardRef.current, {
                useCORS: true,
                allowTaint: true,
                logging: false,
                scale: 2, // better quality
            }).then((canvas) => {
                const link = document.createElement("a");
                link.download = `${profiles?.name || "patient-card"}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        }
    };
    const handleCopy = () => {
        const text = client_url;
        if (navigator.clipboard && window.isSecureContext) {
            // Modern clipboard API
            navigator.clipboard
                .writeText(text)
                .then(() => toast.success("Copied to clipboard!"))
                .catch(() => toast.error("Copy failed"));
        } else {
            // Fallback for HTTP / older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
                toast.success("Copied to clipboard!");
            } catch (err) {
                toast.error("Copy failed");
            }
            document.body.removeChild(textArea);
        }

    };
    return (
        <>

            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div>
                            <h5 className="heading-grad fz-24 mb-0">Share NeoHealthCard</h5>
                        </div>
                        <div className="d-flex gap-3 flex-wrap align-items-center">

                            <button className="nw-meeting-thm-btn" onClick={handleCardDownload}> <FontAwesomeIcon icon={faDownload} /> Download</button>
                            <button className="nw-filtr-thm-btn" onClick={handleCopy}> <FontAwesomeIcon icon={faShareNodes} /> Share</button>
                        </div>
                    </div>
                </div>
                <div className="all-profile-data-bx">
                    <div className="d-flex gap-3">
                        <div className=" mb-3">
                            <div className="neo-health-id-card">
                                <div className="neo-health-card-header text-center my-3">
                                    <h4>Your NeoHealth<span className="neo-card-title">Card</span></h4>
                                    <p>Your Health, One Secure ID</p>
                                </div>
                                {/* <div className="neo-health-id-pic-bx">
                                                    <img src="/id-card.png" alt="" />
                                                </div> */}
                                <div className="add-patients-clients premium-crd-details" ref={cardRef}>
                                    {/* <div className="chip-card"></div> */}
                                    <div className="nw-chip-card">
                                        {/* <FontAwesomeIcon icon={faUserPlus} color="#fff" className="fz-40"/> */}
                                    </div>
                                    <img src="/NeoCard.png" alt="" loading="lazy" />
                                    <div className="patient-card-details nw-patient-details">
                                        <h4>{profiles?.name?.length > 18 ? profiles?.name?.slice(0, 15) + '...' :
                                            profiles?.name}</h4>
                                        {/* <p>Patient ID</p> */}
                                        <h6>{user?.nh12}</h6>
                                    </div>
                                    {/* <div className="qr-code-generate"></div> */}
                                    <QRCodeCanvas
                                        value={`https://neohealthcard.com/user/${user?.nh12}`}
                                        size={256}
                                        className="qr-code"
                                        bgColor="transparent"
                                        fgColor="#ffffff"
                                        style={{ height: "auto", maxWidth: "100%", width: "20%" }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="benefit-content-bx">
                                <h4 className="text-black fz-20 fw-600">NeoHealthCard Benefits</h4>
                                <div className="benefit-details-bx mb-3">
                                    <h5>One Health ID</h5>
                                    <p>All records (prescriptions, lab reports, insurance) <br /> stored securely in a single place</p>
                                </div>
                                <div className="benefit-details-bx mb-3">
                                    <h5>Easy Access Anywhere</h5>
                                    <p>QR-enabled health card lets patients share data instantly with doctors, labs, or hospitals.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-end mt-4">
                <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
            </div>


        </>
    )
}

export default ShareHealthCard