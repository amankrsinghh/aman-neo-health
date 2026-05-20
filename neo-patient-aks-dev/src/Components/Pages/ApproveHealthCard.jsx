import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import {  faDroplet, faEdit, faEye, faMarsAndVenus, faPerson, faRulerVertical, faWeightScale } from "@fortawesome/free-solid-svg-icons"

function ApproveHealthCard() {
  return (
     <>
            <section className="new-profile-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3  col-sm-12 mb-3">
                            <ProfileSidebar />
                        </div>

                        <div className="col-lg-9 col-sm-12">
                            <div className="profile-right-card">
                                <div className="profile-tp-header">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                        <div>
                                            <h5 className="heading-grad fz-24 mb-0">  My NeoHealthCard  Details</h5>
                                        </div>
                                        <div className="d-flex gap-3 flex-wrap align-items-center">
                                             <div className="approve-title">
                                                        <h5><span className="approve-right-check">
                                                            {/* <FontAwesomeIcon icon={faCheck} /> */}
                                                        </span> Edit Request Approved </h5>
                                                    </div>

                                            <button className="nw-thm-btn outline"> <FontAwesomeIcon icon={faEdit}/> Edit</button>
                                            <button className="nw-thm-btn">Edit Request</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="all-profile-data-bx">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="user-background">
                                                <div className="user-bg-color"></div>
                                                <div className="nw-usr-profiles-card ">
                                                    <div className="main-user-picture">
                                                        <img src="/call-pic.jpg" alt="" />
                                                    </div>
                                                    <div className="user-detail-bx">
                                                        <h5>Sunil Kumar Sharma</h5>
                                                        <p>ID: SUNIL33209490</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="new-item-list p-0">
                                                <fieldset class="address-fieldset mb-4">
                                                    <legend class="float-none w-auto px-3 field-title">
                                                        Personal  Info
                                                    </legend>

                                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                        <ul className="patient-bio-list">
                                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faPerson} /> Age :<span className="patient-bio-title"> 18</span> </li>
                                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faMarsAndVenus} /> Gender :<span className="patient-bio-title"> Male</span> </li>
                                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faRulerVertical} /> Height :<span className="patient-bio-title"> 6 fit </span> </li>
                                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faWeightScale} /> Weight :<span className="patient-bio-title"> 50 Kg</span> </li>
                                                            <li className="patient-bio-item"><FontAwesomeIcon icon={faDroplet} /> Blood Group :<span className="patient-bio-title"> B+</span> </li>
                                                        </ul>
                                                        <div>

                                                        </div>
                                                    </div>
                                                    
                                                </fieldset>

                                                <fieldset class="address-fieldset mb-4">
                                                    <legend class="float-none w-auto px-3 field-title">
                                                        Medical History
                                                    </legend>

                                                    <div className="medical-history-content">
                                                        <div>
                                                            <h4 className="fz-16 fw-700">Do you have any chronic conditions?</h4>
                                                            <h5 className="hearth-disese">Heart Disease</h5>
                                                        </div>

                                                        <div className="mt-3">
                                                            <h4 className="fz-16 fw-700">Are you currently on any medications?</h4>
                                                            <h5 className="hearth-disese">Yes</h5>
                                                        </div>

                                                    </div>

                                                    <div className="medical-history-content my-3">
                                                        <div>
                                                            <h4 className="fz-16 fw-700">Medication Details</h4>
                                                            <p>ACE Inhibitors (Twice daily)</p>
                                                            <p>Beta Blockers  (Once daily)</p>
                                                        </div>

                                                        <div className="mt-3">
                                                            <h4 className="fz-16 fw-700">Allergies</h4>
                                                            <p>Penicillin</p>
                                                            <p>Peanuts</p>
                                                        </div>

                                                    </div>

                                                </fieldset>

                                                <fieldset class="address-fieldset mb-4">
                                                    <legend class="float-none w-auto px-3 field-title">
                                                        Family Medical History
                                                    </legend>

                                                    <div className="medical-history-content ">
                                                        <div>
                                                            <h4 className="fz-16 fw-700">Any family history of chronic disease?</h4>
                                                            <h5 className="hearth-disese">Yes</h5>

                                                        </div>

                                                        <div className="mt-3">
                                                            <h4 className="fz-16 fw-700">Chronic Diseases in Family</h4>
                                                            <p> Father: Hypertension, Type 2 Diabetes</p>
                                                            <p>Mother: Osteoarthritis</p>
                                                            <p>Maternal Grandfather: Heart Disease</p>
                                                            <p>Paternal Grandmother: Stroke</p>
                                                        </div>

                                                    </div>

                                                </fieldset>

                                                <fieldset class="address-fieldset mb-4">
                                                    <legend class="float-none w-auto px-3 field-title">
                                                        Prescriptions and Reports
                                                    </legend>
                                                    <div className="row">
                                                        <div className="col-lg-6 col-sm-12 mb-3">
                                                            <div className="prescription-patients-card">
                                                                <div className="prescription-patients-picture">
                                                                    <img src="/patient-card-one.png" alt="" />
                                                                </div>
                                                                <div className="card-details-bx">
                                                                    <div className="card-info-title">
                                                                        <h3>CBC Report 8/21/2025</h3>
                                                                        <p>8/21/2025</p>
                                                                    </div>

                                                                    <div className="">
                                                                        <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-sm-12 mb-3">
                                                            <div className="prescription-patients-card">
                                                                <div className="prescription-patients-picture">

                                                                    <img src="/patient-card-two.png" alt="" />
                                                                </div>
                                                                <div className="card-details-bx">
                                                                    <div className="card-info-title">
                                                                        <h3>Prescriptions 8/21/2025</h3>
                                                                        <p>8/21/2025</p>
                                                                    </div>

                                                                    <div className="">
                                                                        <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>
        </>
  )
}

export default ApproveHealthCard