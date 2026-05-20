import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Search() {
    const [query, setQuery] = useState("");
    const searchData = [
        {
            type: "Doctor",
            name: "Dr. James Harris",
            detail: "Psychologists | Mercy Hospital",
            image: "/doctor-timing.png"
        },
        {
            type: "Hospital",
            name: "Sunrise Health Clinic",
            detail: "",
            image: "/hospital-pic.jpg"
        },
        {
            type: "Doctor",
            name: "Dr. James Harris",
            detail: "Psychologists | Mercy Hospital",
            image: "/doctor-timing.png"
        },
        {
            type: "Lab",
            name: "Advance Lab Tech",
            detail: "",
            image: "/hospital-pic.jpg"
        }
    ];


    const filteredData = searchData.filter((item) =>
        (item.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (item.type || "").toLowerCase().includes(query.toLowerCase())
    );



    return (
        <>
            <section className="search-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {/* <div className="custom-frm-bx mb-0">
                                <input
                                    type="email"
                                    className="form-control filter-frm-control pe-5"
                                    id="email"
                                    placeholder="Search Doctor, Hospitals And Labs"
                                    required
                                />
                                <div className="filter-search-bx">
                                    <button className="tp-search-btn">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                </div>
                            </div> */}

                            <div className="custom-frm-bx mb-0">
                                <input
                                    type="text"
                                    className="form-control filter-frm-control pe-5"
                                    placeholder="Search Doctor, Hospitals And Labs"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />

                                <div className="filter-search-bx">
                                    <button className="tp-search-btn">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                </div>
                            </div>
                            <div className="search-result-list mt-4">
                                {filteredData.map((item, index) => (
                                    <NavLink to="">
                                        <div
                                        className={`search-card d-flex align-items-center gap-3 mb-4 ${index % 2 === 0 ? "design-one" : "design-two"
                                            }`}
                                        key={index}
                                    >
                                        <img src={item.image} className="result-img" alt="" />

                                        <div className="">
                                            <span className="result-type">{item.type}</span>
                                            <h5 className="result-title">{item.name}</h5>
                                            {item.detail && <p className="result-detail">{item.detail}</p>}
                                        </div>
                                    </div>
                                    </NavLink>
                                ))}
                            </div>


                        </div>


                    </div>
                </div>
            </section>
        </>
    )
}

export default Search