import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faCheckCircle, faCircleXmark, faEdit } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getSecureApiData } from "../../Services/api"

function DoctorProfileAcceptRequest() {

    return (
        <>

            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <div className="d-flex align-items-center justify-content-between flex-wrap ">
                        <div>
                            <h5 className="heading-grad fz-24 mb-0">Profile</h5>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <div className="approve-title">
                                <h5><span className="approve-right-check">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </span> Accept Edit Request </h5>
                            </div>

                            <a href="javascript:void(0)" className="nw-thm-btn outline" data-bs-toggle="modal" data-bs-target="#edit-Request"> <FontAwesomeIcon icon={faEdit} /> Edit now</a>
                        </div>
                    </div>
                </div>
                <div className="all-profile-data-bx">
                    <div>
                        <div className="doctor-information-card mb-4">
                            <div className="doctor-main-profile-card">
                                <div className="doctor-profile-pic">
                                    <img src="/date-time-img.png" alt="" />
                                </div>
                                <div className="doctor-content-details">
                                    <div className="doctor-info-heading">
                                        <h4>Dr. David Patel </h4>
                                        <p>DO-4001</p>
                                    </div>

                                    <div className="doctor-info-list">
                                        <div className="doctor-info-item">
                                            <h6>Mobile Number</h6>
                                            <p>+91-9876543210</p>
                                        </div>

                                        <div className="doctor-info-item">
                                            <h6>Gender</h6>
                                            <p>Male</p>
                                        </div>

                                        <div className="doctor-info-item">
                                            <h6>Email</h6>
                                            <p>davidpateleff@gmail.com</p>
                                        </div>

                                        <div className="doctor-info-item">
                                            <h6>Date of Birth</h6>
                                            <p>15/10/2001</p>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div>

                        <fieldset class="address-fieldset mb-4">
                            <legend class="float-none w-auto px-3 field-title">
                                Address & About You
                            </legend>
                            <div className="doctor-hospital-info">
                                <div className="doctor-hospital-pic mb-2" >
                                    <img src="/hospital.svg" alt="" />
                                    <h5>Mercy Hospital</h5>
                                </div>

                                <div className="doctor-info-list mb-3">
                                    <div className="doctor-info-item">
                                        <h6>Full Address</h6>
                                        <p>Rajapark , Jaipur 302028 </p>
                                    </div>

                                    <div className="doctor-info-item">
                                        <h6>Country</h6>
                                        <p>India</p>
                                    </div>

                                    <div className="doctor-info-item">
                                        <h6>State</h6>
                                        <p>Rajasthan</p>
                                    </div>

                                    <div className="doctor-info-item">
                                        <h6>City</h6>
                                        <p>Jaipur</p>
                                    </div>

                                    <div className="doctor-info-item">
                                        <h6>Pin code</h6>
                                        <p>302028</p>
                                    </div>

                                </div>

                                <div className="doctor-info-list mb-3">
                                    <div className="doctor-info-item">
                                        <h6>Specialty</h6>
                                        <p>Psychologists</p>
                                    </div>

                                    <div className="doctor-info-item">
                                        <h6>Treatment Areas</h6>
                                        <p>Cosmetic Surgery, Neurology, General Surgery</p>
                                    </div>
                                </div>

                                <div className="doctor-info-list mb-3">
                                    <div className="doctor-info-item">
                                        <h6>Fees</h6>
                                        <p>$25</p>
                                    </div>

                                    <div className="doctor-info-item">
                                        <h6>Languages</h6>
                                        <p>English</p>
                                    </div>



                                </div>

                                <div className="doctor-info-list mb-3">
                                    <div className="doctor-info-item">
                                        <h6>About</h6>
                                        <p>Dr. David Patel, a dedicated cardiologist, brings a wealth of experience to Golden Gate Cardiology Center in Golden Gate,</p>
                                    </div>
                                </div>

                            </div>
                        </fieldset>
                    </div>

                    <div>

                        <fieldset class="address-fieldset mb-4">
                            <legend class="float-none w-auto px-3 field-title">
                                Education
                            </legend>

                            <div className="doctor-hospital-info">
                                <div className="doctor-hospital-pic align-items-start">
                                    <img src="/chevron-one.svg" alt="" />
                                    <div>
                                        <h5>University of Delhi</h5>
                                        <p>MBBS</p>
                                    </div>

                                    <div className="ms-auto">
                                        <p>2014 to 2018</p>
                                    </div>

                                </div>
                            </div>
                        </fieldset>
                    </div>


                    <div>



                        <fieldset class="address-fieldset mb-4">
                            <legend class="float-none w-auto px-3 field-title">
                                Work & Experience
                            </legend>

                            <div className="doctor-hospital-info">
                                <div className="doctor-hospital-pic align-items-start">
                                    <img src="/chevron-two.svg" alt="" />
                                    <div>
                                        <h5>Mercy Hospital</h5>
                                        <p>5 Years 2 months</p>
                                    </div>

                                    <div className="ms-auto">
                                        <p><span style={{ color: "#34A853" }}><FontAwesomeIcon icon={faCheckCircle} /></span> Present</p>
                                    </div>


                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div>


                        <fieldset class="address-fieldset mb-4">
                            <legend class="float-none w-auto px-3 field-title">
                                Medical License
                            </legend>

                            <div className="doctor-hospital-info mb-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="doctor-hospital-pic align-items-start">
                                        <img src="/chevron-three.svg" alt="" />
                                        <h5>State Medical License</h5>
                                    </div>


                                </div>

                                <div className="doctor-license-upload">
                                    <div className="doctor-license-pic">
                                        <img src="/doctor-license.png" alt="" />
                                    </div>
                                </div>

                            </div>


                        </fieldset>


                    </div>


                </div>
            </div>


            {/*Payment Status Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#edit-Request" */}
            <div className="modal step-modal" id="edit-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between border-bottom p-4">
                            <div>
                                <h6 className="heading-grad mb-0 fz-24"> Prescription</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#EF0000" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body p-4">
                            <div className="row justify-content-center">
                                <div className="col-lg-12">
                                    <div className="edit-request-bx mb-3">
                                        <div className="float-left">
                                            <img src="/edit-reqest.png" alt="" />
                                            <div className="float-right">
                                                <p>The user has requested to update their profile details.This includes modifying personal information such as name, photo, contact details, and other relevant fields.</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-10">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Note</label>
                                        <textarea name="" id="" className="form-control new-control-frm" placeholder=""></textarea>

                                    </div>

                                    <div>
                                        <button className="nw-thm-btn w-100">Send Edit Request </button>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/*  Payment Status Popup End */}

        </>
    )
}

export default DoctorProfileAcceptRequest