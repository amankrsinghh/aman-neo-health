import { faHome, faMicrophone, faPhone, faVideo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function VideoCall() {
  return (
    <>
     <section className="tp-breadcrum-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="text-center mb-3">
                                <h4 className="lg_title">Video Call</h4>
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
                                           Video Call
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="video-call-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="video-call-card">
                                <div className="live-chart-bx">
                                    <div className="live-tp-user">
                                        <img src="/call-pic.jpg" alt="" />
                                        <div className="user-chating-content">
                                            <h5 className="chat-title">Sunil Kumar Sharma</h5>
                                            <p className="live-title">Online</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="nw-video-calling-card">
                                    <div className="capture-bx">
                                        <img src="/calling-bner.jpg" alt="" />
                                    </div>
                                </div>

                                <div className="video-calling-btm-bx">
                                    <button className="video-calling-btn calling-btn "><FontAwesomeIcon icon={faVideo}/></button>
                                    <button className="video-calling-btn calling-btn calling-close-btn"><FontAwesomeIcon icon={faPhone}/></button>
                                    <button className="video-calling-btn calling-btn "><FontAwesomeIcon icon={faMicrophone}/></button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>

    </>
  )
}

export default VideoCall