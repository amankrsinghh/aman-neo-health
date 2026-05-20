import React from 'react'
import '../../src/assets/css/PharmacyLogin.css'
import BgImage from './../assets/img/Doctorlisting-baner.png'
import Doctorsimg from './../assets/img/Doctors-img.png'

export default function Doctorlisting() {
  return (
    <>
      <section
        className="Doctorlisting" style={{ backgroundImage: `url(${BgImage})`, }}>
        <div className="container">
          <div className="row ">
            <div className="col-md-12 ">
              <div className="Doctorlisting-contenet text-center">
                <h4>Find Doctors</h4>
                <p><a href="/"><span><i className="fas fa-home me-1"></i> </span> <i class="fas fa-angle-left me-1"></i><span> Doctor </span><i class="fas fa-angle-left me-1"></i> Doctor Grid Full Width</a></p>

              </div>
            </div>
          </div>
        </div>
      </section>
      <section className=' find-Filter'>
        <div className="container">
          <div className="row">
            {/* Sidebar Filter */}
            <div className="col-lg-3 col-md-12 col-12">
              <div className="Sidebar-Filter">
                <div className="Sidebar-Filtertext"> <h1>Filter</h1> <p>Clear All</p></div>
                <div className="Sidebar-Filter-input">
                  <div className="accordion-box accordion " id="accordionExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          Specialty
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        className="accordion-collapse collapse show"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span className='Urology'>Urology</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Psychiatry</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Cardiology</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Pediatrics</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Urology</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Neurology</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Pulmonology</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Orthopedics</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Endocrinology</span>
                          </div>
                          <div className="accordion-body-concet"> <a href="#">View More</a></div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          Availability
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Available Now</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>No Available</span>
                          </div>


                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          Treatment Type
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Dental</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Orthopedic</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Fertility</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Urology</span>
                          </div>
                          <div className="accordion-body-concet"> <a href="#">View More</a></div>

                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapsefor"
                          aria-expanded="false"
                          aria-controls="collapsefor"
                        >
                          Pricing
                        </button>
                      </h2>
                      <div
                        id="collapsefor"
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span> <i className="fas fa-angle-left">$10</i></span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>$500 – $1,000</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>$1,000 – $3,000</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>$3,000 – $5,000</span>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapsefive"
                          aria-expanded="false"
                          aria-controls="collapsefive"
                        >
                          Ratting
                        </button>
                      </h2>
                      <div
                        id="collapsefive"
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span> 1 Star</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>2 Star</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>3 Star</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>4 Star</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>5 Star</span>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapsesix"
                          aria-expanded="false"
                          aria-controls="collapsesix"
                        >
                          Languages
                        </button>
                      </h2>
                      <div
                        id="collapsesixs"
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span> English</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>French</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>Spanish</span>
                          </div>
                          <div className="accordion-body-concet">    <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" /> <span>German</span>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* Doctors List */}
            <div className="col-lg-9 col-md-12 col-12">
              <div className="Doctors-List">
                <div className="Doctors-List-input">
                  <div class=" Doctors-List-box input-group mb-3">
                    <input type="text" class="form-control" placeholder="Search Doctor" aria-label="Username" aria-describedby="basic-addon1" />
                    <span class="input-group-text" id="basic-addon1"><i className="fas fa-search"></i></span>
                  </div>

                  <div className="Doctors-List-box-select d-flex align-items-center">
                    <span>Sort By</span>
                    <select class="form-select" aria-label="Default select example">
                      <option selected>Price (Low to High)</option>
                      <option value="">One</option>

                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3">  <div class="Doctors-content-card"><div class="Doctors-content-card-img"><img alt="" src={Doctorsimg} /></div><h3>Dr. James Harris</h3><span><i class="fas fa-star me-1"></i> 5.0</span><p>Psychologists | Mercy Hospital</p><div class="d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2"><div><i class="fas fa-route me-1"></i> 2.5 km</div><div><i class="fas fa-map-marker-alt me-1"></i> Malviya Nagar, Jaipur</div></div><div class="Doctors-content-card-footer d-flex justify-content-between align-items-center"><div><p>Fees</p><h5>$ 22.00</h5></div><div><a href="#" class="">Book Appointment</a></div></div><div class="Doctors-content-card-icon"><i class="far fa-heart"></i></div></div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3">  <div class="Doctors-content-card"><div class="Doctors-content-card-img"><img alt="" src={Doctorsimg} /></div><h3>Dr. James Harris</h3><span><i class="fas fa-star me-1"></i> 5.0</span><p>Psychologists | Mercy Hospital</p><div class="d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2"><div><i class="fas fa-route me-1"></i> 2.5 km</div><div><i class="fas fa-map-marker-alt me-1"></i> Malviya Nagar, Jaipur</div></div><div class="Doctors-content-card-footer d-flex justify-content-between align-items-center"><div><p>Fees</p><h5>$ 22.00</h5></div><div><a href="#" class="">Book Appointment</a></div></div><div class="Doctors-content-card-icon"><i class="far fa-heart"></i></div></div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3">  <div class="Doctors-content-card"><div class="Doctors-content-card-img"><img alt="" src={Doctorsimg} /></div><h3>Dr. James Harris</h3><span><i class="fas fa-star me-1"></i> 5.0</span><p>Psychologists | Mercy Hospital</p><div class="d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2"><div><i class="fas fa-route me-1"></i> 2.5 km</div><div><i class="fas fa-map-marker-alt me-1"></i> Malviya Nagar, Jaipur</div></div><div class="Doctors-content-card-footer d-flex justify-content-between align-items-center"><div><p>Fees</p><h5>$ 22.00</h5></div><div><a href="#" class="">Book Appointment</a></div></div><div class="Doctors-content-card-icon"><i class="far fa-heart"></i></div></div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3">  <div class="Doctors-content-card"><div class="Doctors-content-card-img"><img alt="" src={Doctorsimg} /></div><h3>Dr. James Harris</h3><span><i class="fas fa-star me-1"></i> 5.0</span><p>Psychologists | Mercy Hospital</p><div class="d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2"><div><i class="fas fa-route me-1"></i> 2.5 km</div><div><i class="fas fa-map-marker-alt me-1"></i> Malviya Nagar, Jaipur</div></div><div class="Doctors-content-card-footer d-flex justify-content-between align-items-center"><div><p>Fees</p><h5>$ 22.00</h5></div><div><a href="#" class="">Book Appointment</a></div></div><div class="Doctors-content-card-icon"><i class="far fa-heart"></i></div></div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3">  <div class="Doctors-content-card"><div class="Doctors-content-card-img"><img alt="" src={Doctorsimg} /></div><h3>Dr. James Harris</h3><span><i class="fas fa-star me-1"></i> 5.0</span><p>Psychologists | Mercy Hospital</p><div class="d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2"><div><i class="fas fa-route me-1"></i> 2.5 km</div><div><i class="fas fa-map-marker-alt me-1"></i> Malviya Nagar, Jaipur</div></div><div class="Doctors-content-card-footer d-flex justify-content-between align-items-center"><div><p>Fees</p><h5>$ 22.00</h5></div><div><a href="#" class="">Book Appointment</a></div></div><div class="Doctors-content-card-icon"><i class="far fa-heart"></i></div></div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3">  <div class="Doctors-content-card"><div class="Doctors-content-card-img"><img alt="" src={Doctorsimg} /></div><h3>Dr. James Harris</h3><span><i class="fas fa-star me-1"></i> 5.0</span><p>Psychologists | Mercy Hospital</p><div class="d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2"><div><i class="fas fa-route me-1"></i> 2.5 km</div><div><i class="fas fa-map-marker-alt me-1"></i> Malviya Nagar, Jaipur</div></div><div class="Doctors-content-card-footer d-flex justify-content-between align-items-center"><div><p>Fees</p><h5>$ 22.00</h5></div><div><a href="#" class="">Book Appointment</a></div></div><div class="Doctors-content-card-icon"><i class="far fa-heart"></i></div></div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3">  <div class="Doctors-content-card"><div class="Doctors-content-card-img"><img alt="" src={Doctorsimg} /></div><h3>Dr. James Harris</h3><span><i class="fas fa-star me-1"></i> 5.0</span><p>Psychologists | Mercy Hospital</p><div class="d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2"><div><i class="fas fa-route me-1"></i> 2.5 km</div><div><i class="fas fa-map-marker-alt me-1"></i> Malviya Nagar, Jaipur</div></div><div class="Doctors-content-card-footer d-flex justify-content-between align-items-center"><div><p>Fees</p><h5>$ 22.00</h5></div><div><a href="#" class="">Book Appointment</a></div></div><div class="Doctors-content-card-icon"><i class="far fa-heart"></i></div></div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3">  <div class="Doctors-content-card"><div class="Doctors-content-card-img"><img alt="" src={Doctorsimg} /></div><h3>Dr. James Harris</h3><span><i class="fas fa-star me-1"></i> 5.0</span><p>Psychologists | Mercy Hospital</p><div class="d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2"><div><i class="fas fa-route me-1"></i> 2.5 km</div><div><i class="fas fa-map-marker-alt me-1"></i> Malviya Nagar, Jaipur</div></div><div class="Doctors-content-card-footer d-flex justify-content-between align-items-center"><div><p>Fees</p><h5>$ 22.00</h5></div><div><a href="#" class="">Book Appointment</a></div></div><div class="Doctors-content-card-icon"><i class="far fa-heart"></i></div></div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3">  <div class="Doctors-content-card"><div class="Doctors-content-card-img"><img alt="" src={Doctorsimg} /></div><h3>Dr. James Harris</h3><span><i class="fas fa-star me-1"></i> 5.0</span><p>Psychologists | Mercy Hospital</p><div class="d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2"><div><i class="fas fa-route me-1"></i> 2.5 km</div><div><i class="fas fa-map-marker-alt me-1"></i> Malviya Nagar, Jaipur</div></div><div class="Doctors-content-card-footer d-flex justify-content-between align-items-center"><div><p>Fees</p><h5>$ 22.00</h5></div><div><a href="#" class="">Book Appointment</a></div></div><div class="Doctors-content-card-icon"><i class="far fa-heart"></i></div></div>
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
