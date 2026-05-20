import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";

function SecurityHospitalPage() {
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        security: {
            title: "",
            description: "",
            btnLink: { first: "", second: "" },
            category: [""],
            feature: [{ title: "", subTitle: "", detail: "" }],
        },
         interoperability: {
            title: "",
            description: "",
            feature: [{ title: "", subTitle: "", detail: "" }],
            migrationDesc: "",
            btnLink: "",
        },
        deployment: {
            title: "",
            description: "",
            feature: [{ title: "", subTitle: "", detail: "" }],
        },
    });

    // ─── Generic field updater ─────────────────────────────────────────────────
    const handleFieldChange = (section, field, value) => {
        setForm((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };



    // ─── Feature handlers (all sections) ──────────────────────────────────────
    const handleFeatureChange = (section, index, field, value) => {
        const updated = [...form[section].feature];
        updated[index] = { ...updated[index], [field]: value };
        setForm((prev) => ({ ...prev, [section]: { ...prev[section], feature: updated } }));
    };

    const addFeature = (section) => {
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                feature: [...prev[section].feature, { title: "", subTitle: "", detail: "" }],
            },
        }));
    };

    const deleteFeature = (section, index) => {
        const updated = form[section].feature.filter((_, i) => i !== index);
        setForm((prev) => ({ ...prev, [section]: { ...prev[section], feature: updated } }));
    };

    // ─── Validate ─────────────────────────────────────────────────────────────
    const validate = () => {
        if (!form.security.title) return "Security: Title required";
        if (!form.security.description) return "Security: Description required";
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
                // deployment: form.deployment,
                // interoperability: form.interoperability,
                security: JSON.stringify(form.security),
            }
            const res = await securePostData("api/admin/landing/fourth-hospital-page", data);
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
            const res = await getApiData("api/admin/landing/hospital");
            const data = res.data?.fourthSection;
            if (!data) return;

            setForm({
                security: {
                    title: data.security?.title || "",
                    description: data.security?.description || "",
                    btnLink: data.security?.btnLink || { first: "", second: "" },
                    category: data.security?.category?.length ? data.security.category : [""],
                    feature: data.security?.feature?.length
                        ? data.security.feature
                        : [{ title: "", subTitle: "", detail: "" }],
                },
                deployment:data?.deployment,
                interoperability:data?.interoperability
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
                    <div className="col-lg-6">
                        <div className="custom-frm-bx">
                            <label htmlFor="Title">Title</label>
                            <input
                                type="text"
                                className="form-control nw-select-frm"
                                placeholder="Title"
                                value={item.title}
                                onChange={(e) => handleFeatureChange(section, index, "title", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="custom-frm-bx">
                            <label >Sub Title</label>
                        <input
                            type="text"
                            className="form-control nw-select-frm"
                            placeholder="Sub Title"
                            value={item.subTitle}
                            onChange={(e) => handleFeatureChange(section, index, "subTitle", e.target.value)}
                        />
                        </div>
                    </div>
                    <div className="col-lg-10">
                        <div className="custom-frm-bx">
                            <label >Description (seperated by fullstop)</label>
                        <textarea
                            type="text"
                            className="form-control nw-textarea"
                            placeholder="Detail"
                            value={item.detail}
                            onChange={(e) => handleFeatureChange(section, index, "detail", e.target.value)}
                        />
                        </div>
                    </div>
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

                <h3 className="gradient-text mb-3">Security</h3>
                <div className="new-mega-card p-4 mb-4">
                    <div className="row">

                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    placeholder="Security Title"
                                    value={form.security.title}
                                    onChange={(e) => handleFieldChange("security", "title", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Description</label>
                                <textarea
                                    className="form-control nw-select-frm"
                                    rows={3}
                                    placeholder="Security description..."
                                    value={form.security.description}
                                    onChange={(e) => handleFieldChange("security", "description", e.target.value)}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Categories */}


                    <FeatureBlock section="security" />
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

export default SecurityHospitalPage;