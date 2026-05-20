import { faEnvelope, faMarsAndVenus, faPen, faPhone, faUser, } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { HiCheckBadge } from "react-icons/hi2";

function ChildProfile() {
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
                                    <h5 className="heading-grad fz-24 mb-0"> Profile</h5>
                                </div>
                                <div className="all-profile-data-bx">
                                    <form action="">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="lab-profile-mega-bx text-center">
                                                    <div className="lab-profile-avatr-bx position-relative d-inline-block">
                                                        <img src="/call-pic.jpg" alt="" className="rounded-cricle" />
                                                        <div className="lab-profile-edit-avatr">
                                                            <a href="javascript:void(0)" className="edit-btn cursor-pointer">
                                                                <FontAwesomeIcon icon={faPen} />
                                                            </a>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept=""
                                                            className="lab-profile-file-input"
                                                        />
                                                    </div>
                                                    <div className="user-detail-bx my-2">
                                                        <h5 className="">Krishna Sharma</h5>
                                                        <p>ID: KRI33209490</p>
                                                    </div>
                                                </div>
                                            </div>

                                            
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label>Relation</label>
                                                    <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faMarsAndVenus} /> </span>
                                                        <select className="nw-select">
                                                            <option>--Select Gender--</option>
                                                            <option selected>Daughter</option>
                                                            <option>Son</option>
                                                            <option>Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Name</label>
                                                    <input type="text" className="form-control new-control-frm px-5" placeholder="Enter your name" value="Krishna Sharma" />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Mobile Number</label>
                                                    <input type="number" className="form-control new-control-frm verify-account-frm px-5" placeholder="Enter your number" value="9876543210" />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                                    </div>
                                                    <div className="verification-num-bx">
                                                        <span className="verify-title"> <HiCheckBadge /></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Mobile Number</label>
                                                    <input type="email" className="form-control new-control-frm px-5" placeholder="Enter your email" value="sunilkumar78sharma@gmail.com" />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faEnvelope} /> </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label>Gender</label>
                                                    <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faMarsAndVenus} /> </span>
                                                        <select className="nw-select">
                                                            <option>--Select Gender--</option>
                                                            <option >Male</option>
                                                            <option selected>Female</option>
                                                            <option>Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-end mt-3">
                                                <button className="nw-thm-btn">Save</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>





                            </div>
                        </div>

                    </div>
                </div>

            </section>
        </>
  )
}

export default ChildProfile