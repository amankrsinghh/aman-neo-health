import React from 'react'
import docer from '../assets/img/date-time-img.png'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Datetime() {
    const settings = {
  dots: false,
  infinite: true,
  speed: 600,
  slidesToShow: 7,
  slidesToScroll: 1,
  arrows: true,
  autoplay: false,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  swipeToSlide: true,

  responsive: [
    {
      breakpoint: 1920,
      settings: {
        slidesToShow: 7,
      }
    },
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 4,
      }
    },
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 4,
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
      }
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
};

  
  return (
  <>
  <section className='Date-time'>
    <div className="container">
        <div className="Date-time-contaner">
            <div className="Datetimecontaner-box d-flex gap-3">
                <div className='Datetimecontaner-boximg'> <img src={docer} alt="" /> <p className='Date-timereacting hospitals-content-reacting '><span><i className="fas fa-star me-1"></i>5.0</span></p></div>
            <div><h4>Dr.James Harris</h4>
            <p style={{color:"#052F59", marginBottom:"22px" ,marginTop:"14px"}}>Psychologists | Mercy Hospital</p>
            <p><i class="fas fa-map-marker-alt me-1"></i>Malviya Nagar, Jaipur</p>
            </div>
            </div>
            <div className="Date-time-contaner-box">
             <div>
                 <h4>Select date</h4>
              <div className=''>
                  <Slider {...settings}>
                 <div className="p-2">
                     <div className="Mon ">
                    <p>Mon</p>
                    <p>Jan 16</p>
                </div>
                 </div>
                <div className="p-2">
                    <div className="Mon-Tue">
                    <p>Mon</p>
                    <p>Jan 16</p>
                </div>
                </div>
               <div className="p-2">
                 <div className="Mon-Tue">
                    <p>Mon</p>
                    <p>Jan 16</p>
                </div>
               </div>
                <div className="p-2">
                    <div className="Mon-Tue">
                    <p>Mon</p>
                    <p>Jan 16</p>
                </div>
                </div>
                <div className="p-2">
                    <div className="Mon-Tue">
                    <p>Mon</p>
                    <p>Jan 16</p>
                </div>
                </div>
                <div className="p-2">
                    <div className="Mon-Tue">
                    <p>Mon</p>
                    <p>Jan 16</p>
                </div>
                </div>
              <div className="p-2">
                  <div className="Mon-Tue">
                    <p>Mon</p>
                    <p>Jan 16</p>
                </div>
              </div>
                </Slider>
              </div>
             </div>
             <div className='mt-3'>
              <h4>Select Time</h4>
             </div>
             <div className='Select-Time'>
              <div className="time-box  "><span>08.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
              <div className="time Mon-Tue"> <span>09.00 PM</span></div>
             </div>
              
            </div>
            <hr  className=''/>
            <div className="Date-time-contaner-footer">
              <div className='contaner-footer-itme Doctors-content-card-footer '>
                <a href="# ">Back</a>
              </div>
              <div className='d-flex gap-4 '>
                <div > 
                  <h5>$25.00</h5>
                  <p>Fees</p>
                </div>
                <div className='Doctors-content-card-footer'> <a href="# " className=''>Continue</a></div>
               
              </div>
            </div>
        </div>
    </div>
  </section>
  </>
  )
}
