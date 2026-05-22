
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faChevronLeft, faChevronRight, faEarDeaf, faHeartPulse, faLocationDot, faRoute, faStethoscope, faTooth, faUser } from "@fortawesome/free-solid-svg-icons";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";
import base_url from "../../baseUrl";
import { getDistanceInKm } from "../../Services/globalFunction";
import Loader from "../Layouts/Loader";


function Home() {
  const splideRef = useRef(null);
  const splideRef1 = useRef(null);
  const splideRef2 = useRef(null);
  const splideRef3 = useRef(null);

  const nextSlide = () => {
    splideRef.current.splide.go(">");
    splideRef1.current.splide.go(">");
    splideRef2.current.splide.go(">");
    splideRef3.current.splide.go(">");
  };

  const prevSlide = () => {
    splideRef.current.splide.go("<");
    splideRef1.current.splide.go("<");
    splideRef2.current.splide.go("<");
    splideRef3.current.splide.go("<");
  };



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
  const [favIds, setFavIds] = useState([])
  const [doctors, setDoctors] = useState([])
  const userId = localStorage.getItem('userId')
  const [hospitals, setHospitals] = useState([])
  const fetchDoctors = async () => {
    const result = await getApiData(
      'doctor/all-doctors?limit=10'
    );

    if (result.success) {
      setDoctors(result.data);
    }
  };

  useEffect(() => {
    // fetchDoctors()
  }, [])
  async function fetchFavData() {
    if (!userId) {
      return
    }
    const result = await getSecureApiData(`patient/favorite/${userId}?limit=1000000&type=doctor`)
    if (result.success) {
      setFavIds(result.data)
    }
  }

  useEffect(() => {
    fetchFavData()
  }, [userId])
  async function fetchHospitals() {
    const result = await getApiData(`api/hospital?limit=10`)
    if (result.success) {
      setHospitals(result.data)
    }
  }
  useEffect(() => {
    // fetchHospitals()
  }, [])
  const handleFavorite = async (id) => {
    const data = { userId, doctorId: id }
    try {
      const response = await securePostData('patient/favorite', data)
      if (response.success) {
        // toast.success("")
        fetchFavData()
      } else {
        toast.success(response.message)
      }
    } catch (error) {

    }
  }
  const [myLatLong, setMyLatLong] = useState({ lat: null, long: null })
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLatLong(prev => ({
            ...prev,
            lat: position.coords.latitude,
            long: position.coords.longitude
          }));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);
  // const [blogData, setBlogData] = useState('')
  // const [blogUrl, setBlogUrl] = useState('')
  // async function fetchBlog() {

  //   const result = await getApiData(`api/admin/blogs?page=1&limit=8`)
  //   if (result.success) {
  //     setBlogData(result.data)
  //     setBlogUrl(result.baseUrl)
  //   }
  // }
  // useEffect(() => {
  //   fetchBlog()
  // }, [])

  const [firstSection, setFirstSection] = useState()
  const [testCat,setTestCat] = useState([])
  const [specialityData,setSpecialityData]=useState([])
  const [testData,setTestData]=useState([])
  const [howItWorks,setHowItWorks]=useState([])
  const [serviceData,setServiceData]=useState([])
  const [pharCat,setPharCat]=useState([])
  const [hospitalCat,setHospitalCat]=useState([])
  const [topHospitals,setTopHospitals]=useState([])
  const [topDoctors,setTopDoctors]=useState([])
  const [topLabs,setTopLabs]=useState([])
  const [topPhar,setTopPhar]=useState([])
  const [loading,setLoading]=useState(false)
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getApiData("api/admin/landing/patient");
      if (res.success) {
        setFirstSection(res?.data?.firstSection);
        setTestCat(res?.data?.testCat)
        setSpecialityData(res?.data?.speciality)
        setTestData(res?.data?.testimonial)
        setHowItWorks(res?.data?.howItWorks)
        setServiceData(res?.data?.ptServices)
        setHospitalCat(res.data?.hospitalCat)
        setPharCat(res?.data?.pharmacyCat)
      }


    } catch (err) {
      console.log(err);
    } finally{
      setLoading(false)
    }
  };
  const fetchTopData = async () => {
    setLoading(true)
    try {
      const res = await getApiData("patient/top-users");
      if (res.success) {
        setTopDoctors(res?.data?.doctors);
        setTopHospitals(res?.data?.hospitals)
        setTopLabs(res?.data?.labs)
        setTopPhar(res?.data?.pharmacy)
      }


    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
    fetchTopData()
  }, []);
  return (
    <>
    {loading ? <Loader/>
    : <>

      <section className='baner baner-box' style={{ backgroundImage: `url(/baner.png)`, }}>
        <div className="container">
          <div className="row ">
            <div className="col-lg-6 col-md-12 col-sm-12 position-relative z-1 ">
              <div className="baner-content pt-lg-5">
                <h2>{firstSection?.heroTitle || "Your Health, Our Priority."}</h2>
                <p>{firstSection?.heroDesc}</p>
              </div>
              <div className="search-wrapper custom-frm-bx">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search doctors, clinics, hospitals, etc" />

                <div className="tp-nw-filter-bx">
                  <button className="nw-thm-btn">Search</button>
                </div>

              </div>
            </div>

            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <div className="baner-content-img">
                <div className="patient-hp-pic">
                  <img src={firstSection?.heroImage ? `${base_url}/${firstSection?.heroImage}` : "/baner-img.png"} alt="" />
                </div>
                <div className="hero-content  ">


                  <div className="checkup-badge">
                    <motion.img
                      src="/baner-img2.png"
                      alt="checkup badge"
                      initial={{ y: -100, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>


                  <div className="doctor-box">
                    <motion.img
                      src="/baner-img1.png"
                      alt="doctor banner"
                      initial={{ x: -100, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
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

      {/* <section className='Categories'>
        <div className="container">
          <div className="LabTestCategories-content">
            <h1>Categories</h1>
          </div>
          <div className="">
            <div className="">
              <Slider {...settings}>

                <div className="Categories-box-card">
                  <img src="/Categories-img.png" alt="" />
                  <p>Cardiologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img2.png" alt="" />
                  <p>Pulmonologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img3.png" alt="" />
                  <p>Dentistry</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img4.png" alt="" />
                  <p>General</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img5.png" alt="" />
                  <p>Cardiologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img.png" alt="" />
                  <p>Pulmonologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img2.png" alt="" />
                  <p>General</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img2.png" alt="" />
                  <p>Dentistry</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img2.png" alt="" />
                  <p>Cardiologist</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img2.png" alt="" />
                  <p>Dentistry</p>
                </div>
                <div className="Categories-box-card">
                  <img src="/Categories-img2.png" alt="" />
                  <p>Cardiologist</p>
                </div>

              </Slider>
            </div>
          </div>
        </div>
      </section> */}

     

      <section className="categories-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="mb-3">
              <h5 className="heading-grad fz-40 fw-700">Services</h5>
              <p>{firstSection?.servicesDesc}</p>
            </div>

            {serviceData?.map(s=>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="doctor-services-card">
                <div className="services-pic-bx">
                  <img src={s?.image?
                  `${base_url}/${s?.image}`:"/services-pic.png"} alt="" />
                </div>
                <div className="services-content">
                  <h3>{s?.title}</h3>
                  <p>{s?.description}</p>
                </div>
                <div className="text-center">
                  <Link to={
                    s?.title?.toLowerCase().includes('pharmacy') ? '/find-pharmacy' :
                    s?.title?.toLowerCase().includes('doctor') ? '/new-doctor-details' :
                    s?.title?.toLowerCase().includes('hospital') ? '/find-hospital' :
                    s?.title?.toLowerCase().includes('lab') ? '/find-labs' :
                    s?.title?.toLowerCase().includes('ambulance') ? '/find-hospital' :
                    '/'
                  } className="nw-thm-btn">Search {s?.title}</Link>
                </div>
              </div>
            </div>)}


          </div>
        </div>
      </section>
       <section className="categories-section">
        <div className="container">
          <div className="row">
            <div className="mb-3">
              <h5 className="heading-grad fz-40 fw-700">Categories</h5>
            </div>
            <div className="col-lg-12">

              <Splide
                options={{
                  type: "loop",
                  perPage: 10,
                  perMove: 1,
                  autoplay: true,
                  pagination: false,
                  interval: 2500,
                  speed: 800,
                  arrows: false,
                  gap: "20px",
                  breakpoints: {
                    992: { perPage: 6, gap: "15px" },
                    767: { perPage: 4, gap: "10px" },
                    567: { perPage: 2, gap: "10px" },
                  },
                }}
              >

                {specialityData?.map(t=>
                <SplideSlide>
                  <Link to={`/doctor/${t?.name}/${t?._id}`}>
                    <div className="all-categories-bx">
                      <span className="categories-icon-bx">
                        <img src={`${base_url}/${t?.icon}`} alt="" />
                      </span>
                      <h5>{t?.name}</h5>
                    </div>
                  </Link>
                </SplideSlide>)}                          

                

              </Splide>

            </div>
          </div>
        </div>
      </section>

      <section className='find-lab-section'>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <div className="nw-arrow-bx  mb-2">
                <div>
                  <h4 className="heading-grad fz-40 mb-2">Doctors</h4>
                  <p>{firstSection?.doctorDesc}</p>
                </div>

                <div className="rating-arrows">
                  <button onClick={prevSlide} className="rating-prev me-2">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <Link to={'/new-doctor-details'} className="view-all-btn">View All</Link>
                  <button onClick={nextSlide} className="rating-next">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>


              <Splide
                ref={splideRef2}
                options={{
                  type: "loop",
                  perPage: 4,
                  perMove: 1,
                  autoplay: true,
                  pagination: false,
                  interval: 2500,
                  speed: 800,
                  arrows: false,
                  gap: "20px",
                  breakpoints: {
                    992: { perPage: 2, gap: "15px" },
                    767: { perPage: 1, gap: "10px" },
                  },
                }}
              >

                {topDoctors?.map((item, key) =>
                  <SplideSlide className="py-2" key={key}>
                    <div className="favorite-docotr-card position-relative">
                      <div className="favorite-doctor-picture text-center">
                        <img src={item?.doctorId?.profileImage ?
                          `${base_url}/${item?.doctorId?.profileImage}` : "/date-time-img.png"} alt="" />
                        <div className="favorite-doctor-details">
                          <h4 className="">{item?.name}</h4>
                          <div className="my-2">
                            <span className="lab-rating"> <i className="fa-solid fa-star rating-icon"></i> 5.0 </span>
                          </div>
                          <h6 className="nw-hospital-title">{item?.about?.specialty?.name} <span className="slash-title" >|</span> {item?.about?.hospitalName}</h6>
                          <div className="d-flex align-items-center justify-content-between flex-wrap my-2">
                            <p className=""><FontAwesomeIcon icon={faRoute} /> {5} km</p>
                            <p className=""><FontAwesomeIcon icon={faLocationDot} /> {item?.about?.fullAddress}</p>
                          </div>
                          <div className="d-flex justify-content-between mt-3">

                            <div className="text-start">
                              <span className="fees-title">Fees :</span>
                              <h5 className="ammount-title fw-700"> $ {item?.about?.fees}</h5>
                            </div>
                            <Link to={`/doctor-details/${item?.name}/${item?._id}`} className="nw-thm-btn">Book Appointment</Link>
                          </div>

                          <div className="doctor-heart-bx">
                            <button className="heart-btn" onClick={() => handleFavorite(item?._id)}>
                              {favIds?.some(fav => fav?.doctorId === item?._id) ?
                                <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                : <i className="fa-regular fa-heart"></i>}</button>
                          </div>

                        </div>
                      </div>
                    </div>
                  </SplideSlide>)}
              </Splide>


            </div>
          </div>
        </div>
      </section>

      <section className="lab-categoreis-section">
        <div className="container">
          <div className="row">
            <div className="mb-3">
              <h5 className="heading-grad fz-40 fw-700"> Lab Test Categories</h5>
              <p>{firstSection?.testCategoryDesc}</p>
            </div>
            <div className="col-lg-12">
              <div className="my-3">
                <Splide
                  options={{
                    type: "loop",
                    perPage: 10,
                    perMove: 1,
                    autoplay: true,
                    pagination: false,
                    interval: 2500,
                    speed: 800,
                    arrows: false,
                    gap: "20px",
                    breakpoints: {
                      992: { perPage: 6, gap: "15px" },
                      767: { perPage: 4, gap: "10px" },
                      567: { perPage: 2, gap: "10px" },
                    },
                  }}
                >

                  {testCat?.map(t=><SplideSlide>
                    <Link to={`/labs/${t?.name}/${t?._id}`}>
                      <div className="lab-categories-bx">
                        <span className="lab-icon-bx">
                          <img src={t?.icon ?
                          `${base_url}/${t?.icon}`:"/cbc.png"} alt="" />
                        </span>
                        <h5>{t?.name}</h5>
                      </div>
                    </Link>
                  </SplideSlide>)}

              



                </Splide>
              </div>
            </div>
          </div>
        </div>

      </section>
      <section className='hospital-section'>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <div className="nw-arrow-bx mb-2 mb-2">
                <div>
                  <h4 className="heading-grad mb-2 fz-40">Laboratories</h4>
                  <p>{firstSection?.hospitalDesc}</p>
                </div>

                <div className="rating-arrows">
                  <button onClick={prevSlide} className="rating-prev me-2">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <Link to={'/find-labs'} className="view-all-btn">View All</Link>
                  <button onClick={nextSlide} className="rating-next">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>


              <Splide
                ref={splideRef1}
                options={{
                  type: "loop",
                  perPage: 3,
                  perMove: 1,
                  autoplay: true,
                  pagination: false,
                  interval: 2500,
                  speed: 800,
                  arrows: false,
                  gap: "20px",
                  breakpoints: {
                    992: { perPage: 2, gap: "15px" },
                    767: { perPage: 1, gap: "10px" },
                  },
                }}
              >

                {topLabs?.map((item, key) =>
                  <SplideSlide className="py-2" key={key}>
                    <div className="lab-technology-card">
                      <div className="doctor-mega-card">
                        <div className="doctor-pic-bx">
                          <img src={item?.labId?.labImage?.thumbnail ? `${base_url}/${item?.labId?.labImage?.thumbnail}` : 
                            item?.labId?.images?.thumbnail?.[0]?.fileUrl ? `${base_url}${item?.labId?.images?.thumbnail[0].fileUrl}` : 
                            item?.labId?.logo ? `${base_url}/${item?.labId?.logo}` : 
                            item?.labId?.logoFileId ? (item?.labId?.logoFileId.length === 24 ? `${base_url}/api/file/${item?.labId?.logoFileId}` : item?.labId?.logoFileId.includes('/') ? `${base_url}/${item?.labId?.logoFileId}` : `${base_url}/uploads/lab/${item?.labId?.logoFileId}`) : 
                            "/hospital-pic.jpg"} alt="" />
                        </div>
                        <div className="doctor-details  flex-grow-1">
                          <h4 className="innr-title fz-700">{item?.name?.slice(0, 15)}</h4>
                          <p><FontAwesomeIcon icon={faLocationDot} /> {item?.about?.fullAddress?.slice(0, 15)}</p>
                          <div className="my-3 d-flex align-items-center justify-content-between">
                            <span className="lab-rating"> <i class="fa-solid fa-star rating-icon"></i>{item?.avgRating || 5} </span>
                            <p><FontAwesomeIcon icon={faRoute} />2.5 km</p>
                          </div>

                          <div className="  d-flex align-items-center justify-content-between">
                            <div>
                              <button className="heart-btn" onClick={() => handleFavorite(item?._id)}>
                                {favIds?.some(fav => fav?.hospitalId === item?._id) ?
                                  <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                  : <i className="fa-regular fa-heart"></i>}</button>
                            </div>
                            <div>
                              <Link to={`/lab-detail/${item?.name}/${item?._id}`} className="nw-thm-btn">View Details</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SplideSlide>)}


              </Splide>


            </div>
          </div>
        </div>
      </section>
      <section className="lab-categoreis-section">
        <div className="container">
          <div className="row">
            <div className="mb-3">
              <h5 className="heading-grad fz-40 fw-700">Hospital Categories</h5>
              {/* <p>{firstSection?.testCategoryDesc}</p> */}
            </div>
            <div className="col-lg-12">
              <div className="my-3">
                <Splide
                  options={{
                    type: "loop",
                    perPage: 10,
                    perMove: 1,
                    autoplay: true,
                    pagination: false,
                    interval: 2500,
                    speed: 800,
                    arrows: false,
                    gap: "20px",
                    breakpoints: {
                      992: { perPage: 6, gap: "15px" },
                      767: { perPage: 4, gap: "10px" },
                      567: { perPage: 2, gap: "10px" },
                    },
                  }}
                >

                  {hospitalCat?.map(t=><SplideSlide>
                    <Link to={`/hospital/${t?.name}/${t?._id}`}>
                      <div className="lab-categories-bx">
                        <span className="lab-icon-bx">
                          <img src={t?.icon ?
                          `${base_url}/${t?.icon}`:"/cbc.png"} alt="" />
                        </span>
                        <h5>{t?.name}</h5>
                      </div>
                    </Link>
                  </SplideSlide>)}

              



                </Splide>
              </div>
            </div>
          </div>
        </div>

      </section>


      <section className='hospital-section'>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <div className="nw-arrow-bx mb-2 mb-2">
                <div>
                  <h4 className="heading-grad mb-2 fz-40">Hospitals</h4>
                  <p>{firstSection?.hospitalDesc}</p>
                </div>

                <div className="rating-arrows">
                  <button onClick={prevSlide} className="rating-prev me-2">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <Link to={'/find-hospital'} className="view-all-btn">View All</Link>
                  <button onClick={nextSlide} className="rating-next">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>


              <Splide
                ref={splideRef1}
                options={{
                  type: "loop",
                  perPage: 3,
                  perMove: 1,
                  autoplay: true,
                  pagination: false,
                  interval: 2500,
                  speed: 800,
                  arrows: false,
                  gap: "20px",
                  breakpoints: {
                    992: { perPage: 2, gap: "15px" },
                    767: { perPage: 1, gap: "10px" },
                  },
                }}
              >

                {topHospitals?.map((item, key) =>
                  <SplideSlide className="py-2" key={key}>
                    <div className="lab-technology-card">
                      <div className="doctor-mega-card">
                        <div className="doctor-pic-bx">
                          <img src={item?.hospitalId?.images?.thumbnail?.[0]?.fileUrl ? `${base_url}${item?.hospitalId?.images?.thumbnail[0].fileUrl}` : 
                            item?.hospitalId?.logoField ? `${base_url}/${item?.hospitalId?.logoField}` : 
                            item?.hospitalId?.logo ? `${base_url}/${item?.hospitalId?.logo}` : 
                            item?.hospitalId?.logoFileId ? (item?.hospitalId?.logoFileId.length === 24 ? `${base_url}/api/file/${item?.hospitalId?.logoFileId}` : item?.hospitalId?.logoFileId.includes('/') ? `${base_url}/${item?.hospitalId?.logoFileId}` : `${base_url}/uploads/logo/${item?.hospitalId?.logoFileId}`) : 
                            "/hospital-pic.jpg"} alt="" />
                        </div>
                        <div className="doctor-details  flex-grow-1">
                          <h4 className="innr-title fz-700">{item?.name?.slice(0, 15)}</h4>
                          <p><FontAwesomeIcon icon={faLocationDot} /> {item?.about?.fullAddress?.slice(0, 15)}</p>
                          <div className="my-3 d-flex align-items-center justify-content-between">
                            <span className="lab-rating"> <i class="fa-solid fa-star rating-icon"></i>{item?.avgRating || 5} </span>
                            <p><FontAwesomeIcon icon={faRoute} />2.5 km</p>
                          </div>

                          <div className="  d-flex align-items-center justify-content-between">
                            <div>
                              <button className="heart-btn" onClick={() => handleFavorite(item?._id)}>
                                {favIds?.some(fav => fav?.hospitalId === item?._id) ?
                                  <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                  : <i className="fa-regular fa-heart"></i>}</button>
                            </div>
                            <div>
                              <Link to={`/hospital-details/${item?.name}/${item?.hospitalId?._id}`} className="nw-thm-btn">View Details</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SplideSlide>)}


              </Splide>


            </div>
          </div>
        </div>
      </section>
       <section className="lab-categoreis-section">
        <div className="container">
          <div className="row">
            <div className="mb-3">
              <h5 className="heading-grad fz-40 fw-700">Pharmacy Categories</h5>
              {/* <p>{firstSection?.testCategoryDesc}</p> */}
            </div>
            <div className="col-lg-12">
              <div className="my-3">
                <Splide
                  options={{
                    type: "loop",
                    perPage: 10,
                    perMove: 1,
                    autoplay: true,
                    pagination: false,
                    interval: 2500,
                    speed: 800,
                    arrows: false,
                    gap: "20px",
                    breakpoints: {
                      992: { perPage: 6, gap: "15px" },
                      767: { perPage: 4, gap: "10px" },
                      567: { perPage: 2, gap: "10px" },
                    },
                  }}
                >

                  {pharCat?.map(t=><SplideSlide>
                    <Link to={`/pharmacy/${t?.name}/${t?._id}`}>
                      <div className="lab-categories-bx">
                        <span className="lab-icon-bx">
                          <img src={t?.icon ?
                          `${base_url}/${t?.icon}`:"/cbc.png"} alt="" />
                        </span>
                        <h5>{t?.name}</h5>
                      </div>
                    </Link>
                  </SplideSlide>)}

              



                </Splide>
              </div>
            </div>
          </div>
        </div>

      </section>
      <section className='hospital-section'>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <div className="nw-arrow-bx mb-2 mb-2">
                <div>
                  <h4 className="heading-grad mb-2 fz-40">Pharmacy</h4>
                  <p>{firstSection?.hospitalDesc}</p>
                </div>

                <div className="rating-arrows">
                  <button onClick={prevSlide} className="rating-prev me-2">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <Link to={'/find-pharmacy'} className="view-all-btn">View All</Link>
                  <button onClick={nextSlide} className="rating-next">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>


              <Splide
                ref={splideRef1}
                options={{
                  type: "loop",
                  perPage: 3,
                  perMove: 1,
                  autoplay: true,
                  pagination: false,
                  interval: 2500,
                  speed: 800,
                  arrows: false,
                  gap: "20px",
                  breakpoints: {
                    992: { perPage: 2, gap: "15px" },
                    767: { perPage: 1, gap: "10px" },
                  },
                }}
              >

                {topPhar?.map((item, key) =>
                  <SplideSlide className="py-2" key={key}>
                    <div className="lab-technology-card">
                      <div className="doctor-mega-card">
                        <div className="doctor-pic-bx">
                          <img src={item?.pharId?.pharImg?.thumbnail ? `${base_url}/${item?.pharId?.pharImg?.thumbnail}` : 
                            item?.pharId?.images?.thumbnail?.[0]?.fileUrl ? `${base_url}${item?.pharId?.images?.thumbnail[0].fileUrl}` : 
                            item?.pharId?.logo ? `${base_url}/${item?.pharId?.logo}` : 
                            item?.pharId?.logoFileId ? (item?.pharId?.logoFileId.length === 24 ? `${base_url}/api/file/${item?.pharId?.logoFileId}` : item?.pharId?.logoFileId.includes('/') ? `${base_url}/${item?.pharId?.logoFileId}` : `${base_url}/uploads/pharmacy/${item?.pharId?.logoFileId}`) : 
                            "/hospital-pic.jpg"} alt="" />
                        </div>
                        <div className="doctor-details  flex-grow-1">
                          <h4 className="innr-title fz-700">{item?.name?.slice(0, 15)}</h4>
                          <p><FontAwesomeIcon icon={faLocationDot} /> {item?.about?.fullAddress?.slice(0, 15)}</p>
                          <div className="my-3 d-flex align-items-center justify-content-between">
                            <span className="lab-rating"> <i class="fa-solid fa-star rating-icon"></i>{item?.avgRating || 5} </span>
                            <p><FontAwesomeIcon icon={faRoute} />2.5 km</p>
                          </div>

                          <div className="  d-flex align-items-center justify-content-between">
                            <div>
                              <button className="heart-btn" onClick={() => handleFavorite(item?._id)}>
                                {favIds?.some(fav => fav?.hospitalId === item?._id) ?
                                  <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                  : <i className="fa-regular fa-heart"></i>}</button>
                            </div>
                            <div>
                              <Link to={`/pharmacy-detail/${item?.name}/${item?._id}`} className="nw-thm-btn">View Details</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SplideSlide>)}


              </Splide>


            </div>
          </div>
        </div>
      </section>

      {/* <section className="ambulance-hp-section">
        <div className="container ">
          <div className="book-ambulance-setion">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 d-flex flex-column justify-content-center">
                <div className="book-ambulance-title">
                  <h4>Book Ambulance</h4>

                  <p>Book transport for an urgent medical need right now</p>


                </div>

                <div className="mt-4 ambulance-book-bx">
                  <button className="nw-thm-btn">Book Ambulance Now</button>
                </div>

              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="ambulance-trace-picture-bx">
                  <img src="/ambulance-trace.png" alt="" />
                </div>

              </div>

            </div>
          </div>

        </div>
      </section> */}

      <section className='HowitWorks'>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-12">
              <div className="HowitWorks-img">        <img src={firstSection?.howItWorkImage ?
                `${base_url}/${firstSection?.howItWorkImage}` : "/HowitWorks-img.png"} alt="" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-12">
              <div className="howitworks-contents">
                <div>
                  <p>How it Works</p>
                  <div > <h4 className="heading-grad fz-40 fw-700">{firstSection?.howItWorks}</h4></div>
                </div>
                {howItWorks?.map(h=>
                <div className="howitworks-contents-box">
                  <div className='howitworks-contents-box-icon'>
                    <img src={h?.image?
                    `${base_url}/${h?.image}`:"/icon.png"} alt="" />
                  </div>
                  <div>
                    <h5>{h?.title}</h5>
                    <p>{h?.description} </p>
                  </div>
                </div>)}                
                
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* {blogData?.length > 0 && <section className='blog-section'>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <div className="nw-arrow-bx  mb-2">
                <div>
                  <h4 className="heading-grad fz-40 mb-2">Latest Blogs</h4>
                  <p>{firstSection?.blogDesc}</p>
                </div>

                <div className="rating-arrows">
                  <button onClick={prevSlide} className="rating-prev me-2">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <Link to="/blogs" className="view-all-btn">View All</Link>
                  <button onClick={nextSlide} className="rating-next">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>


              <Splide
                ref={splideRef}
                options={{
                  type: "loop",
                  perPage: 4,
                  perMove: 1,
                  autoplay: true,
                  pagination: false,
                  interval: 2500,
                  speed: 800,
                  arrows: false,
                  gap: "20px",
                  breakpoints: {
                    992: { perPage: 2, gap: "15px" },
                    767: { perPage: 1, gap: "10px" },
                  },
                }}
              >

                {blogData?.map((item, key) =>
                  <SplideSlide key={key}>
                    <div className="bloging-card">
                      <div class="blog-picture">
                        <img src={item?.image ?
                          `${blogUrl}${item.image}` : "/hospital-pic.jpg"} alt="example" class="img-scale" />
                      </div>
                      <div className="blog-content mt-2">
                        <h4>{item.title}</h4>

                        <div className="d-flex gap-3 my-3">
                          <span className="blog-user-title"><FontAwesomeIcon icon={faUser} /> Admin</span>
                          <span className="blog-user-title"><FontAwesomeIcon icon={faCalendar} />
                            {new Date(item?.createdAt)?.toLocaleDateString(('en-GB'), {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}</span>
                        </div>

                        <p className="blog-para">{item?.description}</p>

                        <div className="text-center mt-4">
                          <Link to={`/blogs-detail/${item._id}`} className="nw-thm-btn w-75">Read More</Link>
                        </div>
                      </div>
                    </div>
                  </SplideSlide>)}
              </Splide>


            </div>
          </div>
        </div>
      </section>} */}

      <section className='download-section'>
        <div className="container">
          <div className="download-content">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-12">
                <div className="download-content-text">
                  <h5>{firstSection?.downloadTitle}</h5>
                  <h3>{firstSection?.downloadDesc}</h3>
                  <div className='d-flex gap-3 download-content-btn'>
                    <div>                <a href={firstSection?.playStore} target="_blank">  <img src="/google-play-icon1.png" className='' alt="" /></a>
                    </div>
                    <div>                 <a href={firstSection?.appStore} target="_blank"> <img src="google-play-icon.png" className='' alt="" /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-12">
                <div className="download-content-img">
                  <img src={firstSection?.downloadImage ?
                  `${base_url}/${firstSection?.downloadImage}`:"/Download-img.png"} alt="" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className='Testimonials'>

        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <div className="nw-arrow-bx  mb-2">
                <div>
                  <h4 className="heading-grad fz-40 mb-2">Testimonials</h4>
                  <p>{firstSection?.testimonialDesc}</p>
                </div>

                <div className="rating-arrows">
                  <button onClick={prevSlide} className="rating-prev me-2">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button className="view-all-btn">View All</button>
                  <button onClick={nextSlide} className="rating-next">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>


              <Splide
                ref={splideRef3}
                options={{
                  type: "loop",
                  perPage: 4,
                  perMove: 1,
                  autoplay: true,
                  pagination: false,
                  interval: 2500,
                  speed: 800,
                  arrows: false,
                  gap: "20px",
                  breakpoints: {
                    1200: { perPage: 3, gap: "15px" },
                    992: { perPage: 2, gap: "15px" },
                    767: { perPage: 1, gap: "10px" },
                  },
                }}
              >

                {testData?.map(t=>
                <SplideSlide>
                  <div class="testimonials-content">
                    <p>
                      {t?.description}
                    </p>

                    <div class="mb-2 mt-1">
                      <img src={t?.image?
                      `${base_url}/${t?.image}`:"/Testimonials-img.png"} alt="" />
                    </div>

                    <h5>{t?.name}</h5>

                    <span>
                      {Number(t?.star)}
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </span>
                  </div>
                </SplideSlide>)}
               
              </Splide>


            </div>
          </div>
        </div>

      </section>
    </>}
    </>
  )
}

export default Home