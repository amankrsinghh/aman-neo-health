
function DoctorListing() {
  return (
    <>

      <section className="pending-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-6 col-sm-12">

              <div className="pending-icon-box mx-auto">
                <img src="/approve-img.gif" alt="pending" className="pending-icon" />
              </div>

              <div className="text-center my-3">
                <h3 className="title">Pending approval</h3>
                <p className="new_para">
                  Your consultation request has been sent to the expert.<br />
                  You’ll be notified once it’s approved.
                </p>
              </div>

              <div className="pending-card ">
                <ul className="pending-list">
                  <li className="pending-item">Appointment Date <span className="pending-title">30 June, 2025</span></li>
                  <li className="pending-item"> Appointment Time  <span className="pending-title">10:00pm-11:30pm</span></li>
                  <li className="pending-item">Doctor <span className="pending-title">Dr. David Patel </span></li>
                </ul>
              </div>

              <div className=" mt-4 text-center">
                <a href="javascript:void(0)" className="nw-thm-btn">My Appointment</a>
              </div>

            </div>
          </div>
        </div>

      </section>
    </>




  )
}

export default DoctorListing