import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../src/assets/css/PharmacyLogin.css'
import BgImage from './../assets/img/Doctorlisting-baner.png'
import docer from './../assets/img/docer.png'
import DoctorDetailsimg from './../assets/img/DoctorDetails-img.png'

export default function DoctorDetails() {
  const settings = {
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <>
      <section
        className="Doctorlisting" style={{ backgroundImage: `url(${BgImage})`, }}>
        <div className="container">
          <div className="row ">
            <div className="col-md-12 ">
              <div className="Doctorlisting-contenet text-center">
                <h4>Find Doctors</h4>
                <p><a href="/"><span><i className="fas fa-home me-1"></i> </span> <i class="fas fa-angle-left me-1"></i><span> Doctor </span><i class="fas fa-angle-left me-1"></i> Doctor Details</a></p>

              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='Doctor-Detailsseaction '>
        <div className="container">
          <div className="Doctor-Detailsseaction-contant">
            <div className="Doctor-Detailsseaction-contant-img">
              <img src={docer} alt="doctor" />
            </div>
            <div className="Doctor-Detailsseaction-contant-text">
              <div className="d-flex justify-content-between  align-items-center">
                <h4>Dr. James Harris</h4>
                <div className="Doctors-content-card-icon ms-auto d-flex gap-3">
                  <i className="far fa-heart"></i>
                  <i className="fas fa-share-alt"></i>
                </div>
              </div>

              <p>
                <span>Psychologists</span> | <span>Mercy Hospital</span>
              </p>

              <p className="Language">
                Language : <span>English</span>
              </p>

              <p>
                <i className="fas fa-map-marker-alt me-1"></i>
                Malviya Nagar, Jaipur
              </p>

              <div className="contentcardicon">
                <div className=" d-flex align-items-center gap-3 mt-4">

                  <div className="Doctor-Detailsseaction-contant-text-icon">
                    <i className="fas fa-user-friends"></i>
                  </div>

                  <div>
                    <h5>2,000+</h5>
                    <p>Patients</p>
                  </div>

                </div>
                <div className=" d-flex align-items-center gap-3 mt-4">

                  <div className="Doctor-Detailsseaction-contant-text-icon">
                    <i className="fas fa-award"></i>
                  </div>

                  <div>
                    <h5>10+</h5>
                    <p>Patients</p>
                  </div>

                </div>
                <div className=" d-flex align-items-center gap-3 mt-4">

                  <div className="Doctor-Detailsseaction-contant-text-icon">
                    <i class="fas fa-star"></i>
                  </div>

                  <div>
                    <h5>5</h5>
                    <p>Rating</p>
                  </div>

                </div>
                <div className=" d-flex align-items-center gap-3 mt-4">

                  <div className="Doctor-Detailsseaction-contant-text-icon">
                    <i className="fas fa-money-bill-wave"></i>

                  </div>

                  <div>
                    <h5>$25.00</h5>
                    <p>Fees</p>
                  </div>

                </div>
              </div>
              <div className="Doctors-content-card-footer mt-4 d-flex justify-content-end
 ">
                <a href="#">Book Appointment</a>
              </div>

            </div>
          </div>
          <div className="about-me">
            <h2>About Me</h2>
            <p>“Highly motivated and experienced doctor with a passion for providing excellent care to patients. Experienced in a wide variety of medical settings, with particular expertise in diagnostics, primary care and emergency medicine. Skilled in using the latest technology to streamline patient care. Committed to delivering compassionate, personalized care to each and every patient.” </p>
            <a href="#">Read More</a>
          </div>
          <div className="Specialty">
            <h2>Specialty</h2>
            <p> Psychologists</p>
          </div>
          <div className="Specialty">
            <h2>Treatment Areas </h2>
            <div className="d-flex gap-3"> <p> Cosmetic Surgery</p> <p>Neurology</p> <p>General Surgery</p></div>
          </div>

          <div className="">
            <div className="d-flex align-items-center justify-content-between
">
              <div className="Specialty"><h2>Ratting</h2></div>
              <div className="Doctors-content-text "> <div class="d-flex gap-1"><i class="fas fa-angle-left"></i><i class="fas fa-angle-right"></i></div></div>
            </div>
            <Slider {...settings}>
              <div className="">
                <div className="EmilyAnderson-contar mb-3 mx-3">
                  <div className="EmilyAnderson">
                    <img src={DoctorDetailsimg} alt="" />
                    <div><h5>Emily Anderson</h5> <p>5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></p></div>
                  </div>
                  <p>Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.</p>

                </div>
                <div className="EmilyAnderson-contar mb-3 mx-3">
                  <div className="EmilyAnderson">
                    <img src={DoctorDetailsimg} alt="" />
                    <div><h5>Emily Anderson</h5> <p>5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></p></div>
                  </div>
                  <p>Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.</p>

                </div>
                <div className="EmilyAnderson-contar mb-3 mx-3">
                  <div className="EmilyAnderson">
                    <img src={DoctorDetailsimg} alt="" />
                    <div><h5>Emily Anderson</h5> <p>5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></p></div>
                  </div>
                  <p>Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.</p>

                </div>
              </div>
              <div className="">
                <div className="EmilyAnderson-contar mb-3 mx-3">
                  <div className="EmilyAnderson">
                    <img src={DoctorDetailsimg} alt="" />
                    <div><h5>Emily Anderson</h5> <p>5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></p></div>
                  </div>
                  <p>Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.</p>

                </div>
                <div className="EmilyAnderson-contar mb-3 mx-3">
                  <div className="EmilyAnderson">
                    <img src={DoctorDetailsimg} alt="" />
                    <div><h5>Emily Anderson</h5> <p>5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></p></div>
                  </div>
                  <p>Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.</p>

                </div>
                <div className="EmilyAnderson-contar mb-3 mx-3">
                  <div className="EmilyAnderson">
                    <img src={DoctorDetailsimg} alt="" />
                    <div><h5>Emily Anderson</h5> <p>5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></p></div>
                  </div>
                  <p>Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.</p>

                </div>
              </div>
              <div className="">
                <div className="EmilyAnderson-contar mb-3 mx-3">
                  <div className="EmilyAnderson">
                    <img src={DoctorDetailsimg} alt="" />
                    <div><h5>Emily Anderson</h5> <p>5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></p></div>
                  </div>
                  <p>Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.</p>

                </div>
                <div className="EmilyAnderson-contar mb-3 mx-3">
                  <div className="EmilyAnderson">
                    <img src={DoctorDetailsimg} alt="" />
                    <div><h5>Emily Anderson</h5> <p>5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></p></div>
                  </div>
                  <p>Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.</p>

                </div>
                <div className="EmilyAnderson-contar mb-3 mx-3">
                  <div className="EmilyAnderson">
                    <img src={DoctorDetailsimg} alt="" />
                    <div><h5>Emily Anderson</h5> <p>5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></p></div>
                  </div>
                  <p>Dr. Patel is a true professional who genuinely cares about his patients. I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.</p>

                </div>
              </div>




            </Slider>
          </div>
        </div>
      </section>

    </>
  )
}
