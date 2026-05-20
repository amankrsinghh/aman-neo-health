import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import Loader from '../Common/Loader';
import { toast } from 'react-toastify';
import { getSecureApiData, securePostData } from '../../Service/api';
import api from "../../api/api";
import API from '../../api/api';

const initialForm = {
    toHospital: '',
    patientId: '',
    receivingDoctor: '',
    departmentFrom: '',
    departmentTo: '',
    diagnosis: '',
    reason: '',
    conditionAtTransfer: '',
    treatmentGiven: '',
    dischargeSummary: '',
    labReports: '',
    prescriptions: '',
    transferInitiatedDate: '',
    transferInitiatedContent: '',
    familyConsentDate: '',
    familyConsentContent: '',
    ambulanceDispatchedDate: '',
    ambulanceDispatchedContent: '',
    receivedDate: '',
    receivedContent: '',
};

const initialErrors = {};

function HospitalTransfer({ data, getData }) {
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState(initialErrors);
    const [hospitalChecking, setHospitalChecking] = useState(false);
    const [allotmentData, setAllotmentData] = useState()

    const fetchDepartments = async () => {
        if (form.toHospital?.length < 12) return;
        try {
            setHospitalChecking(true);
            const res = await getSecureApiData(`api/hospital/department/${form?.toHospital}`);
            if (res.success) {
                setDepartments(res.data);
            } else {
                toast.error(res.message || 'Error in departments fetch.');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Error in departments fetch.');
        } finally {
            setHospitalChecking(false);
        }
    };


    useEffect(() => {
        if (data) {
            fetchDepartments();
            // Pre-fill known values
            setForm(prev => ({
                ...prev,
                departmentFrom: data?.departmentId || '',
                patientId: data?.patientId || '',
            }));
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!form.toHospital) newErrors.toHospital = 'To Hospital is required';


        if (!form.receivingDoctor) newErrors.receivingDoctor = 'Receiving Doctor is required';

        if (!form.departmentTo) newErrors.departmentTo = 'To Department is required';


        if (!form.diagnosis) newErrors.diagnosis = 'Diagnosis is required';
        if (!form.reason) newErrors.reason = 'Transfer reason is required';
        if (!form.transferInitiatedDate) {
            newErrors.transferInitiatedDate = 'Transfer initiated date is required';
        }
        return newErrors;
    };
    const transferSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const sendData = {
            fromAllotment: data?._id,
            toHospital: form.toHospital,
            receivingDoctor: form.receivingDoctor,
            patientId: data.patientId?._id,
            departmentFrom: data?.departmentId?._id,
            departmentTo: form.departmentTo,
            reasonForTransfer: {
                diagnosis: form.diagnosis,
                reason: form.reason,
                conditionAtTransfer: form.conditionAtTransfer,
                treatmentGiven: form.treatmentGiven,
            },
            documentShared: {
                dischargeSummary: form.dischargeSummary || undefined,
                labReports: form.labReports,
                prescriptions: form.prescriptions || undefined,
            },
            timeLine: {
                transferInitiated: {
                    date: form.transferInitiatedDate || undefined,
                    content: form.transferInitiatedContent,
                },
                familyConsent: {
                    date: form.familyConsentDate || undefined,
                    content: form.familyConsentContent,
                },
                ambulanceDispatched: {
                    date: form.ambulanceDispatchedDate || undefined,
                    content: form.ambulanceDispatchedContent,
                },
                received: {
                    date: form.receivedDate || undefined,
                    content: form.receivedContent,
                },
            },
        };

        setIsSaving(true);
        try {
            const res = await securePostData('api/bed/hospital-transfer', sendData);
            if (res.success) {
                toast.success("Transfer successful");
                document?.getElementById?.('hospitalTransferClose')?.click();
                getData();
                setForm(initialForm);
                setErrors({});
            } else {

                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error during transfer.');
        } finally {
            setIsSaving(false);
        }
    };

    const ErrorMsg = ({ field }) =>
        errors[field] ? (
            <small className="text-danger d-block mt-1">
                <i className="fa fa-exclamation-circle me-1" /> {errors[field]}
            </small>
        ) : null;

    const inputClass = (field) =>
        `form-control${errors[field] ? ' is-invalid' : ''}`;

    const selectClass = (field) =>
        `form-select${errors[field] ? ' is-invalid' : ''}`;

    return (
        <>
            {loading ? <Loader /> : (
                <div
                    className="modal step-modal fade"
                    id="hospital-Transfer"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-labelledby="hospitalTransferLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-0">
                            {/* Header */}
                            <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                                <h6 className="lg_title mb-0">Hospital Transfer</h6>
                                <button
                                    type="button"
                                    id="hospitalTransferClose"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    style={{ color: 'rgba(239,0,0,1)', background: 'none', border: 'none' }}
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="modal-body px-4 pb-5" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                                <form onSubmit={transferSubmit} noValidate>

                                    {/* — Transfer Info — */}
                                    <p className="text-muted fw-semibold small text-uppercase mt-2 mb-2 border-bottom pb-1">
                                        Transfer Info
                                    </p>
                                    <div className="row align-items-center">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">To Hospital <span className="text-danger">*</span></label>
                                            <input name="toHospital" className={inputClass('toHospital')}
                                                value={form.toHospital} onChange={handleChange} placeholder="Enter hospital nhc id" />

                                            <ErrorMsg field="toHospital" />
                                        </div>
                                        {departments?.length == 0 && <div className='col-2 '>

                                            <button className='thm-btn' type="button"
                                                disabled={form.toHospital?.length < 12 || hospitalChecking}
                                                onClick={() => fetchDepartments()} >{hospitalChecking ? 'Checking...' : 'Check'}</button>
                                        </div>}

                                    </div>
                                    {departments?.length > 0 && <>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">To Department <span className="text-danger">*</span></label>
                                                <select name="departmentTo" className={selectClass('departmentTo')} value={form.departmentTo} onChange={handleChange}>
                                                    <option value="">-- Select Department --</option>
                                                    {departments?.filter(d => d._id !== form.departmentFrom)?.map(d =>
                                                        <option key={d._id} value={d._id}>{d.departmentName}</option>)}
                                                </select>
                                                <ErrorMsg field="departmentTo" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Receiving Doctor <span className="text-danger">*</span></label>
                                                <input name="receivingDoctor" className={inputClass('receivingDoctor')}
                                                    value={form.receivingDoctor} onChange={handleChange} placeholder="Enter receiving doctor's nhc id" />

                                                <ErrorMsg field="receivingDoctor" />
                                            </div>
                                        </div>
                                        {/* — Reason for Transfer — */}
                                        <p className="text-muted fw-semibold small text-uppercase mt-3 mb-2 border-bottom pb-1">
                                            Reason for Transfer
                                        </p>
                                        <div className="mb-3">
                                            <label className="form-label">Diagnosis <span className="text-danger">*</span></label>
                                            <input name="diagnosis" className={inputClass('diagnosis')} value={form.diagnosis} onChange={handleChange} placeholder="e.g., Acute MI" />
                                            <ErrorMsg field="diagnosis" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Reason <span className="text-danger">*</span></label>
                                            <textarea name="reason" className={inputClass('reason')} value={form.reason} onChange={handleChange} rows={3} placeholder="Reason of transfer ..." />
                                            <ErrorMsg field="reason" />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Condition at Transfer</label>
                                                <input name="conditionAtTransfer" className="form-control" value={form.conditionAtTransfer} onChange={handleChange} placeholder="e.g., Stable, Critical" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Treatment Given</label>
                                                <input name="treatmentGiven" className="form-control" value={form.treatmentGiven} onChange={handleChange} placeholder="e.g., IV fluids, Surgery" />
                                            </div>
                                        </div>

                                        {/* — Timeline — */}
                                        <p className="text-muted fw-semibold small text-uppercase mt-3 mb-2 border-bottom pb-1">
                                            Timeline
                                        </p>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Transfer Initiated <span className="text-danger">*</span></label>
                                                <input type="datetime-local" name="transferInitiatedDate" className={inputClass('transferInitiatedDate')} value={form.transferInitiatedDate} onChange={handleChange} />
                                                <ErrorMsg field="transferInitiatedDate" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Initiated — Note</label>
                                                <input name="transferInitiatedContent" className="form-control" value={form.transferInitiatedContent} onChange={handleChange} placeholder="Note" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Family Consent Date</label>
                                                <input type="datetime-local" name="familyConsentDate" className="form-control" value={form.familyConsentDate} onChange={handleChange} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Family Consent — Note</label>
                                                <input name="familyConsentContent" className="form-control" value={form.familyConsentContent} onChange={handleChange} placeholder="Note" />
                                            </div>
                                        </div>


                                        {/* — Documents Shared — */}
                                        <p className="text-muted fw-semibold small text-uppercase mt-3 mb-2 border-bottom pb-1">
                                            Documents Shared
                                        </p>
                                        <div className="form-check custom-check mb-3">
                                            <label className="form-check-label" htmlFor="dischargeSummary">Discharge Summary </label>
                                            <input name="dischargeSummary" type='checkbox' id='dischargeSummary'
                                                className="form-check-input" checked={form.dischargeSummary} onChange={handleChange} placeholder="ObjectId" />
                                        </div>
                                        <div className="form-check custom-check mb-3">
                                            <label className="form-check-label" htmlFor="prescriptions">Prescriptions </label>
                                            <input name="prescriptions" type='checkbox' id='prescriptions' className="form-check-input"
                                                checked={form.prescriptions} onChange={handleChange} />
                                        </div>
                                        <div className="form-check custom-check mb-3">
                                            <label className="form-label" htmlFor="labReports">
                                                Lab Reports {' '}
                                            </label>
                                            <input name="labReports" type='checkbox' id='labReports' className="form-check-input"
                                                checked={form.labReports} onChange={handleChange} />
                                        </div>
                                    </>}

                                    <button type="submit" disabled={isSaving} className="nw-thm-btn w-100 mt-2">
                                        {isSaving ? 'Submitting...' : 'Submit Transfer'}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default HospitalTransfer;