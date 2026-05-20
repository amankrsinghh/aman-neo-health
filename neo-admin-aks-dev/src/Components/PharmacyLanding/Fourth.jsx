import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function FourthPharPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        model: [
            {
                name: "",
                description: ""
            }
        ]
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


    // ✅ add module
    const addModule = () => {
        setForm(prev => ({
            ...prev,
            model: [
                ...prev.model,
                { number: 0, name: "", description: "" }
            ]
        }));
    };

    // ✅ delete module
    const deleteModule = (index) => {
        const updated = form.model.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, model: updated }));
    };

    // ✅ validation
    const validate = () => {
        if (!form.title) return "Title required";
        if (!form.description) return "Decription required";
        return null;
    };

    // ✅ submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validate();
        if (error) return toast.error(error);

        try {
            setSaving(true);

            const data = { title: form?.title, description: form?.description, model: JSON.stringify(form.model) };


            const res = await securePostData("api/admin/landing/fourth-phar-page", data);
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
            const res = await getApiData("api/admin/landing/pharmacy");

            const data = res.data?.fourthSection;
            if (!data) return;

            setForm({
                title: data.title || "",
                description: data.description || "",
                model: data.model || []
            });

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    ;

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            {/* <h3 className="gradient-text mb-3">Pharmacy Landing Page</h3> */}

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
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.description}
                                    onChange={(e) =>
                                        handleChange("description", e.target.value)
                                    }
                                />
                            </div>
                        </div>





                    </div>

                    <h5 className="mt-4">Module</h5>

                    {form.model.map((item, index) => (
                        <div className="row mt-3" key={index}>



                            <div className="col-lg-5">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Title</label>
                                    <input
                                        className="form-control nw-select-frm"
                                        placeholder="Name"
                                        value={item.name}
                                        onChange={(e) =>
                                            handleModelChange(index, "name", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">List (seperated by comma)</label>
                                    <input
                                        className="form-control nw-select-frm"
                                        placeholder="All permissions,User/role management"
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
                                    onClick={() => deleteModule(index)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                        </div>
                    ))}

                    <button type="button" onClick={addModule} className="mt-3">
                        + Add Module
                    </button>

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

export default FourthPharPage;