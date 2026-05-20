import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { deleteApiData, getSecureApiData } from "../../Services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

function ContactQuery() {
    const [searchParams] = useSearchParams()
    const [panel, setPanel] = useState("hospital")
    const [contactList, setContactList] = useState([]);
    const [contactData, setContactData] = useState()
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [pagination, setPagination] = useState({});

    const [form, setForm] = useState({
        name: "",
        isoCode: "",
    });

    const [editingId, setEditingId] = useState(null);

    /* ================= LOAD DATA ================= */

    const loadContact = async () => {
        setLoading(true);

        try {
            const res = await getSecureApiData(
                `admin/contact-query?panel=${searchParams.get('panel')}&page=${page}&limit=${limit}`
            );
            if (res.success) {
                setContactList(res.data);
                setPagination(res.pagination);
            }

        } catch {
            toast.error("Failed to load countries");
        } finally {
            setLoading(false);
        }
    };

    const deleteQuery = async (id) => {
        setLoading(true);

        try {
            const res = await deleteApiData(
                `admin/contact-query/${id}`
            );
            if (res.success) {
                toast.success(res.message)
                loadContact()
            }else{
                toast.error(res.message)
            }

        } catch {
            toast.error("Failed to load countries");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadContact();
        setContactData(null)
    }, [page, search,searchParams]);

    return (
        <div className="main-content p-3">

            <h3 className="mb-3">Contact Queries</h3>

            {/* ===== SEARCH ===== */}


            {/* ===== FORM ===== */}

            

            {/* ===== TABLE ===== */}

            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" />
                </div>
            ) : (
                contactData ?<form className="mb-4">
                    <div className="row">
                        
                <div className="col-lg-4">
                    <div className="custom-frm-bx">
                        <label htmlFor="">Name</label>
                        <input
                            className="form-control mb-2"
                            value={contactData?.name}
                            readOnly
                        />
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="custom-frm-bx">
                        <label htmlFor="">Email</label>
                        <input
                            className="form-control mb-2"
                            value={contactData?.email}
                            readOnly
                        />
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="custom-frm-bx">
                        <label htmlFor="">Contact Number</label>
                        <input
                            className="form-control mb-2"
                            value={contactData?.contactNumber}
                            readOnly
                        />
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="custom-frm-bx">
                        <label htmlFor="">Account Type</label>
                        <input
                            className="form-control mb-2"
                            value={contactData?.accountType}
                            readOnly
                        />
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="custom-frm-bx">
                        <label htmlFor="">Company Name</label>
                        <input
                            className="form-control mb-2"
                            value={contactData?.companyName}
                            readOnly
                        />
                    </div>
                </div>
                {searchParams.get('panel') == "hospital" &&
                    <><div className="col-lg-4">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Hospital Type</label>
                            <input
                                className="form-control mb-2"
                                value={contactData?.hospitalType}
                                readOnly
                            />
                        </div>
                    </div>
                        <div className="col-lg-4">
                            <div className="custom-frm-bx">
                                <label htmlFor="">Bed Range</label>
                                <input
                                    className="form-control mb-2"
                                    value={contactData?.bedRange}
                                    readOnly
                                />
                            </div>
                        </div>
                    </>}
                    </div>




                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => {
                            setContactData(null);
                        }}
                    >
                        Cancel
                    </button>
              
            </form>:
                <table className="table table-bordered table-striped">

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Account Type</th>
                            <th>Company Name</th>
                            <th>Created At</th>
                            <th width="180">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contactList.map((c) => (
                            <tr key={c._id}>
                                <td>{c?.name}</td>
                                <td>{c?.email}</td>
                                <td>{c?.contactNumber}</td>
                                <td>{c?.accountType}</td>
                                <td>{c?.companyName}</td>
                                <td>{new Date(c?.createdAt)?.toLocaleDateString('en-GB')}</td>
                                <td>

                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() => {
                                            setContactData(c)
                                        }}
                                    >
                                         <FontAwesomeIcon icon={faEye}/>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger me-2"
                                        onClick={() => {
                                            deleteQuery(c?._id)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>


                                </td>
                            </tr>
                        ))}

                        {contactList.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    No data found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>
            )}

            {/* ===== PAGINATION ===== */}

            {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2">

                    <button
                        className="btn btn-outline-primary"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>

                    <span className="align-self-center">
                        Page {page} / {pagination.totalPages}
                    </span>

                    <button
                        className="btn btn-outline-primary"
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    );
}

export default ContactQuery;