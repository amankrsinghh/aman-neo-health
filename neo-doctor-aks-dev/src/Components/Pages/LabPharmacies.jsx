import { faHome } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { getApiData } from "../../Services/api"

function LabPharmacies() {
    const [data, setData] = useState('')
    async function fetchCms() {

        const result = await getApiData(`admin/cms?slug=privacy-policy&panel=doctor`)
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
                                            <a href="#" className="breadcrumb-link">
                                                <FontAwesomeIcon icon={faHome} />
                                            </a>
                                        </li>


                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Labs & pharmacies
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="about-us-section">
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
            </section> */}



            <section className="about-us-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="about-us-content">
                                <div className="neo-privacy-content">
                                    <h4>Privacy Policy </h4>
                                    <h5>NeoHealthCard™ Privacy Policy </h5>
                                </div>
                            </div>
                        </div>

                        {/* <div className="col-lg-8">
                            <div class="privacy-table">
                                <div class="row">
                                    <div class="cell label">Effective Date</div>
                                    <div class="cell value">1 JAN 2026</div>
                                </div>

                                <div class="row">
                                    <div class="cell label">Version</div>
                                    <div class="cell value">1.0</div>
                                </div>

                                <div class="row">
                                    <div class="cell label">Issued by</div>
                                    <div class="cell value">NeoHealthCard Private Limited</div>
                                </div>

                                <div class="row">
                                    <div class="cell label">Applies to</div>
                                    <div class="cell value">
                                        Website, apps, APIs, NeoMiddleware, NeoEdge, and related services
                                    </div>
                                </div>
                            </div>

                        </div> */}

                        <div className="col-lg-12">
                            <div className="privacy-policy-main-content">
                                <h4>1. Purpose and Corporate Positioning</h4>
                                <p>NeoHealthCard™ (“NeoHealthCard”, “Company”, “we”, “our”, “us”) is a digital health
                                    infrastructure platform operated by NeoHealthCard Private Limited.
                                    We are committed to protecting confidentiality, integrity, and lawful use of personal data,
                                    including highly sensitive health data.</p>

                                <p>NeoHealthCard is engineered on privacy-by-design, privacy-by-default, zero-trust security
                                    architecture, and least-privilege access governance.
                                    We do not sell identifiable personal health data, and we do not permit unauthorized secondary
                                    use.</p>
                            </div>

                            <div className="privacy-policy-main-content">
                                <h4>2. Definitions</h4>
                                <ul className="privacy-list">
                                    <li className="privacy-item">“Platform” means NeoHealthCard websites, mobile apps, portals, APIs, NeoMiddleware,
                                        NeoEdge, and associated services</li>

                                    <li className="privacy-item">“User” means any individual or entity using the Platform, including patients, clinicians,
                                        institutions, and partners.</li>
                                    <li className="privacy-item">“Personal Data” means information relating to an identified or identifiable natural person.
                                    </li>
                                    <li className="privacy-item"> “Health Data” means personal data related to an individual’s physical or mental health,
                                        medical history, diagnostics, prescriptions, clinical notes, or related records.
                                    </li>
                                    <li className="privacy-item"> “Processing” means collection, recording, storage, use, disclosure, transmission, analysis,
                                        retention, deletion, or any operation performed on data</li>
                                    <li className="privacy-item">“Consent” means explicit, informed, granular authorization provided by a user (where
                                        required) for a specific purpose and duration.</li>

                                </ul>
                            </div>


                            <div className="privacy-policy-main-content">
                                <h4>3. Scope</h4>
                                <p className="pb-0">This Privacy Policy applies to all Processing performed by the Company in connection with:</p>
                                <p className="pb-0">(a) creation and use of accounts; (b) secure exchange and storage of healthcare information;</p>
                                <p className="pb-0">(c) interoperability services (HL7 / FHIR / DICOM); (d) consent and access governance; </p>
                                <p className="pb-0">(e) security monitoring and fraud prevention; and (f) customer support and compliance.</p>
                                <p className="pb-0">This Policy applies globally, subject to mandatory local legal requirements that may apply to
                                    users or deployments.</p>

                            </div>


                            <div className="privacy-policy-main-content">
                                <h4 className="pb-3">4. Categories of Data We Process </h4>
                                <h5>4.1 Identity and Verification Data </h5>
                                <ul className="privacy-list">
                                    <li className="privacy-item">Name, email address, phone number, and account identifiers</li>
                                    <li className="privacy-item">Government-issued identifiers only where legally required or contractually necessary</li>
                                    <li className="privacy-item">Professional credentials (e.g., license numbers) for clinician verification
                                    </li>
                                    <li className="privacy-item"> Institutional registration, accreditation, and compliance documentation
                                    </li>


                                </ul>


                            </div>

                            <div className="privacy-policy-main-content">

                                <h5>4.2 Health and Clinical Data (Highly Sensitive)</h5>
                                <ul className="privacy-list">
                                    <li className="privacy-item">Medical records, history, and clinical summaries
                                    </li>
                                    <li className="privacy-item">Laboratory results and reports</li>
                                    <li className="privacy-item">Imaging and related metadata (including DICOM)
                                    </li>
                                    <li className="privacy-item"> Prescriptions and medication history
                                    </li>
                                    <li className="privacy-item"> Clinical notes and encounter data
                                    </li>
                                    <li className="privacy-item"> Device-generated health telemetry where integrated
                                    </li>
                                    <li className="privacy-item"> AI-generated annotations/summaries (decision-support context)
                                    </li>


                                </ul>


                            </div>

                            <div className="privacy-policy-main-content">
                                <h5>4.3 Technical, Security, and Usage Data</h5>
                                <ul className="privacy-list">
                                    <li className="privacy-item">IP address, device identifiers, browser/app metadata

                                    </li>
                                    <li className="privacy-item">Authentication logs, session activity, timestamps</li>
                                    <li className="privacy-item">Access logs and audit trails for data governance
                                    </li>
                                    <li className="privacy-item"> API request metadata and rate-limit/security events
                                    </li>
                                </ul>


                            </div>

                        </div>

                    </div>
                </div>
            </section>



        </>
    )
}

export default LabPharmacies