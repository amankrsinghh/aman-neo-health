import { faEye, faPrint } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


function PharmacyNewDetails() {
  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row mb-3">
          <div className="d-flex align-items-center justify-content-between mega-content-bx">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Pharmacy Details</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#" className="breadcrumb-link">
                        Dashboard
                      </a>
                    </li>

                    <li className="breadcrumb-item">
                      <a href="#" className="breadcrumb-link">
                        Pharmacy list
                      </a>
                    </li>
                    <li
                      className="breadcrumb-item active"
                      aria-current="page"
                    >
                      Pharmacy  Details
                    </li>
                  </ol>
                </nav>
              </div>
            </div>


          </div>
        </div>


        <div className='new-mega-card'>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="new-pharmacy-detail-card">
                <div className="admin-table-bx d-flex align-items-center justify-content-between nw-pharmacy-details">
                  <div className="">
                    <div className="admin-table-sub-details d-flex align-items-center gap-2">
                      <img src="/prescriptions.png" alt="" />
                      <div>
                        <h6 className="fs-16 fw-600 text-black">Prescriptions</h6>
                        <p className="fs-14 fw-500">25-11-03</p>
                      </div>
                    </div>

                  </div>

                  <div className="admin-table-bx">
                    <div className="">
                      <div className="admin-table-sub-details d-flex align-items-center gap-2 doctor-title ">
                        <img src="/doctor-avatr.png" alt="" />
                        <div>
                          <h6>Dr. David Patel </h6>
                          <p className="fs-14 fw-500">DO-4001</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="d-flex align-items gap-2">
                    <div>
                      <span className="approved rounded-5 py-1">Active</span>
                    </div>

                    <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faPrint} /></button>
                    <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                  </div>



                </div>

                <div className="mt-3">
                  <div className="barcd-scannr barcde-scnnr-card ms-0">
                    <div className="barcd-content">
                      <h4>SP-9879</h4>
                      <img src="/barcode.png" alt="" />
                    </div>

                    <div className="barcode-id-details">
                      <div>
                        <h6>Patient Id </h6>
                        <p>PS-9001</p>
                      </div>


                      <div>
                        <h6>Appointment ID </h6>
                        <p>OID-8876</p>
                      </div>
                    </div>

                  </div>


                </div>

              </div>


            </div>


            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="new-pharmacy-detail-card">
                <div className="admin-table-bx d-flex align-items-center justify-content-between nw-pharmacy-details">
                  <div className="">
                    <div className="admin-table-sub-details d-flex align-items-center gap-2">
                      <img src="/prescriptions.png" alt="" />
                      <div>
                        <h6 className="fs-16 fw-600 text-black">Prescriptions</h6>
                        <p className="fs-14 fw-500">25-11-03</p>
                      </div>
                    </div>

                  </div>

                  <div className="admin-table-bx">
                    <div className="">
                      <div className="admin-table-sub-details d-flex align-items-center gap-2 doctor-title ">
                        <img src="/doctor-avatr.png" alt="" />
                        <div>
                          <h6>Dr. David Patel </h6>
                          <p className="fs-14 fw-500">DO-4001</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="d-flex align-items gap-2">
                    <div>
                      <span className="approved rounded-5 py-1">Active</span>
                    </div>

                    <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faPrint} /></button>
                    <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                  </div>



                </div>

                <div className="mt-3">
                  <div className="barcd-scannr barcde-scnnr-card ms-0">
                    <div className="barcd-content">
                      <h4>SP-9879</h4>
                      <img src="/barcode.png" alt="" />
                    </div>

                    <div className="barcode-id-details">
                      <div>
                        <h6>Patient Id </h6>
                        <p>PS-9001</p>
                      </div>


                      <div>
                        <h6>Appointment ID </h6>
                        <p>OID-8876</p>
                      </div>
                    </div>

                  </div>


                </div>

              </div>


            </div>

            




          </div>

        </div>
      </div>
    </>
  )
}

export default PharmacyNewDetails