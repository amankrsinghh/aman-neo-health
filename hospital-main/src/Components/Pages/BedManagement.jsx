import { TbGridDots } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaBed, FaPlusCircle } from "react-icons/fa";
import { PiTagChevronFill } from "react-icons/pi";
import {
  faChevronRight,
  faCircleXmark,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import { FaPlusSquare } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AllotmentPayment from "./AllotmentPayment";
import DischargePatient from "./DischargePatient";
import Loader from "../Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import DailyIPDNotes from "./DailyIPDNotes";
import AddAllotmentTest from "./AddAllotmentTest";
import DepartmentTransfer from "./DepartmentTransfer";
import { fetchEmpDetail } from "../../redux/features/userSlice";
import { Hospital } from "lucide-react";
import HospitalTransfer from "./HospitalTransfer";
import BedInvoice from "../../All Template file/Bed invoice";
function BedManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedBed, setSelectedBed] = useState(null);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false)
  const [openDailyNotes, setOpenDailyNotes] = useState(false);
  const { permissions, isOwner } = useSelector(state => state.user)
  const fetchBedManagement = async () => {
    try {
      const res = await api.get("/bed/management/list");
      setFloors(res.data.data);
    } catch (err) {
      toast.error("Failed to load bed management");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBedManagement();
  }, []);
  const openBedModal = (bed) => {
    setSelectedBed(bed);
    const modalId = bed.status === "Booked" ? "bed-Option" : "bed-Not";
    const modal = new window.bootstrap.Modal(document.getElementById(modalId));
    modal.show();
  };
  const handleDeleteBed = async () => {
    if (!selectedBed) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this bed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await api.delete(`/bed/bed/${selectedBed._id}`);
      if (res.data.success) {

        toast.success("Bed deleted successfully");
      } else {
        toast.error(res.data.message)
      }
      // modal close
      window.bootstrap.Modal.getInstance(
        document.getElementById(
          selectedBed.status === "Booked" ? "bed-Option" : "bed-Not"
        )
      )?.hide();
      setSelectedBed(null);
      fetchBedManagement(); // 🔄 refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete bed");
    }
  };
  const closeAnyModal = () => {
    document.querySelectorAll(".modal.show").forEach((modalEl) => {
      window.bootstrap.Modal.getInstance(modalEl)?.hide();
    });
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  };
  const handleEditBed = () => {
    if (!selectedBed) return;
    closeAnyModal();
    navigate(`/edit-bed/${selectedBed._id}`);
  };

  const handleallotmentAdd = () => {
    if (!selectedBed) return;
    closeAnyModal();
    if (searchParams.get('patientId')) {
      navigate(`/allotment/${selectedBed._id}?patientId=${searchParams.get('patientId')}`)
    } else {
      navigate(`/allotment/${selectedBed._id}`);
    }
  };

  const handleEditAllotment = () => {
    if (!selectedBed?.allotmentId) {
      toast.error("Allotment not found");
      return;
    }

    closeAnyModal();
    setTimeout(() => {
      navigate(`/edit-allotment/${selectedBed.allotmentId}`);
    }, 150);
  };


  const handleAddPrescription = () => {
    if (!selectedBed?.allotmentId) {
      toast.error("Allotment not found");
      return;
    }

    closeAnyModal();
    navigate(
      `/allotment/prescription-data/${selectedBed.allotmentId}`
    );
  };


  const handleAllotmentDetail = () => {
    if (!selectedBed?.allotmentId) {
      toast.error("Allotment not found");
      return;
    }

    closeAnyModal();
    navigate(
      `/allotment-details/${selectedBed.allotmentId}`
    );
  }

  useEffect(() => {
    dispatch(fetchEmpDetail(localStorage.getItem("staffId")))
  }, [])
  const handleNotesHistory = () => {
    const modalElement = document.getElementById(selectedBed.status === "Booked" ? "bed-Option" : "bed-Not");
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    navigate(`/daily-ipd-history?allotment=${selectedBed?._id}`);
  };
  async function handleBedMaintenance() {
    if (!selectedBed) {
      return
    }
    setLoading(true)
    const data = { ...selectedBed, underMaintenance: !selectedBed?.underMaintenance }
    try {
      const res = await api.put(`/bed/bed/update/${selectedBed?._id}`, data)
      if (res.data.success) {
        setSelectedBed(null)
        fetchBedManagement()
        const modalEl = document.getElementById(selectedBed.status === "Booked" ? "bed-Option" : "bed-Not");
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        toast.success("Bed status updated")
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }
  const handleDischarge = () => {
    // Close modal manually
    const modal = document.getElementById("bed-Option");
    const modalInstance = window.bootstrap.Modal.getInstance(modal);
    modalInstance?.hide();

    // Navigate after closing
    navigate(`/discharge/${selectedBed?.allotmentId}`);
  };
  useEffect(() => {

    return () => {
      setSearchParams({});
    };
  }, []);

  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between laboratory-card ">
              <div>
                <h3 className="innr-title mb-2 gradient-text">Bed Allotment</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <NavLink to="/dashboard" className="breadcrumb-link">
                          Dashboard
                        </NavLink>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Bed management
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
              <div className="d-flex gap-3 laboratory-card flex-wrap">
                <NavLink to="/add-floor" className="nw-thm-btn w-auto">
                  <FaPlusCircle className="me-1" />
                  Add Floor
                </NavLink>
                {(isOwner || permissions?.beds?.add) && (
                  <NavLink to="/add-room" className="nw-thm-btn w-auto">
                    <FaPlusCircle className="me-1" />
                    Add Room
                  </NavLink>
                )}
                <NavLink to="/add-bed" className="nw-thm-btn w-auto">
                  <FaPlusCircle className="me-1" />
                  Add Bed
                </NavLink>
              </div>
            </div>
          </div>
          <div className="new-panel-card">
            {floors.map((floor) => (
              <div key={floor._id}>
                {/* FLOOR HEADER */}
                <div className="mb-3">
                  <div className="hospital-bed-bx d-flex align-items-center justify-content-end gap-3 mb-3">
                    <h6>
                      <span className="booked-bed-icon">
                        <FaBed />
                      </span>
                      Booked Bed
                    </h6>
                    <h6>
                      <span className="booked-bed-icon available-bed-icon">
                        <FaBed />
                      </span>
                      Available Bed
                    </h6>
                  </div>
                  <div>
                    <span className="d-flex align-items-center gap-2">
                      <h6 className="floor-title mb-0">
                        <PiTagChevronFill className="floor-chevron-icon" />
                        {floor.floorName}
                      </h6>
                      <NavLink
                        className="edit-btn text-black"
                        to={`/edit-floor/${floor._id}`}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </NavLink>
                    </span>
                  </div>
                </div>
                {/* ROOMS */}
                {floor.rooms.map((room) => (
                  <fieldset key={room._id} className="address-fieldset mb-4">
                    <legend className="float-none w-auto px-2 legend-title">
                      {room.department}
                    </legend>
                    <div className="row">
                      <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                        <div className="edit-field-bx">
                          <fieldset className="address-fieldset position-relative">
                            <legend className="float-none w-auto px-2 legend-title">
                              Room {room.roomName}
                            </legend>
                            <div className="d-flex justify-content-between gap-2 align-items-center">
                              {room.beds.map((bed) => (
                                <div
                                  key={bed._id}
                                  role="button"
                                  onClick={() => {
                                    if (searchParams.get('patientId') && bed.status !== "Booked") {
                                      navigate(`/allotment/${bed._id}?patientId=${searchParams.get('patientId')}`)
                                    } else {
                                      openBedModal(bed)

                                    }
                                  }
                                  }
                                  className={
                                    bed.status === "Booked"
                                      ? "booked-bed-bx"
                                      : "booked-bed-bx available-bed-bx"
                                  }
                                >
                                  <span
                                    className="nw-bed-icon"
                                    style={{ color: "black" }}
                                  >
                                    <FaBed />
                                  </span>
                                  <h6>{bed.bedName}</h6>
                                </div>
                              ))}
                              <div>
                                <NavLink
                                  onClick={() => localStorage.setItem('addBedData', JSON.stringify({
                                    floorId: floor?._id,
                                    departmentId: room?.departmentId,
                                    roomId: room?._id
                                  }))}
                                  to="/add-bed"
                                  className="nw-bed-added-btn"
                                >
                                  <FaPlusCircle />
                                </NavLink>
                              </div>
                            </div>
                          </fieldset>
                          <div className="filed-set-bx">
                            <NavLink
                              to={`/edit-room/${room._id}`}
                              className="edit-btn text-black"
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                ))}
              </div>
            ))}
          </div>
          <div className="text-end mt-4">
            <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
          </div>
        </div>}
      {/* <!-- Bed Option Book Popup Start --> */}
      <div
        className="modal step-modal fade"
        id="bed-Option"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content rounded-4">
            <div className="modal-body pb-2 px-4">
              <div className="">
                <ul className="bed-management-list">
                  <li className="bed-list-item">
                    <button
                      type="button"
                      className="bed-nav-link"
                      onClick={handleAllotmentDetail}
                    >
                      View Details
                      <span className="nw-chevron-btn">

                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>

                    {/* <NavLink to="/allotment-details" className="bed-nav-link">
                      View Details
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </NavLink> */}
                  </li>
                  <li className="bed-list-item">
                    <button
                      type="button"
                      className="bed-nav-link"
                      onClick={handleEditAllotment}
                    >
                      Edit Allotment
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                  </li>
                  <li className="bed-list-item">
                    <button
                      type="button"
                      className="bed-nav-link"
                      onClick={handleAddPrescription}
                    >
                      Add Prescriptions
                      <span className="nw-chevron-btn">

                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                    {/* <NavLink to="/add-prescription" className="bed-nav-link">
                      Add Prescriptions
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </NavLink> */}
                  </li>
                  <li className="bed-list-item">
                    <a
                      href="#"
                      className="bed-nav-link"
                      data-bs-toggle="modal"
                      data-bs-target="#add-Payment"
                    >
                      Add Payment
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </a>
                  </li>
                  <li className="bed-list-item">
                    <a
                      href="#"
                      className="bed-nav-link"
                      data-bs-toggle="modal"
                      data-bs-target="#department-Transfer"
                    >
                      Department Transfer
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </a>
                  </li>

                  <li className="bed-list-item">
                    <a
                      href="#"
                      className="bed-nav-link"
                      data-bs-toggle="modal"
                      data-bs-target="#add-LabTest"
                    >
                      Add Lab Test
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </a>
                  </li>
                  <li className="bed-list-item">
                    <a
                      href="#"
                      className="bed-nav-link"
                      data-bs-toggle="modal"
                      data-bs-target="#add-IPD-Notes"
                      onClick={() => setOpenDailyNotes(true)}
                    >
                      Add Daily Notes
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </a>
                  </li>
                  <li className="bed-list-item">
                    <a
                      href="#"
                      className="bed-nav-link"
                      onClick={() => handleBedMaintenance()}
                    >
                      {selectedBed?.underMaintenance ? 'Available' : 'Under Maintenance'}
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </a>
                  </li>
                  <li className="bed-list-item">
                    <button className="bed-nav-link" onClick={handleNotesHistory}>
                      Notes History
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                  </li>
                  {/* <li className="bed-list-item">
                    <a
                      href="#"
                      className="bed-nav-link"
                      data-bs-toggle="modal"
                      data-bs-target="#discharge-Patient"
                    >
                      Discharge Patient
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </a>
                  </li> */}
                  <li className="bed-list-item">
                    <button onClick={handleDischarge} className="bed-nav-link">
                      Discharge Patient
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                  </li>
                  <li className="bed-list-item">
                    <button onClick={()=>{
                      setPdfLoading(true)
                    }} disabled={pdfLoading} className="bed-nav-link">
                      {pdfLoading?'Printing...':'Print'} Details
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                  </li>
                  <li className="bed-list-item">
                    <button
                      type="button"
                      className="bed-nav-link"
                      onClick={handleEditBed}
                    >
                      Edit Bed
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                  </li>
                  {/* <li className="bed-list-item">
                    <button
                      type="button"
                      className="bed-nav-link text-danger"
                      onClick={handleDeleteBed}
                    >
                      Delete Bed
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Bed Option Book Popup End --> */}
      {/* <!-- Bed Option Not Book Popup Start --> */}
      {/* <!--  data-bs-toggle="modal" data-bs-target="#bed-Not" --> */}
      <div
        className="modal step-modal fade"
        id="bed-Not"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content rounded-4">
            <div className="modal-body pb-2 px-4">
              <div className="">
                <ul className="bed-management-list">
                  {!selectedBed?.underMaintenance && <li className="bed-list-item">
                    <button
                      type="button"
                      className="bed-nav-link"
                      onClick={handleallotmentAdd}
                    >
                      Add Allotment
                      <span className="nw-chevron-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </button>
                  </li>}
                  {!searchParams?.get('patientId') && <>
                    <li className="bed-list-item">
                      <button
                        type="button"
                        className="bed-nav-link"
                        onClick={handleEditBed}
                      >
                        Edit Bed
                        <span className="nw-chevron-btn">
                          <FontAwesomeIcon icon={faChevronRight} />
                        </span>
                      </button>
                    </li>
                    <li className="bed-list-item">
                      <button className="bed-nav-link" onClick={handleNotesHistory}>
                        Notes History
                        <span className="nw-chevron-btn">
                          <FontAwesomeIcon icon={faChevronRight} />
                        </span>
                      </button>
                    </li>
                    <li className="bed-list-item">
                      <a
                        href="#"
                        className="bed-nav-link"
                        onClick={() => handleBedMaintenance()}
                      >
                        {selectedBed?.underMaintenance ? 'Remove Maintenance' : 'Under Maintenance'}
                        <span className="nw-chevron-btn">
                          <FontAwesomeIcon icon={faChevronRight} />
                        </span>
                      </a>
                    </li>
                  </>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Bed Option Not Book Popup End --> */}
      {/* <!-- Payment Add Popup Start --> */}
      {/* <!--  data-bs-toggle="modal" data-bs-target="#add-Payment" --> */}
      <AllotmentPayment allotmentId={selectedBed?.allotmentId} getData={fetchBedManagement} />
      {/* <!-- Payment Add Popup End --> */}
      {/* <!-- Discharge Patient Popup Start --> */}
      {/* <!--  data-bs-toggle="modal" data-bs-target="#discharge-Patient" --> */}
      <DischargePatient allotmentId={(selectedBed?.allotmentId)} fetchData={() => fetchBedManagement()} />
      {/* <!-- Discharge Patient Popup End --> */}
      <div className="d-none" >
        <BedInvoice allotmentId={selectedBed?.allotmentId} pdfLoading={pdfLoading} endLoading={() => setPdfLoading(false)} />
      </div>
      <DailyIPDNotes data={selectedBed} openTrigger={openDailyNotes} />
      <AddAllotmentTest allotmentId={selectedBed?.allotmentId} />
      <DepartmentTransfer data={selectedBed} getData={fetchBedManagement} />

    </>
  );
}
export default BedManagement;
