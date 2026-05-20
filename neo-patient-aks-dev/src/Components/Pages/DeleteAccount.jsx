import { faHome, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { getApiData } from "../../Services/api"

function DeleteAccount() {
    const [data, setData] = useState('')
    async function fetchCms() {

        const result = await getApiData(`admin/cms?slug=about-us`)
        if (result.success) {
            setData(result.data[0])
        }
    }
    useEffect(() => {
        fetchCms()
    }, [])
    return (
        <>
            <section className="tp-breadcrum-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="text-center mb-3">
                                <h4 className="lg_title">Delete Account</h4>
                            </div>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                <FontAwesomeIcon icon={faHome} />
                                            </a>
                                        </li>


                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Account Delete
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-us-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="about-us-content">
                                <div className="custom-frm-bx">
                                    <label>Name</label>
                                    <input
                                        type="number"
                                        className="form-control new-control-frm px-5"
                                        placeholder="Enter mobile number"
                                        name="name"
                                    />
                                    <div className="contact-add-icon">
                                        <span className="nw-contact-icon">
                                            <FontAwesomeIcon icon={faPhone} />
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 text-center">
                                    <button type="submit" className="nw-thm-btn w-10">
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default DeleteAccount