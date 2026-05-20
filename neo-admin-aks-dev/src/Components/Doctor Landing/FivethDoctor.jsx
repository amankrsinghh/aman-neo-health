import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function FivethDoctorPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        tag: "",
        title: "",
        description: "",
        btnLink: ""


    });



    // ✅ handle change
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };







    // ✅ validation
    const validate = () => {
        if (!form.tag) return "Tag required";
        if (!form.title) return "Title required";
        if (!form.description) return "Description required";
        return null;
    };

    // ✅ submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validate();
        if (error) return toast.error(error);

        try {
            setSaving(true);



            const res = await securePostData("api/admin/landing/fiveth-doctor-page", form);
            if (res.success) {
                fetchData()
            }

            toast.success(res.data.message);

        } catch (err) {
            console.log(err)
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    // ✅ get data
    const fetchData = async () => {
        try {
            const res = await getApiData("api/admin/landing/doctor");

            const data = res.data?.fivethSection;
            if (!data) return;

            setForm({
                title: data.title || "",
                description: data.description || "",
                tag: data?.tag || "",
                btnLink: data?.btnLink || ""
            });

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            {/* <h3 className="gradient-text mb-3">Doctor Landing Page</h3> */}

            <form onSubmit={handleSubmit}>
                <div className="new-mega-card p-4">
                    <div className="row">

                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Tag</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.tag}
                                    onChange={(e) =>
                                        handleChange("tag", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.title}
                                    onChange={(e) =>
                                        handleChange("title", e.target.value)
                                    }
                                />
                            </div>
                        </div>



                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Description</label>
                                <textarea
                                    className="form-control nw-select-frm"
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) =>
                                        handleChange("description", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                         <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Button Link</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.btnLink}
                                    onChange={(e) =>
                                        handleChange("btnLink", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                    </div>                    
                   







                    <div className="text-end mt-4">
                        <button type="submit" className="nw-thm-btn" disabled={saving}>
                            {saving ? "Saving..." : "Save Landing"}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default FivethDoctorPage;