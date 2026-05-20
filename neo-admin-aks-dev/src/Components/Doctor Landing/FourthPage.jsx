import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function FourthDoctorPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",

        model: [
            {
                title: "",
                description: ""
            }
        ]
    });

    const handleModelChange = (index, field, value) => {
        const updated = [...form.model];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        setForm(prev => ({ ...prev, model: updated }));
    };
    const addModel = () => {
        setForm(prev => ({
            ...prev,
            model: [
                ...prev.model,
                { title: "", description: "" }
            ]
        }));
    };
    const deleteModel = (index) => {
        const updated = form.model.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, model: updated }));
    };

    // ✅ handle change
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
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
            setSaving(true);



            const res = await securePostData("api/admin/landing/fourth-doctor-page", form);
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

            const data = res.data?.fourthSection;
            if (!data) return;

            setForm({
                title: data.title || "",
                description: data.description || "",
                model: data?.model || [{ name: "", description: "", title: "" }]
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




                    </div>

                    <div className="d-flex justify-content-between">
                        <h5 className="mt-4">Capabilities</h5>
                        <button type="button" onClick={addModel} className="thm-btn mt-3">
                            + Add Capabilities
                        </button>
                    </div>

                    {form.model.map((item, index) => (
                        <div className="row my-3" key={index}>


                            <div className="col-lg-5">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Title</label>
                                    <input
                                        className="form-control nw-select-frm"
                                        placeholder=""
                                        value={item.title}
                                        onChange={(e) =>
                                            handleModelChange(index, "title", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Description</label>
                                    <input
                                        type="text"
                                        className="form-control nw-select-frm"
                                        placeholder=""
                                        value={item.description}
                                        onChange={(e) =>
                                            handleModelChange(index, "description", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="col-lg-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteModel(index)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>




                        </div>
                    ))}









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

export default FourthDoctorPage;