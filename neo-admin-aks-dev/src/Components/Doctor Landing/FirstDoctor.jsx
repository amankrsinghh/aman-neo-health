import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function FirstDoctorPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        firstTitle: "",
        secondTitle: "",
        description: "",
        btnLink: "",
        bottomDesc: "",
        appUiDesc: "",

        topShot: [""],
        appUiShot: [""],

        bottomShot: [
            {
                label: "",
                value: "",
            }
        ]
    });
    const handleTopShotChange = (index, value) => {
        const updated = [...form.topShot];
        updated[index] = value;

        setForm(prev => ({ ...prev, topShot: updated }));
    };

    const addTopShot = () => {
        setForm(prev => ({
            ...prev,
            topShot: [...prev.topShot, ""]
        }));
    };

    const deleteTopShot = (index) => {
        const updated = form.topShot.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, topShot: updated }));
    };
    const handleAppUiShotChange = (index, value) => {
        const updated = [...form.appUiShot];
        updated[index] = value;

        setForm(prev => ({ ...prev, appUiShot: updated }));
    };

    const addAppUiShot = () => {
        setForm(prev => ({
            ...prev,
            appUiShot: [...prev.appUiShot, ""]
        }));
    };

    const deleteAppUiShot = (index) => {
        const updated = form.appUiShot.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, appUiShot: updated }));
    };
    const handleBottomShotChange = (index, field, value) => {
        const updated = [...form.bottomShot];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        setForm(prev => ({ ...prev, bottomShot: updated }));
    };
    const addBottomShot = () => {
        setForm(prev => ({
            ...prev,
            bottomShot: [
                ...prev.bottomShot,
                { label: "", value: "" }
            ]
        }));
    };
    const deleteBottomShot = (index) => {
        const updated = form.bottomShot.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, bottomShot: updated }));
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
            bottomShot: [
                ...prev.bottomShot,
                { label: "", value: "" }
            ]
        }));
    };

    // ✅ delete module
    const deleteModule = (index) => {
        const updated = form.bottomShot.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, bottomShot: updated }));
    };




    // ✅ validation
    const validate = () => {
        if (!form.firstTitle) return "First title required";
        if (!form.secondTitle) return "Second title required";
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



            const res = await securePostData("api/admin/landing/first-doctor-page", form);
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

            const data = res.data?.firstSection;
            if (!data) return;

            setForm({
                firstTitle: data.firstTitle || "",
                secondTitle: data.secondTitle || "",
                bottomDesc: data.bottomDesc || "",
                appUiDesc: data.appUiDesc || "",
                description: data.description || "",
                btnLink: data.btnLink || "",
                topShot: data.topShot || [""],
                bottomShot: data?.bottomShot || [{ label: "", value: "" }],
                appUiShot: data?.appUiShot || [""]
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
                                <label> Button Link</label>
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="Button 1"
                                    value={form.btnLink}
                                    onChange={(e) =>
                                        handleChange("btnLink", e.target.value)
                                    }
                                />
                            </div>
                        </div>




                    </div>
                    <div className="d-flex justify-content-between">
                        <h5 className="mt-4">Top Items</h5>
                        <button type="button" onClick={addTopShot} className="thm-btn mt-3">
                            + Add Module
                        </button>
                    </div>

                    {form.topShot.map((item, index) => (
                        <div className="row my-3" key={index}>



                            <div className="col-lg-10">
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="Name"
                                    value={item}
                                    onChange={(e) =>
                                        handleTopShotChange(index, e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-lg-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteTopShot(index)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                        </div>
                    ))}
                    <div className="d-flex justify-content-between">
                        <h5 className="mt-4">Bottom Items</h5>
                        <button type="button" onClick={addBottomShot} className="thm-btn mt-3">
                            + Add Module
                        </button>
                    </div>

                    {form.bottomShot.map((item, index) => (
                        <div className="row my-3" key={index}>

                            <div className="col-lg-5">
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    placeholder="01"
                                    value={item.label}
                                    onChange={(e) =>
                                        handleBottomShotChange(index, "label", e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-lg-5">
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="Name"
                                    value={item.value}
                                    onChange={(e) =>
                                        handleBottomShotChange(index, "value", e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-lg-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteBottomShot(index)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>



                        </div>
                    ))}







                    <div className="col-lg-6">
                        <div className="custom-frm-bx">
                            <label> Bottom Description</label>
                            <input
                                className="form-control nw-select-frm"
                                placeholder=""
                                value={form.bottomDesc}
                                onChange={(e) =>
                                    handleChange("bottomDesc", e.target.value)
                                }
                            />
                        </div>
                    </div>
                      <div className="d-flex justify-content-between">
                        <h5 className="mt-4">Docot Ui Shot</h5>
                        <button type="button" onClick={addAppUiShot} className="thm-btn mt-3">
                            + Add Module
                        </button>
                    </div>

                    {form.appUiShot.map((item, index) => (
                        <div className="row my-3" key={index}>



                            <div className="col-lg-10">
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="Name"
                                    value={item}
                                    onChange={(e) =>
                                        handleAppUiShotChange(index, e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-lg-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteAppUiShot(index)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                        </div>
                    ))}
                    <div className="col-lg-6">
                        <div className="custom-frm-bx">
                            <label> App Ui Description</label>
                            <input
                                className="form-control nw-select-frm"
                                placeholder=""
                                value={form.appUiDesc}
                                onChange={(e) =>
                                    handleChange("appUiDesc", e.target.value)
                                }
                            />
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

export default FirstDoctorPage;