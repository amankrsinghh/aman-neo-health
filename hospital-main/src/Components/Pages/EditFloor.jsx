import React from 'react'

function EditFloor() {
  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <form action="">
          <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="innr-title mb-2">Edit Floor</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#" className="breadcrumb-link">
                          Dashboard
                        </a>
                      </li>

                      <li className="breadcrumb-item">
                        <a href="#" className="breadcrumb-link">
                          Bed management
                        </a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Edit Floor
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="new-panel-card">
          <form action="">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="custom-frm-bx">
                  <label htmlFor="">Floor</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter  Floor" value="1"
                  />
                </div>
                <div className="d-flex justify-content-end gap-3 nw-pharmacy-details">
                  <button type="submit" className="nw-danger-thm-btn">Delete Floor</button>
                  <button type="submit" className="nw-thm-btn ">Save</button>
                </div>
              </div>
            </div>
          </form>
        </div>


      </div>
    </>
  )
}

export default EditFloor