import React from "react";
import "./../assets/css/PharmacyLogin.css";
import pendingIcon from './../assets/img/Doctorlisting.png'


export default function Doctorlistings() {
  return (
    <div className="pending-wrapper d-flex justify-content-center align-items-center">
      <div className="text-center">
        {/* Top Icon */}
        <div className="pending-icon-box mx-auto">
          <img src={pendingIcon} alt="pending" className="pending-icon" />
        </div>

        {/* Heading */}
        <h3 className="pending-title">Pending approval</h3>
        <p className="pending-subtext">
          Your consultation request has been sent to the expert.<br />
          You’ll be notified once it’s approved.
        </p>

        {/* Appointment Card */}
        <div className="pending-card mx-auto">
          <div className="row">
            <div className="col-6 label">Appointment Date</div>
            <div className="col-6 value">30 June, 2025</div>

            <div className="col-6 label">Appointment Time</div>
            <div className="col-6 value">10:00pm–11:30pm</div>

            <div className="col-6 label">Doctor</div>
            <div className="col-6 value">Dr. David Patel</div>
          </div>
        </div>

        {/* Button */}
        <div className="Latest-Blogs-content-buttion  Doctors-content-card-footer mt-4"><a href="">My Appointment</a></div>

      </div>
    </div>
  );
}
