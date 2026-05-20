import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function ThirdHospitalPage() {

    const [saving, setSaving] = useState(false);
    const [activeCategory, setActiveCategory] = useState("");

    const [form, setForm] = useState({
        title: "",
        subTitle: "",
        description: "",
        bottomShot: [
            {
                category: "",
                title: "",
                subTitle: "",
                detail: ""
            }
        ],
        phasedRollout: {
            desc: "",
            firstLink: "",
            secondLink: ""
        }

    });
    const categories = [...new Set(form.bottomShot.map(item => item.category))];


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
                { category: activeCategory ||"", title: "", detail: "", subTitle: "" }
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



            const res = await securePostData("api/admin/landing/third-hospital-page", form);
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

            const data = res.data?.thirdSection;
            if (!data) return;

            setForm({
                title: data.title || "",
                description: data.description || "",
                phasedRollout: data.phasedRollout || "",
                bottomShot: data?.bottomShot || [{ title: "", category: "", detail: "", subTitle: "" }],
            });

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        if (form.bottomShot.length > 0 && !activeCategory) {
            setActiveCategory(form.bottomShot[0].category);
        }
    }, [form.bottomShot]);

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            <h3 className="gradient-text mb-3">Hospital Feature Set</h3>

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
                        <h5 className="mt-4">Feature Items</h5>
                        <button type="button" onClick={addBottomShot} className="thm-btn mt-3">
                            + Add Module
                        </button>
                    </div>
                    <div className="d-flex gap-2 flex-wrap mb-3">
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`btn ${activeCategory === cat ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat || "Uncategorized"}
                            </button>
                        ))}
                    </div>
                    {form.bottomShot
                        .filter(item => item.category === activeCategory)
                        .map((item, index) => {
                            const realIndex = form.bottomShot.findIndex(
                                i => i === item
                            );

                            return (
                                <div className="row my-3" key={realIndex}>

                                    <div className="col-lg-5">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Category</label>
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
                                    </div>

                                    <div className="col-lg-5">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Title</label>
                                            <input
                                                className="form-control nw-select-frm"
                                                placeholder="OPD → IPD → ICU → OT"
                                                value={item.title}
                                                onChange={(e) =>
                                                    handleBottomShotChange(realIndex, "title", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                     <div className="col-lg-2">
                                        <button
                                            type="button"
                                            onClick={() => deleteBottomShot(realIndex)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                    <div className="col-lg-5">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Sub Title</label>
                                            <input
                                                className="form-control nw-select-frm"
                                                placeholder="OPD → IPD → ICU → OT"
                                                value={item.subTitle}
                                                onChange={(e) =>
                                                    handleBottomShotChange(realIndex, "subTitle", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-5">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Point (seperated by fullstop)</label>
                                            <textarea
                                                className="form-control nw-textarea"
                                                placeholder="single timeline"
                                                value={item.detail}
                                                onChange={(e) =>
                                                    handleBottomShotChange(realIndex, "detail", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                   
                                </div>
                            )})}

                    <div className="row">
                        <h4>Phased rollout (no downtime)</h4>
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Description</label>
                                <textarea
                                    className="form-control nw-select-frm"
                                    rows={4}
                                    value={form.phasedRollout.desc}
                                    onChange={(e) =>
                                        setForm({ ...form, phasedRollout: { ...form.phasedRollout, desc: e.target.value } })
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
                                    value={form.phasedRollout.firstLink}
                                    onChange={(e) =>
                                        setForm({ ...form, phasedRollout: { ...form.phasedRollout, firstLink: e.target.value } })
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
                                    value={form.phasedRollout.secondLink}
                                    onChange={(e) =>
                                        setForm({ ...form, phasedRollout: { ...form.phasedRollout, secondLink: e.target.value } })
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

export default ThirdHospitalPage;