import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { BsCapsule } from "react-icons/bs";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getApiData, securePostData, updateApiData } from "../../Services/api";
import Loader from "../../Loader/Loader";
import { toast } from "react-toastify";
import base_url from "../../baseUrl";
import { useSelector } from "react-redux";


function TestDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const [searchParams] = useSearchParams()
  const [isShow, setIsShow] = useState(false)
  const [isFull, setIsFull] = useState(false)
  const [loading, setLoading] = useState(false)
  const [labCertificate, setLabCertificate] = useState([])
  const aptData = JSON.parse(sessionStorage.getItem('aptData'))
  const [labData, setLabData] = useState([])
  const [labAddress, setLabAddress] = useState()
  const [labImage, setLabImage] = useState()
  const [avgRating, setAvgRating] = useState(0)
  const [ratings, setRatings] = useState([])
  const [labTest, setLabTest] = useState([])
  const preTest = JSON.parse(sessionStorage.getItem('preTest')) || [];
  const [selectedTest, setSelectedTest] = useState(preTest);
  const { notAllowed } = useSelector(state => state.patient)
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedSubCats, setSelectedSubCats] = useState(preTest);
  async function fetchLabData() {
    setLoading(true)
    try {
      const result = await getApiData(`lab/data/${params.id || aptData?.labId?._id}`)
      if (result.success) {
        setRatings(result.rating)
        setLabCertificate(result.labLicense?.labCert)
        setAvgRating(result.avgRating)
        setLabData(result.user)
        setLabImage(result.labImage)
        setLabAddress(result.labAddress)
        setLabTest(result.labTest)
      }
    } catch (error) {

    } finally {
      setLoading(false)
      fetchTimeSlots()
    }
  }
  const fetchTimeSlots = async () => {
    try {
      const res = await getApiData(`lab/time-slot/${labData?.userId}`);
      if (res.success) {
        setTimeSlots(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  async function fetchHospitalData() {
    setLoading(true)
    try {
      const result = await getApiData(`api/hospital/profile-detail/${params.id || aptData?.labId?._id}`)
      if (result.success) {
        setRatings(result.rating)
        const cert = result.profile.certificates?.filter(c => c.certificateType == 'accreditation')
        setLabCertificate(cert)
        setAvgRating(result.avgRating)
        setLabData(result.profile.basic)
        setLabImage(result.profile.images.thumbnail[0])
        setLabAddress(result.profile.address)
        setLabTest(result.labTest)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (searchParams.get('type') === 'hospital') {
      fetchHospitalData()
    } else {
      fetchLabData()

    }
  }, [params])


  const [activeIndex, setActiveIndex] = useState(0);
  const [timeIndex, setTimeIndex] = useState(0);



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
  const handleBook = async (e) => {
    e.preventDefault();

    if (!userId) {
      navigate('/login');
      return;
    }

    if (notAllowed) {
      return toast.error("Please verify your kyc");
    }

    if (!selectedSubCats || selectedSubCats.length === 0) {
      toast.error("Please select at least one test");
      return;
    }

    if (!timeIndex) {
      toast.error("Please select a time");
      return;
    }

    if (!dates[activeIndex]) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);

    try {
      // ✅ Unique testIds
      const testId = [...new Set(selectedSubCats.map(i => i.testId))]

      // ✅ Total fees
      const totalFees = selectedSubCats.reduce((sum, i) => sum + i.price, 0)

      // ✅ Schema ke according tests array banana
      // selectedSubCats = [{ catId, subCatId, testId, price }, ...]
      // Group karo catId ke basis pe
      const testsMap = {}
      selectedSubCats.forEach(item => {
        if (!testsMap[item.catId]) {
          testsMap[item.catId] = []
        }
        testsMap[item.catId].push(item.subCatId)
      })

      const tests = Object.entries(testsMap).map(([category, subCat]) => ({
        category,
        subCat
      }))
      // tests = [{ category: catId, subCat: [subCatId, ...] }]

      // ✅ Date parsing
      const selectedDateObj = dates[activeIndex]
      const [month, day] = selectedDateObj.date.split(" ")
      const year = new Date().getFullYear()
      const monthIndex = new Date(`${month} 1, 2000`).getMonth()

      const [time, meridiem] = timeIndex.split(" ")
      let [hours, minutes] = time.split(".").map(Number)

      if (meridiem === "PM" && hours !== 12) hours += 12
      if (meridiem === "AM" && hours === 12) hours = 0

      const appointmentDate = new Date(year, monthIndex, Number(day), hours, minutes)

      // ✅ Final payload
      const data = {
        fees: totalFees,
        testId,
        tests,        // [{ category, subCat[] }]
        labId: params.id,
        date: appointmentDate,
        patientId: userId,
        doctorId: sessionStorage.getItem('doctorId') || null,
        doctorAp: sessionStorage.getItem('doctorAp') || null
      }

      if (aptData) {
        data.appointmentId = aptData?._id

        const response = await updateApiData("appointment/lab/reschedule", data)
        if (response.success) {
          toast.success("Appointment updated successfully!")
          setIsShow(true)
        } else {
          toast.error(response.message || "Booking failed")
        }
      } else {
        const response = await securePostData("appointment/lab", data)
        if (response.success) {
          toast.success("Appointment booked successfully!")
          setIsShow(true)
        } else {
          toast.error(response.message || "Booking failed")
        }
      }

    } catch (error) {
      console.error("Error booking appointment:", error)
      toast.error("Something went wrong while booking appointment")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {

    fetchTimeSlots()
  }, [activeIndex, params.id,]);
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

    if (formattedTime?.includes(formattedTime)) {
      setTimeIndex(formattedTime);
    }

  }, [aptData]);
  const dayMap = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };
  const formatTime = (time24) => {
    const [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${String(hour).padStart(2, "0")}.${String(m).padStart(2, "0")} ${ampm}`;
  };
  const getSelectedDate = () => {
    const selected = dates[activeIndex];
    if (!selected) return null;

    const [month, day] = selected.date.split(" ");
    const year = new Date().getFullYear();
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

    return new Date(year, monthIndex, Number(day));
  };

  const selectedDateObj = getSelectedDate();
  const selectedDaySlots = React.useMemo(() => {
    if (!timeSlots || !selectedDateObj) return [];

    const selectedDay = dayMap[dates[activeIndex]?.day];
    const dayData = timeSlots.find(d => d.day === selectedDay);

    if (!dayData) return [];

    return dayData.slots
      .filter(slot => {
        // occupied slots remove
        const formatted = formatTime(slot.startTime);


        // past time remove (sirf aaj ke liye)
        if (
          selectedDateObj.toDateString() === new Date().toDateString()
        ) {
          return isFutureTime(slot.startTime, selectedDateObj);
        }

        return true;
      })
      .map(slot => formatTime(slot?.startTime));
  }, [timeSlots, activeIndex, selectedDateObj]);
  const grouped = preTest.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
  const price = selectedSubCats?.reduce((sum, item) => sum + Number(item.price || 0), 0)

  return (
    <>
      {loading ? <Loader /> :
        isShow ?
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
                      <li className="pending-item">
                        Appointment Date
                        <span className="pending-title">
                          {dates[activeIndex].day}, {dates[activeIndex].date}
                        </span>
                      </li>
                      <li className="pending-item"> Appointment Time  <span className="pending-title">{timeIndex}</span></li>
                      <li className="pending-item">Lab <span className="pending-title">{labData?.name}</span></li>
                    </ul>
                  </div>
                  <div className=" mt-4 text-center">
                    <Link to={`/my-appointment?activeTab=lab`} className="nw-thm-btn">My Appointment</Link>
                  </div>
                </div>
              </div>
            </div>

          </section> :
          <section className="date-time-section">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="date-time-main-bx">
                    <div className="doctor-parent-crd">
                      <div className="doctor-timing-profile mb-3">
                        <div className="doctor-mega-card">
                          <div className="doctor-pic-bx">
                            <img src={labImage?.thumbnail ?
                              `${base_url}/${labImage?.thumbnail}` : "/lab-pic.png"} alt="" />
                            <span className="rating-crd"> <i class="fa-solid fa-star rating-icon"></i> {avgRating} </span>
                          </div>
                          <div className="doctor-details">
                            <h4 className="innr-title fz-700">{labData?.name}</h4>

                            <p><FontAwesomeIcon icon={faLocationDot} />{labAddress?.fullAddress}</p>
                          </div>
                        </div>
                      </div>


                      <div className="row justify-content-center mb-3">
                        <div className="col-lg-10">
                          <h5 className="innr-title mb-2">Test Details</h5>
                          {Object.keys(grouped).map((cat, i) => (
                            <div key={i}>
                              <div className="row">{cat}</div>

                              {grouped[cat].map((s, idx) => (
                                <div className="medicine-card" key={idx}>
                                  <div className="left-icon">
                                    <img src="/lab-tube.svg" alt="" />
                                    <div className="report-amount-bx doctor-fees-content">
                                      <h5>{s.name}</h5>
                                      <p>₹ {s.price}</p>
                                    </div>
                                  </div>

                                  <label className="check-container">
                                    <input
                                      type="checkbox"
                                      checked={selectedSubCats.some(
                                        x => x.subCatId === s.subCatId
                                      )}
                                      onChange={(e) => {
                                        setSelectedSubCats(prev => {
                                          if (e.target.checked) {
                                            return [...prev, s];
                                          } else {
                                            return prev.filter(
                                              x => x.subCatId !== s.subCatId
                                            );
                                          }
                                        });
                                      }}
                                    />
                                    <span className="checkmark"></span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          ))}

                          <div className="mt-3">
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
                                {dates.map((item, idx) => (
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

                      <div className="row justify-content-center mb-5">
                        <div className="col-lg-10">
                          <h5 className="innr-title mb-2">Select Time</h5>
                          <div className="row g-2 time-row">
                            {selectedDaySlots.map((time, index) => (
                              <div className="col time-col" key={index}>
                                <div
                                  className={`time-card ${timeIndex === time ? 'active-time' : ''}`}
                                  onClick={() => setTimeIndex(time)} // click handler to select time
                                >
                                  {time}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>


                    </div>

                    <div className="date-time-footer">
                      <div className=' '>
                        <Link to={-1} className="nw-thm-btn outline">Back</Link>
                      </div>
                      <div className='d-flex gap-3 '>
                        <div className="doctor-fees-content">
                          <h5>₹ {price}</h5>
                          <p>Fees</p>
                        </div>
                        <div className=''>
                          <button type="button" onClick={handleBook} className='nw-thm-btn'>Continue</button>
                        </div>

                      </div>
                    </div>

                  </div>



                </div>
              </div>
            </div>

          </section>}

    </>
  )
}

export default TestDetails