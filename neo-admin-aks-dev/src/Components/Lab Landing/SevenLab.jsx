import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function SevenLabPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        btnLink: {
            first: "",
            second: ""
        },
    });

    // ✅ handle change
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setForm(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    // ✅ model change
    const handleModelChange = (index, field, value) => {
        const updated = [...form.model];
        updated[index][field] = value;
        setForm(prev => ({ ...prev, model: updated }));
    };


    


    // ✅ validation
    const validate = () => {
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
            const data={...form,btnLink:JSON.stringify(form.btnLink)}
            setSaving(true);
            

            const res = await securePostData("api/admin/landing/seven-lab-page", data);
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
            const res = await getApiData("api/admin/landing/lab");

            const data = res.data?.sevenSection;
            if (!data) return;

            setForm({
                title: data.title || "",
                description: data.description || "",
                btnLink: data.btnLink || { first: "", second: "" },
            });

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const getImageSrc = (item) => {
        if (item?.preview) return item.preview;
        if (item?.image) return `${base_url}/${item.image}`;
        return null;
    };

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            {/* <h3 className="gradient-text mb-3">Laboratory Landing Page</h3> */}

            <form onSubmit={handleSubmit}>
                <div className="new-mega-card p-4">
                    <div className="row">

                        <div className="col-12">
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

                        {/* BUTTON LINKS */}
                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label> Button 1 Link</label>
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="Button 1"
                                    value={form.btnLink.first}
                                    onChange={(e) =>
                                        handleNestedChange("btnLink", "first", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label> Button 2 Link</label>
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder=""
                                    value={form.btnLink.second}
                                    onChange={(e) =>
                                        handleNestedChange("btnLink", "second", e.target.value)
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

export default SevenLabPage;