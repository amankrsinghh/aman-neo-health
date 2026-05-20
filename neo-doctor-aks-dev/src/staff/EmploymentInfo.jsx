import { useState, useEffect } from "react";
import { getApiData } from "../Services/api";


function EmploymentInfo({ staffData, setStaffData }) {

    const [errors, setErrors] = useState({});
    const [employeeId, setEmployeeId] = useState("");
    const [department, setDepartment] = useState("");
    const [role, setRole] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [reportingTo, setReportingTo] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [leaveDate, setLeaveDate] = useState("");
    const [salary, setSalary] = useState("");
    const [fees,setFees] = useState("")
    const [contractStart, setContractStart] = useState("");
    const [contractEnd, setContractEnd] = useState("");
    const [note, setNote] = useState("");
    const [departments, setDepartments] = useState([])

    // ===== TAB NAV =====
    const goToNextTab = () => {
        document.querySelector('a[href="#access"]')?.click();
    };

    const goToBackTab = () => {
        document.querySelector('a[href="#professional"]')?.click();
    };

    // ===== SAVE & NEXT =====
    const handleSaveAndNext = () => {
        if (!validate()) return;

        if (typeof setStaffData !== "function") {
            console.error("setStaffData not received in EmploymentInfo");
            return;
        }

        const employmentInfo = {

            department,
            role,
            employmentType,
            reportingTo,
            joinDate,
            leaveDate,
            salary,
            fees,
            contractStart,
            contractEnd,
            note
        };

        setStaffData(prev => ({
            ...prev,
            employmentInfo
        }));

        goToNextTab();
    };
    const fetchDepartments = async () => {
        try {
            const res = await getApiData.get("/doctor/departments");
            setDepartments(res.data);

        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchDepartments()
    }, [])

    useEffect(() => {
        if (!staffData?.employmentInfo) return;

        const e = staffData.employmentInfo;

        setDepartment(e.department || "");
        setRole(e.role || "");
        setEmploymentType(e.employmentType || "");
        setReportingTo(e.reportingTo || "");
        setSalary(e.salary || "");
        setFees(e.fees || "")
        setNote(e.note || "");

        // ✅ Date fields (HTML date input)
        setJoinDate(e.joinDate ? e.joinDate.substring(0, 10) : "");
        setLeaveDate(e.onLeaveDate ? e.onLeaveDate.substring(0, 10) : "");
        setContractStart(e.contractStart ? e.contractStart.substring(0, 10) : "");
        setContractEnd(e.contractEnd ? e.contractEnd.substring(0, 10) : "");

    }, [staffData]);


    const validate = () => {
        let newErrors = {};

        // if (!employeeId.trim()) newErrors.employeeId = "Employee ID is required";
        if (!department) newErrors.department = "Department is required";
        if (!role.trim()) newErrors.role = "Role is required";
        if (!employmentType) newErrors.employmentType = "Employment type is required";
        if (!joinDate) newErrors.joinDate = "Join date is required";

        if (salary && Number(salary) <= 0) {
            newErrors.salary = "Salary must be greater than 0";
        }
        if (fees && Number(fees) <= 0) {
            newErrors.fees = "Fees must be greater than 0";
        }

        // Leave date validation
        if (leaveDate && joinDate && new Date(leaveDate) < new Date(joinDate)) {
            newErrors.leaveDate = "Leave date cannot be before join date";
        }

        // Contract validation
        if (employmentType === "contract") {
            if (!contractStart) {
                newErrors.contractStart = "Contract start date is required";
            }

            if (!contractEnd) {
                newErrors.contractEnd = "Contract end date is required";
            }

            if (
                contractStart &&
                contractEnd &&
                new Date(contractStart) > new Date(contractEnd)
            ) {
                newErrors.contractEnd = "Contract end must be after start date";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };





    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="row">

                    <div className="d-flex align-items-center gap-3">
                        <h4 className="lg_title text-black fw-700 mb-3">Employment Details</h4>

                    </div>

                    {/* <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Employee ID</label>
                            <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder="Enter Employee ID"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                            />
                            {errors.employeeId && (
                                <small className="text-danger">{errors.employeeId}</small>
                            )}
                        </div>
                    </div> */}

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>Department</label>
                            <div className="select-wrapper">
                                <select
                                    className="form-select"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                >
                                    <option value="">--- Select Department ---</option>
                                    {departments?.map((item, key) =>
                                        <option value={item?._id} key={key}>{item?.departmentName}</option>)}
                                </select>
                                {errors.department && (
                                    <small className="text-danger">{errors.department}</small>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>Position/Role</label>
                            <div className="select-wrapper">
                                <select
                                    className="form-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="">--- Role ---</option>
                                    <option value="Resident">Resident</option>
                                    <option value="Attending">Attending</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Cashire">Cashire</option>
                                    <option value="Receptionist">Receptionist</option>
                                    <option value="Specialist">Specialist</option>
                                </select>
                                {errors.role && (
                                    <small className="text-danger">{errors.role}</small>
                                )}
                            </div>
                            {/* <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder="Enter Position/Role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            {errors.role && (
                                <small className="text-danger">{errors.role}</small>
                            )} */}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>Employment Type</label>
                            <div className="select-wrapper">
                                <select
                                    className="form-select"
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}
                                >
                                    <option value="">--- Employment Type ---</option>
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="contract">Contract</option>
                                </select>
                                {errors.employmentType && (
                                    <small className="text-danger">{errors.employmentType}</small>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>Reporting To</label>
                            <div className="select-wrapper">
                                <select
                                    className="form-select custom-select"
                                    value={reportingTo}
                                    onChange={(e) => setReportingTo(e.target.value)}
                                >
                                    <option value="">--- Select ---</option>
                                    <option value="manager">Manager</option>
                                    <option value="team-lead">Team Lead</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Join Date</label>
                            <input
                                type="date"
                                className="form-control nw-frm-select"
                                placeholder="Enter"
                                value={joinDate}
                                onChange={(e) => setJoinDate(e.target.value)}
                            />
                            {errors.joinDate && (
                                <small className="text-danger">{errors.joinDate}</small>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">On Leave Date</label>
                            <input
                                type="date"
                                className="form-control nw-frm-select"
                                placeholder="Enter  Total Experience"
                                value={leaveDate}
                                onChange={(e) => setLeaveDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>Salary($)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Salary"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                            {errors.salary && (
                                <small className="text-danger">{errors.salary}</small>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>Fees($)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Fees"
                                value={fees}
                                onChange={(e) => setFees(e.target.value)}
                            />
                            {errors.fees && (
                                <small className="text-danger">{errors.fees}</small>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-12 my-3">
                        <div className="">
                            <h5 className="add-contact-title">Contract Details</h5>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Contract Start</label>
                            <input
                                type="date"
                                className="form-control nw-frm-select"
                                placeholder="Enter  Total Experience"
                                value={contractStart}
                                onChange={(e) => setContractStart(e.target.value)}
                            />
                            {errors.contractStart && (
                                <small className="text-danger">{errors.contractStart}</small>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Contract End</label>
                            <input
                                type="date"
                                className="form-control nw-frm-select"
                                placeholder="Enter  Total Experience"
                                value={contractEnd}
                                onChange={(e) => setContractEnd(e.target.value)}
                            />
                            {errors.contractEnd && (
                                <small className="text-danger">{errors.contractEnd}</small>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-12 mt-5">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Note</label>
                            <textarea
                                className="form-control nw-frm-select"
                                placeholder="Enter Note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            >
                                {errors.note && (
                                    <small className="text-danger">{errors.note}</small>
                                )}
                            </textarea>
                        </div>
                    </div>

                </div>




                <div className="d-flex align-items-center justify-content-end gap-3">
                    <button type="button" className="nw-thm-btn outline rounded-3" onClick={goToBackTab}>Back</button>
                    <button type="button" className="nw-thm-btn rounded-3" onClick={handleSaveAndNext}>Save & Continue</button>
                </div>

            </form>
        </>
    );
}

export default EmploymentInfo;
