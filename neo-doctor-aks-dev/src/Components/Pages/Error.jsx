import { Link } from "react-router-dom"

function Error() {
  return (
    <>
    <section className="error-section">
      <div className="container">
      <div className="row text-center">
        <div className="col-lg-12">
          <div className="error-picture-bx">
            <img src="/error-pic.png" alt="" />
          </div>
          <div>
            <h4 className="title">Oops! That Page Can’t Be Found.</h4>
            <p className="new_para">The page you are looking for was never existed.</p>
            <Link to='/' className="nw-thm-btn">Back to home</Link>
          </div>
        </div>
      </div>
    </div>
    </section>
    </>
  )
}

export default Error