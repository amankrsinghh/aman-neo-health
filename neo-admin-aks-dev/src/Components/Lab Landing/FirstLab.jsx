import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function FirstLabPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        firstTitle: "",
        secondTitle: "",
        description: "",
        topShot: [""],
        bottomShot: [{ label: "", value: "" }],
        snapShot: [""],

    });
    const addItem = (section) => {
        setForm(prev => ({
            ...prev,
            [section]: [...prev[section], ""]
        }));
    };
    const deleteItem = (section, index) => {
        const updated = form[section].filter((_, i) => i !== index);

        setForm(prev => ({
            ...prev,
            [section]: updated
        }));
    };
    const handleArrayChange = (section, index, value) => {
        const updated = [...form[section]];
        updated[index] = value;

        setForm(prev => ({
            ...prev,
            [section]: updated
        }));
    };

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

    // ✅ image upload + preview
    const handleImageChange = (index, file) => {
        const updated = [...form.model];

        updated[index].image = file;
        updated[index].preview = URL.createObjectURL(file);

        setForm(prev => ({ ...prev, model: updated }));
    };

    // ✅ add module
    const addModule = () => {
        setForm(prev => ({
            ...prev,
            model: [
                ...prev.model,
                { image: null, preview: "", name: "", description: "" }
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
        if (!form.firstTitle) return "First title required";
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

            const data = {...form,}



            const res = await securePostData("api/admin/landing/first-lab-page", data);
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

            const data = res.data?.firstSection;
            if (!data) return;

            setForm({
                firstTitle: data.firstTitle || "",
                secondTitle: data.secondTitle || "",
                description: data.description || "",
                topShot: data?.topShot || [""],
                bottomShot: data?.bottomShot || [{ label: "", value: "" }],
                snapShot: data?.snapShot || [""]

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
    const handleBottomShotChange = (index, field, value) => {
    const updated = [...form.bottomShot];

    updated[index] = {
        ...updated[index],
        [field]: value
    };

    setForm(prev => ({
        ...prev,
        bottomShot: updated
    }));
};

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            {/* <h3 className="gradient-text mb-3">Laboratory Landing Page</h3> */}

            <form onSubmit={handleSubmit}>
                <div className="new-mega-card p-4">
                    <div className="row">

                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>First Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.firstTitle}
                                    onChange={(e) =>
                                        handleChange("firstTitle", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>Second Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.secondTitle}
                                    onChange={(e) =>
                                        handleChange("secondTitle", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Description</label>
                                <textarea
                                    className="form-control nw-textarea"
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) =>
                                        handleChange("description", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">

                            <h5 className="mt-4">Top Module</h5>
                            <button type="button" onClick={() => addItem("topShot")} className="thm-btn mt-2">
                                + Add
                            </button>
                        </div>
                        {/* BUTTON LINKS */}
                        {form?.topShot?.map((item, index) => (
                            <div className="row mt-2" key={index}>
                                <div className="col-lg-10">
                                    <input
                                        className="form-control nw-select-frm"
                                        value={item}
                                        onChange={(e) =>
                                            handleArrayChange("topShot", index, e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-lg-2">
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteItem("topShot", index)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="d-flex justify-content-between">
                            <h5 className="mt-4">Bottom Module</h5>
                            <button type="button" onClick={() => addItem("bottomShot")} className="thm-btn mt-2">
                                + Add
                            </button>
                        </div>

                        {form?.bottomShot?.map((item, index) => (
                            <div className="row mt-2" key={index}>
                                <div className="col-5">
                                    <div className="cusotm-frm-bx">
                                        <label htmlFor="">Type</label>
                                        <input
                                            className="form-control nw-select-frm"
                                            value={item?.label}
                                            placeholder="End-to-end"
                                            onChange={(e) =>
                                                handleBottomShotChange(index,"label" ,e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="cusotm-frm-bx">
                                        <label htmlFor="">Value</label>
                                        <input
                                            className="form-control nw-select-frm"
                                            value={item?.value}
                                            placeholder="Sample → Report workflow"
                                            onChange={(e) =>
                                                handleBottomShotChange( index, "value",e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-2">
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteItem("bottomShot", index)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="d-flex justify-content-between">

                            <h5 className="mt-4">Live Workflow Snapshot</h5>
                            <button type="button" onClick={() => addItem("snapShot")} className="thm-btn smt-2">
                                + Add
                            </button>
                        </div>

                        {form.snapShot.map((item, index) => (
                            <div className="row mt-2" key={index}>
                                <div className="col-lg-10">
                                    <input
                                        className="form-control nw-select-frm"
                                        value={item}
                                        onChange={(e) =>
                                            handleArrayChange("snapShot", index, e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-lg-2">
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteItem("snapShot", index)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}


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

export default FirstLabPage;