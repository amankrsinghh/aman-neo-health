import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function MainHeroPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        secondTitle: "",
        description: "",
        btnLink: { first: "", second: "" },
        bottomDesc: "",
        appUiDesc: "",
        topShot: [""],
        appUiShot: [""],
        bottomShot: [
            {
                label: "",
                value: "",
            }
        ],
        neoHealthCard: {
            title: "",
            subTitle: "",
            topShot: [""],
            feature: [{ image: null,preview:null, title: "", desc: "" }],
            neoAiDesc: ""
        }
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
        if (!form.title) return "First title required";
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
        const formData = new FormData();

        // Standard Fields
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("bottomDesc", form.bottomDesc);
        formData.append("appUiDesc", form.appUiDesc);

        // Object Fields (Stringify)
        formData.append("btnLink", JSON.stringify(form.btnLink));
        formData.append("bottomShot", JSON.stringify(form.bottomShot));

        // NeoHealthCard Logic
        // Hum images ko chhod kar baki data stringify karke bhejenge
        const neoHealthCardData = { ...form.neoHealthCard };
        formData.append("neoHealthCard", JSON.stringify(neoHealthCardData));

        // Feature Images Upload
        form.neoHealthCard.feature.forEach((f, i) => {
            if (f.image instanceof File) {
                formData.append(`featureImage_${i}`, f.image);
            }
        });

        const res = await securePostData("api/admin/landing/first-main-page", formData);
        
        if (res.success) {
            fetchData();
            toast.success("Data Saved Successfully");
        }
    } catch (err) {
        toast.error("Failed to save");
    } finally {
        setSaving(false);
    }
};

    // ✅ get data
    const fetchData = async () => {
        try {
            const res = await getApiData("api/admin/landing/main");

            const data = res.data?.firstSection;
            if (!data) return;

            setForm({
                title: data.title || "",
                secondTitle: data.secondTitle || "",
                bottomDesc: data.bottomDesc || "",
                appUiDesc: data.appUiDesc || "",
                description: data.description || "",
                btnLink: data.btnLink || { first: "", second: "" },
                topShot: data.topShot || [""],
                bottomShot: data?.bottomShot || [{ label: "", value: "" }],
                appUiShot: data?.appUiShot || [""],
                neoHealthCard: {
                    title: data?.neoHealthCard?.title || "",
                    subTitle: data?.neoHealthCard?.subTitle || "",
                    topShot: data?.neoHealthCard?.topShot || [""],
                    feature: data?.neoHealthCard?.feature || [{ image: null, title: "", desc: "" }],
                    neoAiDesc: data?.neoHealthCard?.neoAiDesc || ""
                }
            });

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    // ✅ neoHealthCard simple fields
    const handleNeoChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            neoHealthCard: {
                ...prev.neoHealthCard,
                [field]: value
            }
        }));
    };

    // ✅ neoHealthCard topShot
    const handleNeoTopShotChange = (index, value) => {
        const updated = [...form.neoHealthCard.topShot];
        updated[index] = value;

        handleNeoChange("topShot", updated);
    };

    const addNeoTopShot = () => {
        handleNeoChange("topShot", [...form.neoHealthCard.topShot, ""]);
    };

    const deleteNeoTopShot = (index) => {
        const updated = form.neoHealthCard.topShot.filter((_, i) => i !== index);
        handleNeoChange("topShot", updated);
    };

    // ✅ Feature handlers
    const handleFeatureChange = (index, field, value) => {
        const updated = [...form.neoHealthCard.feature];
        updated[index][field] = value;

        handleNeoChange("feature", updated);
    };

    const handleFeatureImage = (index, file) => {
        const updated = [...form.neoHealthCard.feature];
        updated[index].image = file;
        updated[index].preview = URL.createObjectURL(file);

        handleNeoChange("feature", updated);
    };

    const addFeature = () => {
        handleNeoChange("feature", [
            ...form.neoHealthCard.feature,
            { image: null, title: "", desc: "" }
        ]);
    };

    const deleteFeature = (index) => {
        const updated = form.neoHealthCard.feature.filter((_, i) => i !== index);
        handleNeoChange("feature", updated);
    };

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

                        {/* BUTTON LINKS */}
                        {/* <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label> Button Link 1</label>
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="Button 1"
                                    value={form.btnLink?.first}
                                    onChange={(e) =>
                                        handleNestedChange("btnLink", "first", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label> Button Link 2</label>
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="Button 1"
                                    value={form.btnLink?.second}
                                    onChange={(e) =>
                                        handleNestedChange("btnLink", "second", e.target.value)
                                    }
                                />
                            </div>
                        </div> */}




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
                    <div className="row">
                        <h4>NEOHEALTHCARD</h4>
                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.neoHealthCard.title}
                                    onChange={(e) => handleNeoChange("title", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Description</label>
                                <textarea
                                    className="form-control nw-select-frm"
                                    rows={4}
                                    value={form.neoHealthCard.subTitle}
                                    onChange={(e) => handleNeoChange("subTitle", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <h5 className="mt-4">Top Items</h5>
                            <button type="button" onClick={addNeoTopShot} className="thm-btn mt-3">
                                + Add Module
                            </button>
                        </div>

                        {form.neoHealthCard.topShot.map((item, index) => (
                            <div className="row my-3" key={index}>
                                <div className="col-lg-10">
                                    <input
                                        className="form-control nw-select-frm"
                                        value={item}
                                        onChange={(e) =>
                                            handleNeoTopShotChange(index, e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-lg-2">
                                    <button type="button" onClick={() => deleteNeoTopShot(index)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="d-flex justify-content-between">
                            <h5 className="mt-4">Feature</h5>
                            <button type="button" onClick={addFeature} className="thm-btn mt-3">
                                + Add Feature
                            </button>
                        </div>

                        {form.neoHealthCard.feature.map((item, index) => (
                            <div className="row my-3" key={index}>

                                <div className="col-lg-3">
                                    <input
                                        type="file"
                                        className="form-control nw-select-frm"
                                        onChange={(e) =>
                                            handleFeatureImage(index, e.target.files[0])
                                        }
                                    />
                                    {item.preview || item.image ? (
                                    <img
                                        src={item.preview || base_url + '/'+item.image}
                                        height="50"
                                    />
                                ) : null}
                                </div>

                                <div className="col-lg-4">
                                    <input
                                        value={item.title}
                                        className="form-control nw-select-frm"
                                        onChange={(e) =>
                                            handleFeatureChange(index, "title", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-lg-4">
                                    <input
                                        value={item.desc}
                                        className="form-control nw-select-frm"
                                        onChange={(e) =>
                                            handleFeatureChange(index, "desc", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-lg-1">
                                    <button className="btn btn-danger" onClick={() => deleteFeature(index)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>NeoAI (Clinician-oversight)</label>
                                <textarea
                                    className="form-control nw-select-frm"
                                    rows={4}
                                    value={form.neoHealthCard.neoAiDesc}
                                    onChange={(e) =>
                                        handleNeoChange("neoAiDesc", e.target.value)
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

export default MainHeroPage;