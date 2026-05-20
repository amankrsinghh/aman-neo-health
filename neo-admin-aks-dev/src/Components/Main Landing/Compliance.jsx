import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";

function CompliancePage() {
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        compliance: {
            title:"",
            description: "",
            feature: [{ name:"", description: "" }]
        }
    });

    // ─── Generic field updater ─────────────────────────────────────────────────
    const handleFieldChange = (section, field, value) => {
        setForm((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };




    const handleFeatureChange = (section, index, field, value) => {
        const updated = [...form[section].feature];
        updated[index] = {
            ...updated[index],
            [field]: value
        };

        setForm((prev) => ({
            ...prev,
            [section]: { ...prev[section], feature: updated }
        }));
    };

    const addFeature = (section) => {
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                feature: [
                    ...prev[section].feature,
                    { name:"", description: "" }
                ]
            }
        }));
    };

    const deleteFeature = (section, index) => {
        const updated = form[section].feature.filter((_, i) => i !== index);

        setForm((prev) => ({
            ...prev,
            [section]: { ...prev[section], feature: updated }
        }));
    };

    // ─── Validate ─────────────────────────────────────────────────────────────
    const validate = () => {
        if (!form.compliance.title) return "Interoperability: Title required";
        if (!form.compliance.description) return "Interoperability: Description required";
        return null;
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validate();
        if (error) return toast.error(error);

        try {
            setSaving(true);
            const data = {
                compliance: JSON.stringify(form.compliance),
                // security: form.security,
                // deployment: form.deployment,
            }
            const res = await securePostData("api/admin/landing/fourth-main-page", data);
            if (res?.success) {
                toast.success("Data updated successfully");
                fetchData();
            } else {
                toast.error("Something went wrong");
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    // ─── Fetch ────────────────────────────────────────────────────────────────
    const fetchData = async () => {
        try {
            const res = await getApiData("api/admin/landing/main");
            const data = res.data?.fourthSection;
            if (!data) return;

            setForm({
                compliance: {
                    title: data.compliance?.title || "",
                    description: data.compliance?.description || "",
                    feature: data.compliance?.feature?.length
                        ? data.compliance.feature
                        : [{ name:"", description: "" }],
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ─── Reusable Feature Block ────────────────────────────────────────────────
    const FeatureBlock = ({ section }) => (
        <>
            <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
                <h5 className="mb-0">Features</h5>
                <button type="button" onClick={() => addFeature(section)} className="thm-btn">
                    <FontAwesomeIcon icon={faPlus} /> Add Feature
                </button>
            </div>

            {form[section].feature.map((item, index) => (
                <div className="row my-3 align-items-center" key={index}>

                    {/* Title */}
                    <div className="col-lg-5">
                        <div className="custom-frm-bx">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control nw-select-frm"
                                placeholder="Title"
                                value={item.name || ""}
                                onChange={(e) =>
                                    handleFeatureChange(section, index, "name", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="col-lg-5">
                        <div className="custom-frm-bx">
                            <label>Description</label>
                            <input
                                type="text"
                                className="form-control nw-select-frm"
                                placeholder="Description"
                                value={item.description || ""}
                                onChange={(e) =>
                                    handleFeatureChange(section, index, "description", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Delete */}
                    <div className="col-lg-2 text-center">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteFeature(section, index)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>

                </div>
            ))}
        </>
    );

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            <form onSubmit={handleSubmit}>


                <h3 className=" mb-3">Institutional compliance</h3>
                <div className="new-mega-card p-4 mb-4">
                    <div className="row">

                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    placeholder="Interoperability Title"
                                    value={form.compliance.title}
                                    onChange={(e) => handleFieldChange("compliance", "title", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Description</label>
                                <textarea
                                    className="form-control nw-select-frm"
                                    rows={3}
                                    placeholder="Interoperability description..."
                                    value={form.compliance.description}
                                    onChange={(e) => handleFieldChange("compliance", "description", e.target.value)}
                                />
                            </div>
                        </div>


                    </div>

                    <FeatureBlock section="compliance" />
                </div>


                {/* ─── Save Button ─────────────────────────────────────── */}
                <div className="text-end mt-2 mb-5">
                    <button type="submit" className="nw-thm-btn" disabled={saving}>
                        {saving ? "Saving..." : "Save All Sections"}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default CompliancePage;