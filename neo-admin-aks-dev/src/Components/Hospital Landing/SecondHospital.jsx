import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function SecondHospitalPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        feature: [
            {
                title: "",
                subTitle: "",
                category: "",
                desc: "",
                firstLink: "",
                secondLink: "",
                image: ""
            }
        ],
        otDashboard: [
            {
                title: "",
                status: "",
                progress: "",
                image: ""
            }
        ],
        patientTimeline: "",
        neoAiAssist: ""
    });

    const handleImageUpload = (file, index, type) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            if (type === "feature") {
                const updated = [...form.feature];
                updated[index].imagePreview = reader.result; // preview
                updated[index].file = file; // actual file
                setForm(prev => ({ ...prev, feature: updated }));
            }

            if (type === "ot") {
                const updated = [...form.otDashboard];
                updated[index].imagePreview = reader.result;
                updated[index].file = file;
                setForm(prev => ({ ...prev, otDashboard: updated }));
            }
        };

        reader.readAsDataURL(file);
    };

    // FEATURE HANDLER
    const handleFeatureChange = (index, field, value) => {
        const updated = [...form.feature];
        updated[index][field] = value;
        setForm(prev => ({ ...prev, feature: updated }));
    };

    const addFeature = () => {
        setForm(prev => ({
            ...prev,
            feature: [
                ...prev.feature,
                { title: "", subTitle: "", desc: "", category: "", firstLink: "", secondLink: "", image: "" }
            ]
        }));
    };

    const deleteFeature = (index) => {
        const updated = form.feature.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, feature: updated }));
    };

    // OT DASHBOARD HANDLER
    const handleOtChange = (index, field, value) => {
        const updated = [...form.otDashboard];
        updated[index][field] = value;
        setForm(prev => ({ ...prev, otDashboard: updated }));
    };

    const addOt = () => {
        setForm(prev => ({
            ...prev,
            otDashboard: [
                ...prev.otDashboard,
                { title: "", status: "", progress: "", image: "" }
            ]
        }));
    };

    const deleteOt = (index) => {
        const updated = form.otDashboard.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, otDashboard: updated }));
    };

    // BASIC CHANGE
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // VALIDATION
    const validate = () => {
        if (!form.title) return "Title required";
        if (!form.description) return "Description required";
        return null;
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();

            // basic fields
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("patientTimeline", form.patientTimeline);
            formData.append("neoAiAssist", form.neoAiAssist);

            // remove file before भेजना
            const featureData = form.feature.map(({ file, imagePreview, ...rest }) => rest);
            const otData = form.otDashboard.map(({ file, imagePreview, ...rest }) => rest);

            formData.append("feature", JSON.stringify(featureData));
            formData.append("otDashboard", JSON.stringify(otData));

            // =========================
            // ✅ IMAGE + INDEX MATCHING
            // =========================

            form.feature.forEach((item, index) => {
                if (item.file) {
                    formData.append("image", item.file);
                    formData.append("imageIndex", `feature-${index}`);
                }
            });

            form.otDashboard.forEach((item, index) => {
                if (item.file) {
                    formData.append("image", item.file);
                    formData.append("imageIndex", `ot-${index}`);
                }
            });

            const res = await securePostData(
                "api/admin/landing/second-hospital-page",
                formData
            );

            if (res.success) {
                toast.success("Saved successfully");
            }

        } catch (err) {
            toast.error("Error saving");
        } finally {
            setSaving(false);
        }
    };

    // FETCH
    const fetchData = async () => {
        try {
            const res = await getApiData("api/admin/landing/hospital");
            const data = res.data.secondSection;
            if (!data) return;

            setForm({
                title: data.title || "",
                description: data.description || "",
                feature: data.feature || [],
                otDashboard: data.otDashboard || [],
                patientTimeline: data.patientTimeline || "",
                neoAiAssist: data.neoAiAssist || ""
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
            <h3 className="gradient-text mb-3">ROLE-BASED INTELLIGENCE</h3>

            <form onSubmit={handleSubmit}>
                <div className="new-mega-card p-4">

                    {/* BASIC */}
                    <div className="row">
                        <div className="col-lg-6">
                            <label>Title</label>
                            <input className="form-control nw-select-frm" value={form.title}
                                onChange={(e) => handleChange("title", e.target.value)} />
                        </div>



                        <div className="col-12 mt-3">
                            <label>Description</label>
                            <textarea className="form-control nw-textarea" rows={3}
                                value={form.description}
                                onChange={(e) => handleChange("description", e.target.value)} />
                        </div>

                    </div>

                    {/* FEATURE */}
                    <div className="d-flex justify-content-between mt-4">
                        <h5>Features</h5>
                        <button type="button" onClick={addFeature} className="thm-btn">+ Add</button>
                    </div>

                    {form.feature.map((item, index) => (
                        <div className="row my-3" key={index}>
                            <div className="col-lg-4">
                                <div className="custom-frm-bx">
                                    <label>Category</label>
                                    <input className="form-control nw-select-frm" placeholder="Category"
                                        value={item.category}
                                        onChange={(e) => handleFeatureChange(index, "category", e.target.value)} />

                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="custom-frm-bx">
                                    <label>Title</label>
                                    <input className="form-control nw-select-frm" placeholder="Title"
                                        value={item.title}
                                        onChange={(e) => handleFeatureChange(index, "title", e.target.value)} />
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="custom-frm-bx">
                                    <label>Sub Title </label>
                                    <input className="form-control nw-select-frm" placeholder="Sub Title"
                                        value={item.subTitle}
                                        onChange={(e) => handleFeatureChange(index, "subTitle", e.target.value)} />
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="custom-frm-bx">
                                    <label>Description (seperated by fullstop)</label>
                                    <textarea className="form-control nw-textarea" rows={5} placeholder="Description"
                                        value={item.desc}
                                        onChange={(e) => handleFeatureChange(index, "desc", e.target.value)} />
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="custom-frm-bx">
                                    <label>Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) =>
                                            handleImageUpload(e.target.files[0], index, "feature")
                                        }
                                    />
                                </div>

                                {item.imagePreview || item.image ? (
                                    <img
                                        src={item.imagePreview || base_url +'/'+item.image}
                                        height="50"
                                    />
                                ) : null}
                            </div>

                            <div className="col-lg-2">
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteFeature(index)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                        </div>
                    ))}

                    {/* OT DASHBOARD */}
                    <div className="d-flex justify-content-between mt-4">
                        <h5>OT Dashboard</h5>
                        <button type="button" onClick={addOt} className="thm-btn">+ Add</button>
                    </div>

                    {form.otDashboard.map((item, index) => (
                        <div className="row my-3" key={index}>

                            <div className="col-lg-3">
                                <div className="custom-frm-bx">
                                    <label>Title</label>
                                    <input className="form-control nw-select-frm" placeholder="Title"
                                        value={item.title}
                                        onChange={(e) => handleOtChange(index, "title", e.target.value)} />
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="custom-frm-bx">
                                    <label>Status</label>
                                    <input className="form-control nw-select-frm" placeholder="Live"
                                        value={item.status}
                                        onChange={(e) => handleOtChange(index, "status", e.target.value)} />
                                </div>
                            </div>

                            <div className="col-lg-2">
                                <div className="custom-frm-bx">
                                    <label>Progress Bar</label>
                                    <input type="number" className="form-control nw-select-frm" placeholder="Progress"
                                        value={item.progress}
                                        onChange={(e) => handleOtChange(index, "progress", e.target.value)} />
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="custom-frm-bx">
                                    <label>Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) =>
                                            handleImageUpload(e.target.files[0], index, "ot")
                                        }
                                    />
                                </div>

                                {item.imagePreview || item.image ? (
                                    <img
                                        src={item.imagePreview || base_url +'/'+ item.image}
                                        height="50"
                                    />
                                ) : null}
                            </div>

                            <div className="col-lg-1">
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteOt(index)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                        </div>
                    ))}
                    <div className="col-lg-6">
                        <label>Patient Timeline (seperated by fullstop)</label>
                        <textarea className="form-control nw-textarea" rows={5} value={form.patientTimeline}
                            onChange={(e) => handleChange("patientTimeline", e.target.value)} />
                    </div>
                    <div className="col-12 mt-3">
                        <label>Neo AI Assist</label>
                        <textarea className="form-control nw-select-frm" rows={2}
                            value={form.neoAiAssist}
                            onChange={(e) => handleChange("neoAiAssist", e.target.value)} />
                    </div>

                    <div className="text-end mt-4">
                        <button type="submit" className="nw-thm-btn" disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default SecondHospitalPage;