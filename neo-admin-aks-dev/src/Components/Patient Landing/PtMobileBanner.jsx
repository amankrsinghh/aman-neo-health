import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteApiData, getApiData, securePostData, updateApiData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function PtMobileBanner() {
    const [view, setView] = useState("table");
    const [saving, setSaving] = useState(false);
    const [workData, setWorkData] = useState([])
    const [editingId, setEditingId] = useState()

    const [form, setForm] = useState({
        image: null,
        preview: "",
        name: "",
        start: "",

    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (file) => {
        setForm(prev => ({
            ...prev,
            image: file,
            preview: URL.createObjectURL(file)
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();


            if (form.image instanceof File) {
                formData.append("image", form.image);
            }

            // ✅ EDIT CASE
            if (editingId) {
                formData.append("spId", editingId);
            }

            const res =editingId?await updateApiData('admin/patient-banner',formData) : await securePostData(
                "admin/patient-banner",
                formData
            );

            toast.success(res.message);

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
            const res = await getApiData("api/admin/landing/patient");

            const data = res.data?.ptBanner;
            setWorkData(data)
            if (!data) return;



        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const handleAdd = () => {
        setEditingId(null);
        setForm({
            image: null,
            preview: "",
            name: "",
        });
        setView("form");
    }; const handleEdit = (item) => {
        setEditingId(item._id);

        setForm({
            image: item.image,
            preview: `${base_url}/${item.image}`,
            name: item.name,
        });

        setView("form");
    };
    const handleDelete = async (id) => {
        try {
            const res=await deleteApiData(`admin/patient-banner/${id}`);
            if(res?.success){

                toast.success("Deleted");
                fetchData();
            }else{
                toast.error(res?.message)
            }
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="gradient-text">Patient Mobile Banner</h3>

                {view === "table" && (
                    <button className="thm-btn" onClick={handleAdd}>
                        + Add
                    </button>
                )}
            </div>
            {view === "table" && (
                <div className="new-mega-card p-4">
                    <div className="row mt-3 align-items-center" >

                        <div className="col-lg-2">
                            Image
                        </div>


                        <div className="col-lg-2">
                            Action
                        </div>

                    </div>
                    {workData?.map((item) => (
                        <div className="row mt-3 align-items-center" key={item._id}>

                            <div className="col-lg-2">
                                <img
                                    src={`${base_url}/${item.image}`}
                                    style={{ width: 200, borderRadius: 6 }}
                                />
                            </div>


                            <div className="col-lg-2">
                                <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleEdit(item)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>

                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                        </div>
                    ))}

                </div>
            )}
            {view === "form" && (
                <form onSubmit={handleSubmit}>
                    <div className="new-mega-card p-4">

                        <div className="row">




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

export default PtMobileBanner;