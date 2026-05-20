
import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { toast } from "react-toastify";
import { getApiData, securePostData, updateApiData } from "../../Services/api";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import base_url from "../../baseUrl";
import { useSelector } from "react-redux";

function DateTime() {
  const params = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const userId = localStorage.getItem('userId')
  const [isShow, setIsShow] = useState(false)
  const [isFull, setIsFull] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isHide, setIsHide] = useState(true)
  const aptData = JSON.parse(sessionStorage.getItem('aptData'))
  // const [doctorCertificate, setDoctorCertificate] = useState([])
  const [doctorData, setDoctorData] = useState([])
  const [doctorAddress, setDoctorAddress] = useState()
  const [doctorAbout, setDoctorAbout] = useState()
  const [avgRating, setAvgRating] = useState(0)
  const [hospitalId, setHospitalId] = useState()
  const [ratings, setRatings] = useState([])
  const preTest = JSON.parse(sessionStorage.getItem('preTest')) || [];
  const [selectedTest, setSelectedTest] = useState(preTest);
  const [doctorEmployemnet, setDoctorEmployment] = useState()
  const [timeSlots, setTimeSlots] = useState()
  const { notAllowed } = useSelector(state => state.patient)

  async function fetchDoctorData() {
    setLoading(true)
    try {
      const result = await getApiData(`doctor/data/${params.id}`)
      if (result.success) {
        setRatings(result.rating)
        // setDoctorCertificate(result.doctorLicense?.medicalLicense)
        setAvgRating(result.avgRating)
        setDoctorData(result.user)
        setDoctorAbout(result.doctorAbout)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchDoctorData()
  }, [params])
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeIndex, setTimeIndex] = useState("");
  const times = [
    "08.00 PM", "09.00 PM", "10.00 PM", "11.00 PM", "12.00 PM",
    "01.00 AM", "02.00 AM", "03.00 AM", "04.00 AM", "05.00 AM",
    "06.00 AM", "07.00 AM"
  ];


  const generateNextDates = (numDays) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dates = [];
    const today = new Date();

    for (let i = 0; i < numDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = daysOfWeek[date.getDay()];
      const monthName = months[date.getMonth()];
      const dayNum = date.getDate();

      dates.push({ day: dayName, date: `${monthName} ${dayNum}` });
    }

    return dates;
  };
  const [dates] = useState(generateNextDates(15));

  const today = new Date();

  const getSelectedDate = () => {
    const selected = dates[activeIndex];
    if (!selected) return null;

    const [month, day] = selected.date.split(" ");
    const year = new Date().getFullYear();
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

    return new Date(year, monthIndex, Number(day));
  };

  const selectedDateObj = getSelectedDate();



  const [occupiedSlots, setOccupiedSlots] = useState([]);

  const fetchOccupiedSlots = async (dateObj) => {
    try {
      const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
      const res = await getApiData(`doctor/occupied-slots/${params.id}/${dateStr}`);
      if (res.success) {
        setOccupiedSlots(res.occupiedTimes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const res = searchParams.get('hospital') ? await getApiData(`api/hospital-doctor/time-slot/${params.id}/${hospitalId}`) :
        await getApiData(`doctor/time-slot/${params.id}`);
      if (res.success) {
        setTimeSlots(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  // Fetch occupied slots whenever the date changes
  useEffect(() => {
    if (selectedDateObj) {
      // fetchOccupiedSlots(selectedDateObj);
    }
    fetchTimeSlots()
  }, [activeIndex, params.id, doctorEmployemnet]);


  const handleBook = async (e) => {
    e.preventDefault();
    if (!timeIndex) {
      toast.error("Please select a time");
      return;
    }
    if (notAllowed) {
      return toast.error("Please verify your kyc")
    }

    if (!dates[activeIndex]) {
      toast.error("Please select a date");
      return;
    }
    if (!userId) {
      navigate('/login')
      return;
    }
    setLoading(true)
    try {
      // 1️⃣ Prepare test IDs

      // 2️⃣ Parse selected date
      const selectedDateObj = dates[activeIndex];
      const [month, day] = selectedDateObj.date.split(" "); // "Dec 29"
      const year = new Date().getFullYear(); // current year

      // Convert month name to month index
      const monthIndex = new Date(`${month} 1, 2000`).getMonth(); // 0-based month

      // 3️⃣ Parse selected time ("08.00 PM")
      const [time, meridiem] = timeIndex.split(" "); // ["08.00", "PM"]
      let [hours, minutes] = time.split(".").map(Number);

      if (meridiem === "PM" && hours !== 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      // 4️⃣ Create JS Date object
      const appointmentDate = new Date(year, monthIndex, Number(day), hours, minutes);

      // 5️⃣ Prepare payload
      const data = {
        fees: hospitalId ? doctorEmployemnet?.fees : doctorAbout?.fees,
        doctorId: params.id,
        date: appointmentDate, // Date type
        patientId: userId
      };
      if (hospitalId) {
        data.hospitalId = hospitalId
      }
      if (aptData) {
        data.appointmentId = aptData?._id
        const response = await updateApiData("appointment/doctor", data);
        if (response.success) {
          sessionStorage.removeItem('aptData')
          toast.success("Appointment updated successfully!");
          setIsHide(false)
        } else {
          toast.error(response.message || "Booking failed");
        }
      } else {
        const response = await securePostData("appointment/doctor", data);
        if (response.success) {
          toast.success("Appointment booked successfully!");
          setIsHide(false)
        } else {
          toast.error(response.message || "Booking failed");
        }
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Something went wrong while booking appointment");
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    if (!aptData || !dates.length) return;
    const appointmentDate = new Date(aptData.date);

    /* ---------- DATE MATCH ---------- */
    const aptDay = appointmentDate.getDate();
    const aptMonth = appointmentDate.getMonth();
    const dateIndex = dates.findIndex(d => {
      const [monthName, day] = d.date.split(" ");
      const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
      return (
        Number(day) === aptDay &&
        monthIndex === aptMonth
      );
    });
    if (dateIndex !== -1 && activeIndex === 0) {
      setActiveIndex(dateIndex);
    }

    /* ---------- TIME MATCH ---------- */
    let hours = appointmentDate.getHours();
    const minutes = appointmentDate.getMinutes();

    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const formattedTime = `${String(hours).padStart(2, "0")}.${String(minutes).padStart(2, "0")} ${meridiem}`;

    if (times.includes(formattedTime)) {
      setTimeIndex(formattedTime);
    }

  }, [aptData]);

  const fetchEmployment = async () => {
    if (searchParams.get('hospital') && params.id) {
      const result = await getApiData(
        `api/hospital-doctor/employment/${searchParams.get('hospital')}/${params.id}`
      );
      if (result.success) {
        setDoctorEmployment(result.employmentDetails);
      }
      setHospitalId(result?.employmentDetails?.organizationId?._id || searchParams.get('hospital'));

    }
  };
  useEffect(() => {

    fetchEmployment();
  }, [searchParams, params]);

  const formatTime = (time24) => {
    const [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${String(hour).padStart(2, "0")}.${String(m).padStart(2, "0")} ${ampm}`;
  };
  const isFutureTime = (time24, selectedDateObj) => {
    const [h, m] = time24.split(":").map(Number);
    const slotDate = new Date(selectedDateObj);
    slotDate.setHours(h, m, 0, 0);
    return slotDate > new Date();
  };
  const dayMap = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };
  const selectedDaySlots = React.useMemo(() => {
    if (!timeSlots || !selectedDateObj) return [];

    const selectedDay = dayMap[dates[activeIndex]?.day];
    const dayData = timeSlots.find(d => d.day === selectedDay);

    if (!dayData) return [];

    return dayData.slots
      .filter(slot => {
        // occupied slots remove
        const formatted = formatTime(slot.startTime);
        // if (occupiedSlots.includes(formatted)) return false;

        // past time remove (sirf aaj ke liye)
        if (
          selectedDateObj.toDateString() === new Date().toDateString()
        ) {
          return isFutureTime(slot.startTime, selectedDateObj);
        }

        return true;
      })
      .map(slot => formatTime(slot?.startTime));
  }, [timeSlots, occupiedSlots, activeIndex, selectedDateObj]);


  return (
    <>
      {isHide ? <section className="date-time-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="date-time-main-bx">
                <div className="doctor-parent-crd">
                  <div className="doctor-timing-profile">
                    <div className="doctor-mega-card">
                      <div className="doctor-pic-bx">
                        <img src={doctorData?.profileImage ?
                          `${base_url}/${doctorData?.profileImage}` : "/doctor-timing.png"} alt="" />
                        <span className="rating-crd"> <i class="fa-solid fa-star rating-icon"></i> {avgRating?.toFixed(0)} </span>
                      </div>
                      <div className="doctor-details">{console.log(doctorEmployemnet)}
                        <h4 className="innr-title fz-700">{doctorData?.name}</h4>
                        <h5>{doctorAbout?.specialty?.name} | {hospitalId ? doctorEmployemnet?.organizationId?.name : doctorAbout?.hospitalName}</h5>
                        <p><FontAwesomeIcon icon={faLocationDot} /> {doctorAbout?.fullAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="row justify-content-center mb-3">
                    <div className="col-lg-10">
                      <div className="mt-4">
                        <h5 className="innr-title mb-2">Select date</h5>
                        <div className="date-slider">
                          <Splide
                            options={{
                              perPage: 7,
                              perMove: 1,
                              gap: "12px",
                              pagination: false,
                              arrows: true,
                              type: "loop",
                              autoplay: true,
                              interval: 2000,
                              speed: 800,
                              pauseOnHover: true,
                              pauseOnFocus: false,
                              resetProgress: false,

                              breakpoints: {
                                1200: { perPage: 5 },
                                992: { perPage: 4 },
                                768: { perPage: 3 },
                                576: { perPage: 2 },
                              },
                            }}
                          >
                            {dates?.map((item, idx) => (
                              <SplideSlide key={idx}>
                                <div
                                  className={`date-card ${activeIndex === idx ? "active-date" : ""}`}
                                  onClick={() => setActiveIndex(idx)}
                                >
                                  <h6>{item.day}</h6>
                                  <p>{item.date}</p>
                                </div>
                              </SplideSlide>
                            ))}
                          </Splide>

                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row justify-content-center">
                    <div className="col-lg-10">
                      <h5 className="innr-title mb-2">Select Time</h5>
                      <div class="row time-row">
                        {selectedDaySlots?.length > 0 ? (
                          selectedDaySlots?.map((time, index) => (
                            <div className="col time-col" key={index}>
                              <div
                                className={`time-card ${timeIndex === time ? 'active-time' : ''}`}
                                onClick={() => setTimeIndex(time)}
                              >
                                {time}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12 text-center mt-3">
                            <p className="text-danger fw-semibold">
                              No slot available today
                            </p>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </div>

                <div className="date-time-footer">
                  <div className=' '>
                    <Link to={-1} className="nw-thm-btn outline">Back</Link>
                  </div>
                  <div className='d-flex gap-3'>
                    <div className="doctor-fees-content">
                      <h5>₹{hospitalId ? doctorEmployemnet?.fees : doctorAbout?.fees}</h5>
                      <p>Fees</p>
                    </div>
                    <div className=''>
                      <button onClick={handleBook} className='nw-thm-btn'>Continue</button>
                    </div>

                  </div>
                </div>

              </div>



            </div>
          </div>
        </div>

      </section> :
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
                    <li className="pending-item">Appointment Date <span className="pending-title">{dates[activeIndex].day}, {dates[activeIndex].date}</span></li>
                    <li className="pending-item"> Appointment Time  <span className="pending-title">{timeIndex}</span></li>
                    <li className="pending-item">Doctor <span className="pending-title"> {doctorData?.name} </span></li>
                  </ul>
                </div>

                <div className=" mt-4 text-center">
                  <Link to="/my-appointment" className="nw-thm-btn">My Appointment</Link>
                </div>

              </div>
            </div>
          </div>

        </section>}

    </>
  )
}

export default DateTime