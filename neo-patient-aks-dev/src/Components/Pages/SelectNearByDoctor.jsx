import { faCheck, faChevronLeft, faLocationDot, faRoute } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import { getApiData } from "../../Services/api";
import base_url from "../../baseUrl";
import { getDistanceInKm } from "../../Services/globalFunction";
import { Link } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";

function SelectNearByDoctor() {

  const [myLatLong, setMyLatLong] = useState({ lat: null, long: null })
  const [selectedId, setSelectedId] = useState()

  const [selectedLocation, setSelectedLocation] = useState('');

  const locations = [
    "Jaipur, India",
    "Delhi, India",
    "Mumbai, India",
    "Pune, India",
    "Kolkata, India"
  ];
  const [doctors, setDoctors] = useState([])
  async function fetchDoctor() {
    try {
      const response = await getApiData(`patient/near-by-doctor?lat=${myLatLong.lat}&long=${myLatLong.long}&location=${selectedLocation}`)
      if (response.success) {
        setDoctors(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchDoctor()
  }, [myLatLong,selectedLocation])
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLatLong(prev => ({
            ...prev,
            lat: position.coords.latitude,
            long: position.coords.longitude
          }));
          localStorage.setItem('lat', position.coords.latitude)
          localStorage.setItem('long', position.coords.longitude)
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);
  return (
    <>
      <section className="near-section">
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="d-flex aling-items-center gap-3">

                <div className="">
                  <Link to={`/my-appointment`} className="back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                </div>
                <div className="dropdown">
                  <h6>Select Location</h6> 

                 <div className="custom-frm-bx mb-0">
                   <Autocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                    placeholder="Type city or location..."
                    className="form-control new-control-frm"
                    options={{
                      types: ["(cities)"], 
                      componentRestrictions: { country: "in" }
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
                <h5 className="heading-grad text-center">Select Near By Doctor</h5>
                <div className="doctor-submit-bx">
                  <p>Your profile has been submitted and is under review by the doctor.
                    Approval is required before your account becomes active.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row nearest-doctor-box">

            {doctors?.length > 0 ?
              doctors?.map((item, key) =>
                <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={key}>
                  <div className="near-doctor-card ">
                    <label className="nw-radio-wrapper">
                      <input type="radio" name="doctorSelect" checked={item?.userId?._id == selectedId}
                        onChange={() => setSelectedId(item.userId?._id)} />
                      <span className="nw-custom-radio"></span>
                    </label>
                    <img src={item?.userId?.doctorId?.profileImage ? `${base_url}/${item?.userId?.doctorId?.profileImage}` : "/date-time-img.png"} className="doctor-img" />

                    <div className="near-doctor-content">
                      <h5 className="">{item?.userId?.name}</h5>
                      <p className="">{item?.specialty?.name} <span className="slash-title"> |  </span> {item?.hospitalName}</p>

                      <div className="doctor-find-box">
                        <h6 className="near-by-location mb-0"><FontAwesomeIcon icon={faRoute} /> {getDistanceInKm(myLatLong?.lat, myLatLong?.long,
                          item?.lat, item?.long)} km</h6>
                        <h6 className="near-by-location mb-0"><FontAwesomeIcon icon={faLocationDot} /> {item?.fullAddress}</h6>
                      </div>
                    </div>
                  </div>
                </div>) : 
                <>
                <div>
                  <p className="text-center">'No doctor find near you'</p>
                </div>
                </>
                }

            {/* <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="near-doctor-card ">
                <label className="nw-radio-wrapper">
                  <input type="radio" name="doctorSelect" />
                  <span className="nw-custom-radio"></span>
                </label>
                <img src="/date-time-img.png" className="doctor-img"/>

                <div className="near-doctor-content">
                  <h5 className="">Dr. James Harris</h5>
                  <p className="">Psychologist <span className="slash-title"> |  </span> Mercy Hospital</p>

                  <div className="d-flex align-items-center justify-content-between gap-lg-3 gap-sm-2">
                    <span className="near-by-location"><FontAwesomeIcon icon={faRoute} /> 2.5 km</span>
                    <span className="near-by-location"><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</span>
                  </div>
                </div>
              </div>
            </div> */}

          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-12 px-0">
              {/* <div className="fix-bottom-bx">
                <div className="text-start nw-item-bx">
                  <Link to={`/book-appointment/${selectedId}`} className="nw-thm-btn">Skip</Link>
                </div>
              </div> */}
              <div className="fix-bottom-bx">
                <div className="text-end d-flex justify-content-around">
                  <Link to={`/my-appointment`} className="nw-thm-btn outline">Skip</Link>
                  <Link to={`/book-appointment/${selectedId}`} className="nw-thm-btn">Submit & Next</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  )
}

export default SelectNearByDoctor