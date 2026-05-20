import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";

function SecondLabPage() {

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",

        model: [
            {
                image: null,
                preview: "",
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

            const formData = new FormData();

            formData.append("title", form.title);

            formData.append("description", form.description);

            // remove preview before sending
            const cleanModel = form.model.map(item => ({
                name: item.name,
                description: item.description,
                image: item.image?.name || item.image || ""
            }));

            formData.append("model", JSON.stringify(cleanModel));

            // append images
            form.model.forEach((item, index) => {
                if (item.image instanceof File) {
                    formData.append("image", item.image);
                    formData.append("imageIndex", index); // 🔥 IMPORTANT
                }
            });

            const res = await securePostData("api/admin/landing/second-lab-page", formData);
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

            const data = res.data?.secondSection;
            if (!data) return;

            setForm({
                title: data.title || "",

                description: data.description || "",
                model: data.model?.map(item => ({
                    ...item,
                    image: item?.image
                })) || []
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

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            {/* <h3 className="gradient-text mb-3">Laboratory Landing Page</h3> */}
            <h4 className="ms-4">Built inside the NeoHealthCard ecosystem</h4>
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
                    <h5 className="mt-4">Module</h5>
                    <button type="button" onClick={addModule} className="thm-btn mt-3">
                        + Add Module
                    </button>

                    </div>

                    {form.model.map((item, index) => (
                        <div className="row mt-3" key={index}>

                            <div className="col-lg-5">
                                <input
                                    type="file"
                                    className="form-control nw-select-frm"
                                    onChange={(e) =>
                                        handleImageChange(index, e.target.files[0])
                                    }
                                />

                                {getImageSrc(item) && (
                                    <img
                                        src={getImageSrc(item)}
                                        alt="preview"
                                        style={{ width: 60, marginTop: 10, objectFit: "cover", borderRadius: 6 }}
                                    />
                                )}
                            </div>

                            <div className="col-lg-5">
                                <input
                                    className="form-control nw-select-frm"
                                    placeholder="Name"
                                    value={item.name}
                                    onChange={(e) =>
                                        handleModelChange(index, "name", e.target.value)
                                    }
                                />
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

                            <div className="col-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Points (seperated by fullstop)</label>
                                    <textarea
                                        rows={10}
                                        className="form-control "
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) =>
                                            handleModelChange(index, "description", e.target.value)
                                        }
                                    ></textarea>
                                </div>
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

export default SecondLabPage;