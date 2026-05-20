import { faHome } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { getApiData } from "../../Services/api"

function Faq() {
    const [faqData, setFaqData] = useState('')
    async function fetchFaq() {

        const result = await getApiData(`api/admin/faqs`)
        if (result.success) {
            setFaqData(result.data)
        }
    }
    useEffect(() => {
        fetchFaq()
    }, [])

    return (
        <>
            <section className="tp-breadcrum-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="text-center mb-3">
                                <h4 className="lg_title">Faq</h4>
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
                                            Faq
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq-section">
                <div className="container">
                    <div className="row">
                        <div className="text-center">
                            <h3 className="heading-grad">Frequently Asked Question</h3>
                        </div>
                        {faqData?.length > 0 && faqData?.map((item, key) =>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3" key={key}>
                                <div className="faq-content-bx">
                                    <div className="accordion my-3" id="faqAccordion">

                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button
                                                    className={`accordion-button faq-btn ${key !== 0 ? "collapsed" : ""}`}
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#faq-${key}`}
                                                >
                                                    {item?.question}
                                                </button>
                                            </h2>

                                            <div
                                                id={`faq-${key}`}
                                                className={`accordion-collapse collapse ${key === 0 ? "show" : ""}`}
                                                data-bs-parent="#faqAccordion"
                                            >
                                                <div className="accordion-body">
                                                    {item?.answer}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                </div>

            </section>
        </>
    )
}

export default Faq