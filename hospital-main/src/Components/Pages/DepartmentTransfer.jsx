import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import api from "../../api/api";
import Loader from '../Common/Loader';
import { toast } from 'react-toastify';
import { getSecureApiData, securePostData } from '../../Service/api';
function DepartmentTransfer({ data, getData }) {
    const [loading, setLoading] = useState()
    const [selectedDepartment, setSelectedDepartment] = useState()
    const [departments, setDepartments] = useState([])
    const [beds, setBeds] = useState([])
    const [selectedBed, setSelectedBed] = useState()
    const [doctors, setDoctors] = useState([])
    const [reason, setReason] = useState('')
    const [doctorNh12, setDoctorNh12] = useState()
    const [isSaving, setIsSaving] = useState(false)
    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await getSecureApiData("api/department/list?limit=100");

            setDepartments(res.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const fetchDepartmentBeds = async () => {
        try {
            // setLoading(true);
            const res = await api.get(`/bed/hospital?department=${selectedDepartment}&status=Available&underMaintenance=No`);

            setBeds(res.data.data);

        } catch (err) {
            console.error(err);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        if (data) {
            fetchDepartments()
        }
    }, [data])
    useEffect(() => {
        if (selectedDepartment) {
            fetchDepartmentBeds()
        }
    }, [selectedDepartment])
    const transferSubmit = async (e) => {
        e.preventDefault()
        let sendData = {
            bedFrom: data?._id,
            bedTo: selectedBed,
            doctorTo: doctorNh12,
            departmentFrom: data?.departmentId,
            departmentTo: selectedDepartment,
            reason,
            allotmentId: data?.allotmentId,
        }
        if (!selectedBed || !selectedDepartment || !doctorNh12 || !reason) {
            return toast.error("Please fill all fileds")
        }
        setIsSaving(true)
        try {
            const res = await securePostData('api/bed/department-transfer', sendData)
            if (res.success) {
                handleCloseDeptModal()
                getData()
            }
            toast.success(res.message)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setIsSaving(false)
        }
    }
    const handleCloseDeptModal = () => {
        const modalEl = document.getElementById("department-Transfer");
        if (!modalEl) return;

        // Bootstrap 5 ka instance lo, agar nahi hai toh naya banao
        const modalInstance =
            window.bootstrap?.Modal.getInstance(modalEl) ||
            new window.bootstrap.Modal(modalEl);

        modalInstance.hide();

        // hide ke baad manually backdrop + body cleanup (static backdrop ke liye safety net)
        modalEl.addEventListener(
            "hidden.bs.modal",
            () => {
                document.body.classList.remove("modal-open");
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
                document
                    .querySelectorAll(".modal-backdrop")
                    .forEach((el) => el.remove());
            },
            { once: true }
        );
    };
    const filteredDepartments = departments?.filter(d => d?._id !== data?.departmentId);
    return (
        <>
            <div className="modal step-modal fade" id="department-Transfer" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="lg_title mb-0">Department transfer</h6>
                            </div>
                            <div>
                                <button type="button" onClick={handleCloseDeptModal} className="" id="deptClose" aria-label="Close"
                                    style={{ color: "rgba(239, 0, 0, 1)" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4 pb-5">
                            {loading ? <Loader /> :
                                <div className="row justify-content-center">
                                    <div className="col-lg-10">
                                        <div className="add-deprtment-pic">
                                            <img src="/add-department.png" alt="" />
                                            <p className="pt-2">Please select department</p>
                                        </div>

                                        <form onSubmit={transferSubmit}>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Departments</label>
                                                {filteredDepartments?.length > 0 ?
                                                    <select name="" id="" className='form-select' value={selectedDepartment}
                                                        onChange={(e) => setSelectedDepartment(e.target.value)}>
                                                        <option value="">----Select Department----</option>
                                                        {filteredDepartments?.map((item, key) =>
                                                            <option value={item?._id} key={key}>{item?.departmentName}</option>)}
                                                    </select> :
                                                    <h4 className='fz-14'> No other department found</h4>}
                                            </div>
                                            {filteredDepartments?.length > 0
                                                && <>
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Department Beds</label>
                                                        {(beds?.length > 0) ?
                                                            <select name="" id="" className='form-select' value={selectedBed} onChange={(e) => setSelectedBed(e.target.value)}>
                                                                <option value="">----Select Bed----</option>
                                                                {beds?.map((item, key) =>
                                                                    <option value={item?._id} key={key}>{item?.bedName}</option>)}
                                                            </select> :
                                                            <h4 className='fz-14'>No bed found in this department</h4>}
                                                    </div>
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Attending Doctor</label>
                                                        <input type="number" className='form-control' value={doctorNh12} onChange={(e) => setDoctorNh12(e.target.value)} />
                                                    </div>
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Reson</label>
                                                        <textarea className='form-control' value={reason} onChange={(e) => setReason(e.target.value)}>
                                                        </textarea>
                                                    </div>
                                                    <div className="mt-3">
                                                        <button type="submit" disabled={isSaving} className="nw-thm-btn w-100"> {isSaving ? 'Submiting....' : 'Submit'}</button>
                                                    </div>
                                                </>}
                                        </form>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DepartmentTransfer