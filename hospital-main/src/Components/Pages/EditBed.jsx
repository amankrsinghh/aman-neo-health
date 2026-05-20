
function EditBed() {
  return (
     <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <form action="">
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2">Edit Bed</h3>
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
                                                Edit Bed
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
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Floor</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>---Select Floor---</option>
                                            <option value="" selected>Floor 1</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Department</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>---Select Department---</option>
                                            <option value="" selected>Cardiology</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Room number</label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>---Select Room---</option>
                                            <option value="" selected>Room1</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Bed </label>
                                    <input
                                        type="text"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Bed"
                                        value="Bed 1"
                                    />
                                </div>

                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Bed Par Day Fees($) </label>
                                    <input
                                        type="text"
                                        className="form-control nw-frm-select"
                                        placeholder="Enter Par Day Fees"
                                        value="25"
                                    />
                                </div>

                            </div>


                            <div className="d-flex justify-content-end gap-3 nw-pharmacy-details">
                                <button type="submit" className="nw-danger-thm-btn">Delete Bed</button>
                                <button type="submit" className="nw-thm-btn ">Save</button>
                            </div>
                        </div>
                    </form>
                </div>


            </div>
        </>
  )
}

export default EditBed