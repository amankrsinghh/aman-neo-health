import { faCheck, faChevronLeft, faLocationDot, faRoute, } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import React from 'react'
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getApiData, securePostData, updateApiData } from "../../Services/api";
import { useSelector } from "react-redux";
import { getDistanceInKm } from "../../Services/globalFunction";
import base_url from "../../baseUrl";
import Autocomplete from "react-google-autocomplete";
import Loader from "../../Loader/Loader";
function BookAppointment() {
    const params = useParams()
    const navigate = useNavigate()
    const lat = localStorage.getItem('lat')
    const long = localStorage.getItem('long')
    const [loading, setLoading] = useState(false)
    const [doctorAbout, setDoctorAbout] = useState()
    const [avgRating, setAvgRating] = useState(0)
    const userId = localStorage.getItem('userId')
    const [timeSlots, setTimeSlots] = useState()
    const { } = useSelector(state => state.patient)
    const [selectedLocation, setSelectedLocation] = useState('');
    const locations = [
        "Jaipur, India",
        "Delhi, India",
        "Mumbai, India",
        "Pune, India",
        "Kolkata, India"
    ];
    const [activeIndex, setActiveIndex] = useState(0);
    const [doctorData, setDoctorData] = useState([])
    const [timeIndex, setTimeIndex] = useState(0);
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
    const convertTimeToDate = (timeStr, dateObj) => {
        const [time, meridiem] = timeStr.split(" ");
        let [hours, minutes] = time.split(".").map(Number);

        if (meridiem === "PM" && hours !== 12) hours += 12;
        if (meridiem === "AM" && hours === 12) hours = 0;

        const date = new Date(dateObj);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };
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

    const availableTimes = times.filter((time) => {
        // agar selected date aaj hai
        if (
            selectedDateObj &&
            selectedDateObj.toDateString() === today.toDateString()
        ) {
            return convertTimeToDate(time, selectedDateObj) > today;
        }

        // future date → saare times allowed
        return true;
    });

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
            const res = await getApiData(`doctor/time-slot/${params.id}`);
            if (res.success) {
                setTimeSlots(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (selectedDateObj) {
            // fetchOccupiedSlots(selectedDateObj);
        }
        fetchTimeSlots()
    }, [activeIndex, params.id]);


    const filteredTimes = availableTimes.filter(time => !occupiedSlots.includes(time));

    const handleBook = async (e) => {
        e.preventDefault();
        if (!timeIndex) {
            toast.error("Please select a time");
            return;
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
                fees: doctorAbout?.fees,
                doctorId: params.id,
                date: appointmentDate, // Date type
                patientId: userId
            };

            const response = await securePostData("appointment/doctor", data);
            if (response.success) {
                toast.success("Appointment booked successfully!");
                const data = { name: doctorData?.name, date: appointmentDate }
                sessionStorage.setItem('newAptData', JSON.stringify(data))
                navigate('/congratulations')
            } else {
                toast.error(response.message || "Booking failed");
            }

        } catch (error) {
            console.error("Error booking appointment:", error);
            toast.error("Something went wrong while booking appointment");
        } finally {
            setLoading(false)
        }
    };
    async function fetchDoctorData() {
        setLoading(true)
        try {
            const result = await getApiData(`doctor/data/${params.id}`)
            if (result.success) {
                // setRatings(result.rating)
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
                if (occupiedSlots.includes(formatted)) return false;

                // past time remove (sirf aaj ke liye)
                if (
                    selectedDateObj.toDateString() === new Date().toDateString()
                ) {
                    return isFutureTime(slot.startTime, selectedDateObj);
                }

                return true;
            })
            .map(slot => formatTime(slot.startTime));
    }, [timeSlots, occupiedSlots, activeIndex, selectedDateObj]);


    return (
        <>
            {loading ?<Loader/>
            :<section className="near-section">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="d-flex aling-items-center gap-3">
                                <div className="">
                                    <Link to="/near-by-doctor" className="back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                </div>
                                <div className="dropdown">
                                    <h6>Select Location</h6>
                                    <div className="custom-frm-bx">
                                        <Autocomplete
                                        apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                                        placeholder="Type city or location..."
                                        className="form-control new-control-frm"
                                        options={{
                                            types: ["(cities)"],   // 👈 only cities
                                            componentRestrictions: { country: "in" } // optional
                                        }}
                                        onPlaceSelected={(place) => {
                                            const city =
                                                place.address_components?.find(c =>
                                                    c.types.includes("locality")
                                                )?.long_name;

                                            setSelectedLocation(city || place.formatted_address);
                                        }}

                                    />
                                    </div>

                                    {/* <a
                                        href="#"
                                        className="dropdown-toggle text-black"
                                        id="acticonMenu1"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <FontAwesomeIcon icon={faLocationDot} /> {selectedLocation}
                                    </a>

                                    <ul
                                        className="dropdown-menu dropdown-menu-end mt-2 nw-location-bx"
                                        aria-labelledby="acticonMenu1"
                                    >

                                        {locations.map((loc, index) => (
                                            <li
                                                key={index}
                                                className="prescription-item"
                                                onClick={() => setSelectedLocation(loc)}
                                            >
                                                <div className="prescription-nav d-flex justify-content-between align-items-center">
                                                    {loc}

                                                    {selectedLocation === loc && (
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    )}
                                                </div>
                                            </li>
                                        ))}

                                    </ul> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="doctor-review-bx mt-3">
                                <h5 className="heading-grad text-center">Book Appointment </h5>
                                <div className="doctor-submit-bx">
                                    <p>Your profile has been submitted and is under review by the doctor.
                                        Approval is required before your account becomes active.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="book-appointment-bx">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="booking-doctor-card">
                                            <div className="nw-appointment-mega-card text-center">
                                                <div className="nw-appointment-doctor-bx">
                                                    <img src={doctorData?.profileImage ?
                                                        `${base_url}/${doctorData?.profileImage}` : "/doctor-timing.png"} alt="" />
                                                    <span className="select-doctor"> <i class="fa-solid fa-check nw-verify-icon"></i>  </span>
                                                </div>
                                                <div className="doctor-details mt-2">
                                                    <h4 className="innr-title fz-700">{doctorData?.name}</h4>
                                                    <h5>{doctorAbout?.specialty?.name} <span className="slash-title">|</span> {doctorAbout?.hospitalName}</h5>
                                                    <p><FontAwesomeIcon icon={faRoute} /> {getDistanceInKm(lat, long,
                                                        doctorAbout?.lat, doctorAbout?.long)} km</p>
                                                    <p><FontAwesomeIcon icon={faLocationDot} /> {doctorAbout?.fullAddress}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="mt-4">
                                            <h5 className="innr-title mb-3">Select date</h5>
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

                                        <div className="my-3">
                                            <h5 className="innr-title mb-3">Select Time</h5>
                                            <div class="slot-grid">
                                                {selectedDaySlots?.length > 0 && (
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
                                                ) 
                                                 }

                                                </div>
                                                {selectedDaySlots?.length == 0 && <div className="col-lg-12 text-center mt-3">
                                                        <p className="text-danger fw-semibold">
                                                            No slot available today
                                                        </p>
                                                    </div>}


                                        </div>


                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 px-0">
                            <div className="fix-bottom-bx">
                                <div className="text-end nw-item-bx">
                                    <button className="nw-thm-btn" onClick={handleBook}>Booked Appointment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>}
        </>
    )
}

export default BookAppointment