import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";

function ReadLineMainPage() {
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        readiness: {
            title: "",
            description: "",
            btnLink: { first: "", second: "" },
            feature: [""]
        }
    });

    // ─── Generic field updater ─────────────────────────────────────────────────
    const handleFieldChange = (section, field, value) => {
        setForm((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };




    const handleFeatureChange = (section, index, value) => {
        const updated = [...form[section].feature];
        updated[index] = value;

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
                feature: [...prev[section].feature, ""]
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
        if (!form.readiness.title) return "Interoperability: Title required";
        if (!form.readiness.description) return "Interoperability: Description required";
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
                readiness: JSON.stringify(form.readiness),
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
                readiness: {
                    title: data.readiness?.title || "",
                    description: data.readiness?.description || "",
                    feature: data.readiness?.feature?.length
                        ? data.readiness.feature
                        : [""],
                    btnLink: data.readiness?.btnLink || { first: "", second: "" }
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
                <div className="col-lg-10">
                    <div className="custom-frm-bx">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-control nw-select-frm"
                            placeholder="Title"
                            value={item}
                            onChange={(e) =>
                                handleFeatureChange(section, index, e.target.value)
                            }
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


                <h3 className=" mb-3">Institutional readiness</h3>
                <div className="new-mega-card p-4 mb-4">
                    <div className="row">

                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    placeholder="Interoperability Title"
                                    value={form.readiness.title}
                                    onChange={(e) => handleFieldChange("readiness", "title", e.target.value)}
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
                                    value={form.readiness.description}
                                    onChange={(e) => handleFieldChange("readiness", "description", e.target.value)}
                                />
                            </div>
                        </div>


                    </div>

                    <FeatureBlock section="readiness" />


                    {/* <div className="row">
                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>Button Link 1</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    placeholder="First Link"
                                    value={form.readiness.btnLink.first}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            readiness: {
                                                ...prev.readiness,
                                                btnLink: {
                                                    ...prev.readiness.btnLink,
                                                    first: e.target.value
                                                }
                                            }
                                        }))
                                    }
                                />

                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>Button Link 2</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    placeholder="Second Link"
                                    value={form.readiness.btnLink.second}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            readiness: {
                                                ...prev.readiness,
                                                btnLink: {
                                                    ...prev.readiness.btnLink,
                                                    second: e.target.value
                                                }
                                            }
                                        }))
                                    }
                                />

                            </div>
                        </div>
                    </div> */}
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

export default ReadLineMainPage;