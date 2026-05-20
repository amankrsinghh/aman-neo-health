
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { useRef } from "react";
import base_url from "../../baseUrl";

function RatingSlider({ ratings }) {
    //    const splideRef = useRef(null);

    // const nextSlide = () => {
    //     splideRef.current.splide.go(">");
    // };

    // const prevSlide = () => {
    //     splideRef.current.splide.go("<");
    // };

    const sliderRef = useRef(null);

    const nextSlide = () => sliderRef.current.splide.go(">");
    const prevSlide = () => sliderRef.current.splide.go("<");


    return (
        <>

            <section className="rating-section pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h4 className="title mb-2">Rating</h4>

                                <div className="rating-arrows">
                                    <button onClick={prevSlide} className="rating-prev me-2">
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    <button onClick={nextSlide} className="rating-next">
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                </div>
                            </div>


                            <Splide
                                ref={sliderRef}
                                options={{
                                    type: ratings?.length > 6 ? "loop" : "slide", // 👈 FIX
                                    perPage: 2,
                                    perMove: 1,
                                    autoplay: ratings?.length > 6,
                                    pagination: false,
                                    arrows: false,

                                    grid: {
                                        rows: 3,
                                        cols: 2,
                                        gap: {
                                            row: "20px",
                                            col: "20px",
                                        },
                                    },

                                    gap: "20px",
                                    breakpoints: {
                                        992: { perPage: 2, gap: "15px" },
                                        767: { perPage: 1, gap: "10px" },
                                    },
                                }}
                            >



                                {ratings?.map((item, key) =>
                                    <SplideSlide key={key}> <div className="EmilyAnderson-contar mb-3">
                                        <div className="EmilyAnderson">
                                            <img src={
                                                item?.patientId?.patientId?.profileImage ?
                                                    `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/DoctorDetails-img.png"} alt="" />
                                            <div>
                                                <h5>{item?.patientId?.name}</h5>
                                                <p>
                                                    {item?.star} {[...Array(5)].map((_, index) => (
                                                        <i
                                                            key={index}
                                                            className={`fas fa-star ${index < item?.star ? "active" : "inactive"}`}
                                                        ></i>
                                                    ))}
                                                </p>
                                            </div>
                                        </div>
                                        <p>
                                            {item?.message}
                                        </p>
                                    </div>
                                    </SplideSlide>)}

                            </Splide>


                            {/* <Splide
                                ref={slider2}
                                options={{
                                    type: "loop",
                                    perPage: 2,
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
                                <SplideSlide>
                                     <div className="EmilyAnderson-contar mb-3">
                                    <div className="EmilyAnderson">
                                        <img src="/DoctorDetails-img.png" alt="" />
                                        <div>
                                            <h5>Emily Anderson</h5>
                                            <p>
                                                5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        Dr. Patel is a true professional who genuinely cares about his patients.
                                        I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.
                                    </p>
                                </div>
                                </SplideSlide>
                                <SplideSlide>
                                      <div className="EmilyAnderson-contar mb-3">
                                    <div className="EmilyAnderson">
                                        <img src="/DoctorDetails-img.png" alt="" />
                                        <div>
                                            <h5>Emily Anderson</h5>
                                            <p>
                                                5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        Dr. Patel is a true professional who genuinely cares about his patients.
                                        I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.
                                    </p>
                                </div>
                                </SplideSlide>
                                <SplideSlide> 
                                    <div className="EmilyAnderson-contar mb-3">
                                    <div className="EmilyAnderson">
                                        <img src="/DoctorDetails-img.png" alt="" />
                                        <div>
                                            <h5>Emily Anderson</h5>
                                            <p>
                                                5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        Dr. Patel is a true professional who genuinely cares about his patients.
                                        I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.
                                    </p>
                                </div> 
                                </SplideSlide>
                            </Splide> */}


                            {/* <Splide
                                ref={slider3}
                                options={{
                                    type: "loop",
                                    perPage: 2,
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
                                <SplideSlide>
                                     <div className="EmilyAnderson-contar mb-3">
                                    <div className="EmilyAnderson">
                                        <img src="/DoctorDetails-img.png" alt="" />
                                        <div>
                                            <h5>Emily Anderson</h5>
                                            <p>
                                                5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        Dr. Patel is a true professional who genuinely cares about his patients.
                                        I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.
                                    </p>
                                </div>
                                 </SplideSlide>
                                <SplideSlide>
                                     <div className="EmilyAnderson-contar mb-3">
                                    <div className="EmilyAnderson">
                                        <img src="/DoctorDetails-img.png" alt="" />
                                        <div>
                                            <h5>Emily Anderson</h5>
                                            <p>
                                                5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        Dr. Patel is a true professional who genuinely cares about his patients.
                                        I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.
                                    </p>
                                </div>
                                </SplideSlide>
                                <SplideSlide>
                                     <div className="EmilyAnderson-contar mb-3">
                                    <div className="EmilyAnderson">
                                        <img src="/DoctorDetails-img.png" alt="" />
                                        <div>
                                            <h5>Emily Anderson</h5>
                                            <p>
                                                5.0 <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        Dr. Patel is a true professional who genuinely cares about his patients.
                                        I highly recommend Dr. Patel to anyone seeking exceptional cardiac care.
                                    </p>
                                </div>
                                </SplideSlide>
                            </Splide> */}
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default RatingSlider