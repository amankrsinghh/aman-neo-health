import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function FirstHospitalPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        subTitle: "",
        description: "",
        btnLink: {first:"",second:""},    
        topShot: [""],

        bottomShot: [
            {
                category: "",
                title: "",
                detail:""
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
                { category: "",title:"",detail: "" }
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





    // ✅ validation
    const validate = () => {
        if (!form.title) return "Title required";
        if (!form.subTitle) return "Sub title required";
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



            const res = await securePostData("api/admin/landing/first-hospital-page", form);
            if (res.success) {
                toast.success("Data updated")
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
            const res = await getApiData("api/admin/landing/hospital");

            const data = res.data?.firstSection;
            if (!data) return;

            setForm({
                title: data.title || "",
                subTitle: data.subTitle || "",
                description: data.description || "",
                btnLink: data.btnLink || "",
                topShot: data.topShot || [""],
                bottomShot: data?.bottomShot || [{ title: "", category: "",detail:"" }],
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
            <h3 className="gradient-text mb-3">Hero Section</h3>

            <form onSubmit={handleSubmit}>
                <div className="new-mega-card p-4">
                    <div className="row">

                        <div className="col-lg-6">
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

                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>Sub Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.subTitle}
                                    onChange={(e) =>
                                        handleChange("subTitle", e.target.value)
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

                        <h4>Button Link</h4>
                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>First Link</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.btnLink.first}
                                    onChange={(e) =>
                                       setForm({...form,btnLink:{...form.btnLink,first:e.target.value}})
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="custom-frm-bx">
                                <label>Second Link</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.btnLink.second}
                                    onChange={(e) =>
                                        setForm({...form,btnLink:{...form.btnLink,second:e.target.value}})
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
                                    placeholder="Unified Patient ID"
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

                            <div className="col-lg-3">
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    placeholder="Care Continuum"
                                    value={item.category}
                                    onChange={(e) =>
                                        handleBottomShotChange(index, "category", e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-lg-4">
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="OPD → IPD → ICU → OT"
                                    value={item.title}
                                    onChange={(e) =>
                                        handleBottomShotChange(index, "title", e.target.value)
                                    }
                                />
                            </div>
                             <div className="col-lg-4">
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="single timeline"
                                    value={item.detail}
                                    onChange={(e) =>
                                        handleBottomShotChange(index, "detail", e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-lg-1">
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

export default FirstHospitalPage;