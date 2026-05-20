import React from 'react'
import { motion } from "framer-motion";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banerimg from './../assets/img/baner-img.png'
import bannerImg from './../assets/img/baner.png'
import banerimg1 from './../assets/img/baner-img1.png'
import banerimg2 from './../assets/img/baner-img2.png'
import Categoriesimg from './../assets/img/Categories-img.png'
import Categoriesimg1 from './../assets/img/Categories-img1.png'
import Categoriesimg2 from './../assets/img/Categories-img2.png'
import Categoriesimg3 from './../assets/img/Categories-img3.png'
import Doctorsimg from './../assets/img/Doctors-img.png'
import LabTestCategories from './../assets/img/LabTestCategories.png'
import LabTestCategories1 from './../assets/img/LabTestCategories1.png'
import LabTestCategories2 from './../assets/img/LabTestCategories2.png'
import LabTestCategories3 from './../assets/img/LabTestCategories3.png'
import LabTestCategories4 from './../assets/img/LabTestCategories4.png'
import LabTestCategories5 from './../assets/img/LabTestCategories5.png'
import LabTestCategories6 from './../assets/img/LabTestCategories6.png'
import LabTestCategories7 from './../assets/img/LabTestCategories7.png'
import LabTestCategories8 from './../assets/img/LabTestCategories8.png'
import LabTestCategories9 from './../assets/img/LabTestCategories9.png'
import Hospitals from './../assets/img/Hospitals.png'
import HowitWorksimg from './../assets/img/HowitWorks-img.png'
import icon from './../assets/img/icon.png'
import icon1 from './../assets/img/icon1.png'
import icon2 from './../assets/img/icon2.png'
import icon3 from './../assets/img/icon3.png'
import LatestBlogsimg from './../assets/img/LatestBlogs-img.png'
import Downloadimg from './../assets/img/Download-img.png'
import googleplayicon1 from './../assets/img/google-play-icon1.png'
import googleplayicon from './../assets/img/google-play-icon.png'
import Testimonialsimg from './../assets/img/Testimonials-img.png'

export default function Home() {
  const settings = {
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 10,
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
  const Doctorscard = {
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 }
      }
    ]
  };


  const doctors = [
    {
      name: "Dr. James Harris",
      rating: "5.0",
      distance: "2.5 km",
      location: "Malviya Nagar, Jaipur",
      fees: "$ 22.00",
      img: Doctorsimg
    },
    {
      name: "Dr. Sarah Wilson",
      rating: "4.8",
      distance: "3.1 km",
      location: "Mansarovar, Jaipur",
      fees: "$ 25.00",
      img: Doctorsimg
    },
    {
      name: "Dr. Kevin Adams",
      rating: "4.9",
      distance: "1.8 km",
      location: "Vaishali Nagar, Jaipur",
      fees: "$ 20.00",
      img: Doctorsimg
    },
    {
      name: "Dr. Kevin Adams",
      rating: "4.9",
      distance: "1.8 km",
      location: "Vaishali Nagar, Jaipur",
      fees: "$ 20.00",
      img: Doctorsimg
    },
  ];


  const hospitalssilder = {
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2200,
    arrows: true,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ]
  };
  const hospitals = [
    {
      name: "Sunrise Health Clinic",
      address: "123 Oak Street, Jaipur",
      rating: "5.0",
      distance: "2.5 km",
      img: Hospitals
    },
    {
      name: "City Hospital",
      address: "Near MI Road, Jaipur",
      rating: "4.8",
      distance: "3.2 km",
      img: Hospitals
    },
    {
      name: "Life Line Medicare",
      address: "Tonk Road, Jaipur",
      rating: "4.9",
      distance: "1.6 km",
      img: Hospitals
    },
    {
      name: "Life Line Medicare",
      address: "Tonk Road, Jaipur",
      rating: "4.9",
      distance: "1.6 km",
      img: Hospitals
    }
  ];

  const LatestBlogs = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2200,
    arrows: true,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ]
  };
  const blogData = [
    {
      title: "Navigating Telehealth: A Guide to Virtual Healthcare Visits",
      user: "Admin",
      date: "13 Aug, 2023",
      text: "Explore the benefits & challenges of virtual healthcare appointments, along with tips for making good health.",
      img: LatestBlogsimg
    },
    {
      title: "Navigating Telehealth: A Guide to Virtual Healthcare Visits",
      user: "Admin",
      date: "15 Oct, 2023",
      text: "Explore the benefits & challenges of virtual healthcare appointments, along with tips for making good health.",
      img: LatestBlogsimg
    },
    {
      title: "Navigating Telehealth: A Guide to Virtual Healthcare Visits",
      user: "Admin",
      date: "20 Sep, 2023",
      text: "Explore the benefits & challenges of virtual healthcare appointments, along with tips for making good health.",
      img: LatestBlogsimg
    },
    {
      title: "Navigating Telehealth: A Guide to Virtual Healthcare Visits",
      user: "Admin",
      date: "11 Nov, 2023",
      text: "Explore the benefits & challenges of virtual healthcare appointments, along with tips for making good health.",
      img: LatestBlogsimg
    }
  ];
  const testimonials = [
    {
      text: "Doccure exceeded my expectations in healthcare. The seamless booking process, coupled with the expertise of the doctors, made my experience exceptional. Their commitment to quality care and convenience truly sets them apart. I highly recommend Doccure for anyone seeking reliable and accessible healthcare services.",
      name: "John Doe",
      rating: 5,
      img: Testimonialsimg
    },
    {
      text: "Doccure exceeded my expectations in healthcare. The seamless booking process, coupled with the expertise of the doctors, made my experience exceptional. Their commitment to quality care and convenience truly sets them apart. I highly recommend Doccure for anyone seeking reliable and accessible healthcare services.",
      name: "David Smith",
      rating: 5,
      img: Testimonialsimg
    },
    {
      text: "Doccure exceeded my expectations in healthcare. The seamless booking process, coupled with the expertise of the doctors, made my experience exceptional. Their commitment to quality care and convenience truly sets them apart. I highly recommend Doccure for anyone seeking reliable and accessible healthcare services.",
      name: "Sophia Williams",
      rating: 5,
      img: Testimonialsimg
    },
    {
      text: "Doccure exceeded my expectations in healthcare. The seamless booking process, coupled with the expertise of the doctors, made my experience exceptional. Their commitment to quality care and convenience truly sets them apart. I highly recommend Doccure for anyone seeking reliable and accessible healthcare services.",
      name: "Sophia Williams",
      rating: 5,
      img: Testimonialsimg
    }
  ];

  return (
    <>
      <section className='baner baner-box' style={{ backgroundImage: `url(${bannerImg})`, }}>

        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <div className="baner-content">
                <h2>Your Health, Our Priority</h2>
                <p>Experience world-class healthcare with NeoHealthCard. Book appointments with top doctors, access telemedicine, and manage your health journey all in one place.</p>
              </div>
              <div className="search-wrapper">
                <div className="search-box d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search doctors, clinics, hospitals, etc"
                  />

                  <button className="btn search-btn">Search</button>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <div className="baner-content-img">
                <img src={banerimg} alt="" />
                <div className="hero-content  ">

                  {/* Regular Check-up Badge */}
                  <div className="checkup-badge">
                    <motion.img
                      src={banerimg2}
                      alt="checkup badge"
                      initial={{ y: -100, opacity: 0 }}          //  Top se start
                      whileInView={{ y: 0, opacity: 1 }}         //  Niche aa jayega
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      viewport={{ once: true }}                  //  Sirf 1 bar chalega
                    />
                  </div>

                  {/* Meet Our Doctors Box */}
                  <div className="doctor-box">
                    <motion.img
                      src={banerimg1}
                      alt="doctor banner"
                      initial={{ x: -100, opacity: 0 }}      // start left
                      whileInView={{ x: 0, opacity: 1 }}     // animate when visible
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

      </section>
      <section className='Categories'>
        <div className="container">
          <div className="LabTestCategories-content">
            <h1>Categories</h1>
          </div>
          <div className="">
            <div className="">
              <Slider {...settings}>

                <div className="Categories-box-card">
                  <img src={Categoriesimg} alt="" />
                  <p>Cardiologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg1} alt="" />
                  <p>Pulmonologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg2} alt="" />
                  <p>Dentistry</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg3} alt="" />
                  <p>General</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg} alt="" />
                  <p>Cardiologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg1} alt="" />
                  <p>Pulmonologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg3} alt="" />
                  <p>General</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg2} alt="" />
                  <p>Dentistry</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg} alt="" />
                  <p>Cardiologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg2} alt="" />
                  <p>Dentistry</p>
                </div>
                <div className="Categories-box-card">
                  <img src={Categoriesimg} alt="" />
                  <p>Cardiologist</p>
                </div>

              </Slider>
            </div>
          </div>
        </div>
      </section>
      <section className='Doctors'>
        <div className="container">
          <div className="Doctors-content ">
            <div className="Doctors-content-text">
              <div className='LabTestCategories-content'>
                <h1>Doctors</h1>
                <p>Specialists are dedicated to providing you with the highest quality medical care and personalized treatment plans.</p>
              </div>
              <div className='d-flex gap-1'>
                <i class="fas fa-angle-left"></i>
                <a href='#'>View All</a>
                <i class="fas fa-angle-right"></i>
              </div>

            </div>
            <Slider {...Doctorscard}>

              {doctors.map((doc, idx) => (
                <div key={idx} className="p-2">
                  <div className="Doctors-content-card">

                    <div className='Doctors-content-card-img'>
                      <img src={doc.img} alt="" />
                    </div>

                    <h3>{doc.name}</h3>
                    <span><i className="fas fa-star me-1"></i> {doc.rating}</span>
                    <p>Psychologists | Mercy Hospital</p>

                    <div className='d-flex justify-content-between flex-wrap Doctors-content-card-body mb-4 mt-2'>
                      <div><i className="fas fa-route me-1"></i> {doc.distance}</div>
                      <div><i className="fas fa-map-marker-alt me-1"></i> {doc.location}</div>
                    </div>

                    <div className="Doctors-content-card-footer d-flex justify-content-between align-items-center">
                      <div>
                        <p>Fees</p>
                        <h5>{doc.fees}</h5>
                      </div>
                      <div>
                        <a href="#" className="">Book Appointment</a>
                      </div>
                    </div>
                    <div className="Doctors-content-card-icon"><i class="far fa-heart"></i></div>
                  </div>
                </div>
              ))}

            </Slider>
          </div>
        </div>
      </section>
      <section className=' LabTestCategories'>
        <div className="container">
          <div className=" LabTestCategories-content ">
            <div><h1> Lab Test Categories</h1>
              <p>Specialists are dedicated to providing you with the highest quality medical care and personalized treatment plans.</p></div>
          </div>


          <div className="">
            <div className="">
              <Slider {...settings}>

                <div className="Categories-box-card">
                  <img src={LabTestCategories} alt="" />
                  <p>CBC</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories1} alt="" />
                  <p>X-Ray</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories2} alt="" />
                  <p>CT Scan</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories3} alt="" />
                  <p>PCR</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories4} alt="" />
                  <p>Covid-19</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories5} alt="" />
                  <p>Cancer</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories6} alt="" />
                  <p>Obesity</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories7} alt="" />
                  <p>Fever</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories8} alt="" />
                  <p>Hair Fall</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories9} alt="" />
                  <p>Diabetes</p>
                </div>
                <div className="Categories-box-card">
                  <img src={LabTestCategories} alt="" />
                  <p>CBC</p>
                </div>

              </Slider>
            </div>
          </div>
        </div>
      </section>
      <section className='Hospitals'>
        <div className="container">
          <div className=" d-flex justify-content-between  flex-wrap">
            <div className='LabTestCategories-content'><h1>Hospitals</h1>
              <p>Specialists are dedicated to providing you with the highest quality medical care and personalized treatment plans.</p>
            </div>
            <div className='Doctors-content-text'>
              <div className='d-flex gap-1'>
                <i class="fas fa-angle-left"></i>
                <a href='#'>View All</a>
                <i class="fas fa-angle-right"></i>
              </div>
            </div>
          </div>
          <Slider {...hospitalssilder}>
            {hospitals.map((data, idx) => (
              <div key={idx} className="p-2">
                <div className="hospitals-content">

                  <div>
                    <img src={data.img} alt="" />
                  </div>

                  <div>
                    <h4>{data.name}</h4>

                    <p>
                      <i className="fas fa-map-marker-alt me-1"></i> {data.address}
                    </p>

                    <div className="d-flex justify-content-between">
                      <div className="hospitals-content-reacting ">
                        <span>
                          <i className="fas fa-star me-1"></i> {data.rating}
                        </span>
                      </div>

                      <div style={{ color: "#4D667E" }}>
                        <i className="fas fa-route me-1"></i> {data.distance}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-5 hospitals-contentbout align-items-center">
                      <div className="hospitals-content-icon Doctors-content-card-icon">
                        <i className="far fa-heart"></i>
                      </div>

                      <div className="hospitals-content-buttion Doctors-content-card-footer">
                        <a href="#">View Details</a>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      <section className='HowitWorks'>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-12">
              <div className="HowitWorks-img">        <img src={HowitWorksimg} alt="" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-12">
              <div className="howitworks-contents">
                <div>
                  <p>How it Works</p>
                  <div className="LabTestCategories-content"> <h1>4 easy steps to get your solution</h1></div>
                </div>
                <div className="howitworks-contents-box">
                  <div className='howitworks-contents-box-icon'>
                    <img src={icon} alt="" />
                  </div>
                  <div>
                    <h5>Search Doctor</h5>
                    <p>Search for a doctor based on specialization, location, or availability. </p>
                  </div>
                </div>
                <div className="howitworks-contents-box">
                  <div className='howitworks-contents-box-icon'>
                    <img src={icon1} alt="" />
                  </div>
                  <div>
                    <h5>Check Doctor Profile</h5>
                    <p>Explore detailed doctor profiles on our platform to make informed healthcare decisions. </p>
                  </div>
                </div>
                <div className="howitworks-contents-box">
                  <div className='howitworks-contents-box-icon'>
                    <img src={icon2} alt="" />
                  </div>
                  <div>
                    <h5>Schedule Appointment</h5>
                    <p>After choose your preferred doctor, select a convenient time slot, & confirm your appointment. </p>
                  </div>
                </div>
                <div className="howitworks-contents-box">
                  <div className='howitworks-contents-box-icon'>
                    <img src={icon3} alt="" />
                  </div>
                  <div>
                    <h5>Get Your Solution</h5>
                    <p>Discuss your health concerns with the doctor and receive personalized advice & solution. </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='Latest-Blogs'>
        <div className="container">
          <div className=" d-flex justify-content-between  flex-wrap">
            <div className='LabTestCategories-content'><h1>Latest Blogs</h1>
              <p>Specialists are dedicated to providing you with the highest quality medical care and personalized treatment plans.</p>
            </div>
            <div className='Doctors-content-text'>
              <div className='d-flex gap-1'>
                <i class="fas fa-angle-left"></i>
                <a href='#'>View All</a>
                <i class="fas fa-angle-right"></i>
              </div>
            </div>
          </div>

          <Slider {...LatestBlogs}>
            {blogData.map((item, idx) => (
              <div key={idx} className="p-2">
                <div className="Latest-Blogs-content">

                  <div className="Latest-Blogs-content-img">
                    <img src={item.img} alt="" />
                  </div>

                  <div className="Latest-Blogs-content-text">
                    <h4>{item.title}</h4>

                    <div className="d-flex Latest-Blogs-content-author mb-3">
                      <span>
                        <i className="far fa-user me-1"></i> {item.user}
                      </span>
                      <span>
                        <i className="fas fa-calendar-alt me-1"></i> {item.date}
                      </span>
                    </div>

                    <p>{item.text}</p>

                    <div className="Latest-Blogs-content-buttion d-flex justify-content-center Doctors-content-card-footer">
                      <a href="#">Read More</a>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      <section className='Download'>
        <div className="container">
          <div className="Download-content">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-12">
                <div className="Download-content-text">
                  <h5>Working for Your Better Health.</h5>
                  <h3>Download the Doccure App today!</h3>
                  <div className='d-flex gap-3 Download-content-btn'>
                    <div>                <a href="#">  <img src={googleplayicon1} className='' alt="" /></a>
                    </div>
                    <div>                 <a href="#"> <img src={googleplayicon} className='' alt="" /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-12">
                <div className="Download-content-img">
                  <img src={Downloadimg} alt="" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      <section className='Testimonials'>
        <div className="container">
          <div class=" d-flex justify-content-between  flex-wrap">
            <div class="LabTestCategories-content"><h1>Testimonials</h1><p>What Our Patient  Says</p></div>
            <div class="Doctors-content-text"><div class="d-flex gap-1"><i class="fas fa-angle-left"></i><i class="fas fa-angle-right"></i></div></div></div>

          <Slider {...LatestBlogs}>
            {testimonials.map((item, idx) => (
              <div key={idx} className="p-2">
                <div className="Testimonials-content">

                  <p>{item.text}</p>

                  <div className="mb-2 mt-1">
                    <img src={item.img} alt="" />
                  </div>

                  <h5>{item.name}</h5>

                  <span>
                    {item.rating}.0{" "}
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </span>

                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  )
}
