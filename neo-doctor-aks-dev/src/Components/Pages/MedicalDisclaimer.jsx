import { faHome } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { getApiData } from "../../Services/api"
import { NavLink } from "react-router-dom"

function MedicalDisclaimer() {
    const [data, setData] = useState('')
    async function fetchCms() {

        const result = await getApiData(`admin/cms?slug=medical-disclaimer&panel=doctor`)
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
                                <h4 className="lg_title">{data?.title}</h4>
                            </div>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/" className="breadcrumb-link">
                                                <FontAwesomeIcon icon={faHome} />
                                            </NavLink>
                                        </li>


                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Medical Disclaimer
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
                                <div
                                    className="about-para"
                                    dangerouslySetInnerHTML={{ __html: data?.content }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MedicalDisclaimer