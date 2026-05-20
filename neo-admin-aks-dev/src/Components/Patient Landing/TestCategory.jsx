import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteApiData, getApiData, securePostData, updateApiData } from "../../Services/api";
import base_url from "../../Services/baseUrl";
import Select from "react-select"
import { Link } from "react-router-dom";
function TestCategory() {
    const [view, setView] = useState("table");
    const [saving, setSaving] = useState(false);
    const [workData, setWorkData] = useState([])
    const [editingId, setEditingId] = useState()
    // const [subCatData, setSubCatData] = useState([])
    const [form, setForm] = useState({
        icon: null,
        preview: "",
        name: "",
        start: "", subCat: []

    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (file) => {
        setForm(prev => ({
            ...prev,
            icon: file,
            preview: URL.createObjectURL(file)
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append("name", form.name);
            // formData.append("subCat",JSON.stringify(form.subCat));

            if (form.icon instanceof File) {
                formData.append("icon", form.icon);
            }

            // ✅ EDIT CASE
            if (editingId) {
                formData.append("spId", editingId);
            }

            const res = editingId ? await updateApiData('admin/test-category', formData) : await securePostData(
                "admin/test-category",
                formData
            );
            if (res.success) {

                toast.success(res.message);
            } else {
                toast.error(res.message)
            }

            setView("table");
            fetchData();

        } catch (err) {
            console.log(err);
            toast.error("Failed");
        } finally {
            setSaving(false);
        }
    };

    // ✅ get data
    const fetchData = async () => {
        try {
            const [res] = await Promise.all([
                getApiData("api/admin/landing/patient")
            ]);

            const data = res.data?.testCat;
            setWorkData(data);



        } catch (err) {
            console.log(err);
            toast.error(err?.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const handleAdd = () => {
        setEditingId(null);
        setForm({
            icon: null,
            preview: "",
            name: "",
            subCat: []
        });
        setView("form");
    }; const handleEdit = (item) => {
        setEditingId(item._id);

        setForm({
            icon: item.icon,
            preview: `${base_url}/${item.icon}`,
            name: item.name,
            subCat: item?.subCat
        });

        setView("form");
    };
    const handleDelete = async (id) => {
        try {
            const res = await deleteApiData(`admin/test-category/${id}`);
            if (res?.success) {

                toast.success("Deleted");
                fetchData();
            } else {
                toast.error(res?.message)
            }
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="gradient-text">Test Categories</h3>

                {view === "table" && (
                    <button className="thm-btn" onClick={handleAdd}>
                        + Add
                    </button>
                )}
            </div>
            {view === "table" && (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="table-section admin-mega-section">
                            <div className="table table-responsive mb-0">
                                <table className="table mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Sub Category</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {workData?.map((item,key) => (
                                            <tr>
                                                <td>{key+1}</td>

                                                <td>
                                                    <img
                                                        src={`${base_url}/${item.icon}`}
                                                        style={{ width: 60, borderRadius: 6 }}
                                                    />
                                                </td>

                                                <td>{item.name}</td>
                                                <td>
                                                    <Link to={`/landing/sub-test-category/${item?._id}`} className="thm-btn">View</Link>
                                                </td>

                                                <td>
                                                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleEdit(item)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>

                                                    {/* <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button> */}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div></div>
                    </div>


                </div>
            )}
            {view === "form" && (
                <form onSubmit={handleSubmit}>
                    <div className="new-mega-card p-4">

                        <div className="row">

                            <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Title</label>
                                    <input
                                        className="form-control nw-select-frm"
                                        placeholder="Name"
                                        value={form.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                    />
                                </div>
                            </div>



                            <div className="col-12 mt-2">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => handleImageChange(e.target.files[0])}
                                    />
                                </div>

                                {form.preview && (
                                    <img src={form.preview} style={{ width: 60, marginTop: 10 }} />
                                )}
                            </div>
                            {/* <div className="col-12">
                                <div className="custom-frm-bx">
                                    <label>Sub Category</label>
                                    <Select
                                        options={subCatData}
                                        isMulti
                                        required
                                        value={subCatData.filter(option =>
                                            form.subCat?.includes(option.value)
                                        )}
                                        className="custom-select"
                                        placeholder="Select category..."
                                        onChange={(selectedOptions) => {
                                            const values = selectedOptions?.map(item => item.value) || [];
                                            setForm({ ...form, subCat: values });
                                        }}
                                    />
                                </div>
                            </div> */}


                        </div>

                        <div className="d-flex justify-content-between mt-3">
                            <button type="button" onClick={() => setView("table")} className="nw-thm-btn outline">
                                Cancel
                            </button>

                            <button type="submit" className="nw-thm-btn">
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>

                    </div>
                </form>
            )}
        </div>
    );
}

export default TestCategory;