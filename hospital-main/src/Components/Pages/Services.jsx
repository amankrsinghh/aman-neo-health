import { TbGridDots } from "react-icons/tb";
import {
    faCircleXmark,
    faPen,
    faSearch,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlusCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { securePostData } from "../../Service/api";

function HospitalService() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const { hospitalBasic } = useSelector(state => state.user);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    // ✅ Add Service
    const addService = () => {
        if (!name.trim()) {
            toast.error("Service name required");
            return;
        }

        const updated = [...services, name.trim()];
        setServices(updated);

        serviceSubmit(updated); // 🔥 updated pass karo
        setName('');
    };

    // ✅ Delete Service
    const deleteService = (index) => {
        const updated = services.filter((_, i) => i !== index);
        setServices(updated);
        serviceSubmit(updated)
    };

    // ✅ Submit
    async function serviceSubmit(finalservice = services) {
        if (services.length === 0) {
            toast.error("Add at least one service");
            return;
        }

        const data = {
            ...hospitalBasic,
            services: finalservice
        };

        try {
            setLoading(true);

            const res = await securePostData(`api/hospital/service`, data);

            if (res.success) {
                toast.success("Services saved successfully");
                // navigate(-1);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (hospitalBasic?.services) {
            setServices(hospitalBasic?.services)

        }
    }, [hospitalBasic])

    return (
        <>
            {loading ? <Loader /> :
                <div className="main-content flex-grow-1 p-3 overflow-auto">

                    {/* Header */}
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Services</h3>

                                  <div className="admin-breadcrumb">
                                                <nav aria-label="breadcrumb">
                                                  <ol className="breadcrumb custom-breadcrumb">
                                                    <li className="breadcrumb-item">
                                                      <NavLink to="/dashboard" className="breadcrumb-link">
                                                        Dashboard
                                                      </NavLink>
                                                    </li>
                                                    <li
                                                      className="breadcrumb-item active"
                                                      aria-current="page"
                                                    >
                                                      Services
                                                    </li>
                                                  </ol>
                                                </nav>
                                              </div>

                            </div>
                        </div>
                    </div>

                    {/* Add Service */}

                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                         <div className="custom-frm-bx flex-grow-1 mb-0">
                                <input
                            type="text"
                            className="form-control nw-frm-select"
                            placeholder="Enter service name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                            </div>

                        <div className="">
                               <button className="nw-thm-btn" onClick={addService}>
                            <FaPlusCircle className="me-1" />
                            Add
                        </button>

                        </div>


                    </div>

                 
                    <div className="new-panel-card">
                        <div className="row">
                        <div className="col-lg-12">
                            <div className='table-section'>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Service Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.length > 0 ? (
                                        services.map((s, index) => (
                                            <tr key={index}>
                                                <td>{String(index + 1).padStart(2, "0")}.</td>
                                                <td>{s}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="text-danger"
                                                        onClick={() => deleteService(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                No service found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                        </div>

                    </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-between mt-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="nw-thm-btn outline"
                        >
                            Go Back
                        </button>

                    </div>
                </div>
            }
        </>
    );
}

export default HospitalService;