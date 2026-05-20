import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getApiData, securePostData } from "../../Services/api";
import base_url from "../../Services/baseUrl";
import Select from "react-select"
function FirstPatientPage() {

    const [saving, setSaving] = useState(false);
    const [catData, setCatData] = useState([])
    const [form, setForm] = useState({
        heroTitle: "",
        heroImage: null,
        heroImagePreview: "",

        heroDesc: "",

        servicesDesc: "",
        doctorDesc: "",
        testCategoryDesc: "",
        hospitalDesc: "",

        howItWorks: "",
        howItWorkImage: null,
        howItWorkImagePreview: "",

        blogDesc: "",

        downloadTitle: "",
        downloadDesc: "",
        downloadImage: null,
        downloadImagePreview: "",

        playStore: "",
        appStore: "",

        testimonialDesc: "",
        category: []
    });
    const handleImageChange = (field, previewField, file) => {
        if (!file) return;

        setForm(prev => ({
            ...prev,
            [field]: file,
            [previewField]: URL.createObjectURL(file)
        }));
    };



    // ✅ handle change
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };



    // ✅ validation
    const validate = () => {
        if (!form.heroTitle) return "Hero title required";
        if (!form.heroDesc) return "Description required";
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

            // TEXT fields
            Object.keys(form).forEach(key => {
                if(key=="category"){
                    formData.append(key, JSON.stringify(form.category));
                }else if (!key.toLowerCase().includes("image") && !key.includes("Preview")) {
                    formData.append(key, form[key]);
                }
            });

            // IMAGE fields
            if (form.heroImage instanceof File) {
                formData.append("heroImage", form.heroImage);
            }

            if (form.howItWorkImage instanceof File) {
                formData.append("howItWorkImage", form.howItWorkImage);
            }

            if (form.downloadImage instanceof File) {
                formData.append("downloadImage", form.downloadImage);
            }

            const res = await securePostData(
                "api/admin/landing/first-patient-page",
                formData
            );

            if (res.success) fetchData();

            toast.success(res.message);

        } catch (err) {
            console.log(err);
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    // ✅ get data
    const fetchData = async () => {
        try {
            const res = await getApiData("api/admin/landing/patient");

            const data = res.data?.firstSection;
            if (!data) return;

            setForm({
                heroTitle: data.heroTitle || "",
                heroDesc: data.heroDesc || "",

                heroImage: data.heroImage || "",
                heroImagePreview: data.heroImage ? `${base_url}/${data.heroImage}` : "",

                howItWorks: data.howItWorks || "",
                howItWorkImage: data.howItWorkImage || "",
                howItWorkImagePreview: data.howItWorkImage ? `${base_url}/${data.howItWorkImage}` : "",

                downloadTitle: data.downloadTitle || "",
                downloadDesc: data.downloadDesc || "",
                downloadImage: data.downloadImage || "",
                downloadImagePreview: data.downloadImage ? `${base_url}/${data.downloadImage}` : "",

                playStore: data.playStore || "",
                appStore: data.appStore || "",

                servicesDesc: data.servicesDesc || "",
                doctorDesc: data.doctorDesc || "",
                testCategoryDesc: data.testCategoryDesc || "",
                hospitalDesc: data.hospitalDesc || "",
                blogDesc: data.blogDesc || "",
                testimonialDesc: data.testimonialDesc || "",
                category:data?.category || []
            });

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    hospitalRes,
                    testRes,
                    pharmacyRes,
                    specialityRes
                ] = await Promise.all([
                    getApiData('admin/hospital-category'),
                    getApiData('admin/test-category'),
                    getApiData('admin/pharmacy-category'),
                    getApiData('admin/speciality')
                ]);

                const hospital = hospitalRes.data.map(item => ({
                    value: item._id,
                    label: item.name || "Hospital",
                    panel:"hospital",
                }));

                const lab = testRes.data.map(item => ({
                    value: item._id,
                    label: item.name || "Lab",
                    panel:"lab"
                }));

                const pharmacy = pharmacyRes.data.map(item => ({
                    value: item._id,
                    label: item.name || "Pharmacy",
                    panel:"pharmacy"
                }));

                const doctor = specialityRes.data.map(item => ({
                    value: item._id,
                    label: item.name || "Doctor",
                    panel:"doctor"
                }));

                const combined = [
                    ...hospital,
                    ...lab,
                    ...pharmacy,
                    ...doctor
                ];
                setCatData(combined);

            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            <h3 className="gradient-text mb-3">Patient Landing Page</h3>

            <form onSubmit={handleSubmit}>
                <div className="new-mega-card p-4">
                    <h4>Hero Section</h4>
                    <div className="row">

                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.heroTitle}
                                    onChange={(e) =>
                                        handleChange("heroTitle", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Hero Description</label>
                                <textarea
                                    className="form-control nw-textarea"
                                    rows={4}
                                    value={form.heroDesc}
                                    onChange={(e) =>
                                        handleChange("heroDesc", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Image</label>
                                <input type="file" className="form-control"
                                    onChange={(e) =>
                                        handleImageChange("heroImage", "heroImagePreview", e.target.files[0])
                                    } />
                                {form.heroImagePreview && (
                                    <img
                                        src={form.heroImagePreview}
                                        alt=""
                                        style={{ width: 80, marginTop: 10 }}
                                    />
                                )}
                            </div>
                        </div>
                        <h4>How It Work</h4>
                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.howItWorks}
                                    onChange={(e) =>
                                        handleChange("howItWorks", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Image</label>
                                <input type="file" name="" id="" className="form-control"
                                    onChange={(e) =>
                                        handleImageChange("howItWorkImage", "howItWorkImagePreview", e.target.files[0])
                                    } />
                                {form.howItWorkImagePreview && (
                                    <img src={form.howItWorkImagePreview} style={{ width: 80, marginTop: 10 }} />
                                )}

                            </div>
                        </div>
                        <h4>App Download</h4>
                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.downloadTitle}
                                    onChange={(e) =>
                                        handleChange("downloadTitle", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.downloadDesc}
                                    onChange={(e) =>
                                        handleChange("downloadDesc", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Play Store Link</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.playStore}
                                    onChange={(e) =>
                                        handleChange("playStore", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>App Store Link</label>
                                <input
                                    type="text"
                                    className="form-control nw-select-frm"
                                    value={form.appStore}
                                    onChange={(e) =>
                                        handleChange("appStore", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="custom-frm-bx">
                                <label>Image</label>
                                <input
                                    type="file"
                                    className="form-control nw-select-frm"
                                    onChange={(e) =>
                                        handleImageChange("downloadImage", "downloadImagePreview", e.target.files[0])
                                    }

                                />
                                {form.downloadImagePreview && (
                                    <img src={form.downloadImagePreview} style={{ width: 80, marginTop: 10 }} />
                                )}
                            </div>
                        </div>
                        <h4>Other</h4>
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Service Description</label>
                                <textarea
                                    className="form-control nw-textarea"
                                    rows={4}
                                    value={form.servicesDesc}
                                    onChange={(e) =>
                                        handleChange("servicesDesc", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Doctor Description</label>
                                <textarea
                                    className="form-control nw-textarea"
                                    rows={4}
                                    value={form.doctorDesc}
                                    onChange={(e) =>
                                        handleChange("doctorDesc", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Test Category Description</label>
                                <textarea
                                    className="form-control nw-textarea"
                                    rows={4}
                                    value={form.testCategoryDesc}
                                    onChange={(e) =>
                                        handleChange("testCategoryDesc", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Hospital Description</label>
                                <textarea
                                    className="form-control nw-textarea"
                                    rows={4}
                                    value={form.hospitalDesc}
                                    onChange={(e) =>
                                        handleChange("hospitalDesc", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Blog Description</label>
                                <textarea
                                    className="form-control nw-textarea"
                                    rows={4}
                                    value={form.blogDesc}
                                    onChange={(e) =>
                                        handleChange("blogDesc", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Testimonial Description</label>
                                <textarea
                                    className="form-control nw-textarea"
                                    rows={4}
                                    value={form.testimonialDesc}
                                    onChange={(e) =>
                                        handleChange("testimonialDesc", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="custom-frm-bx">
                                <label>Footer Category</label>
                                <Select
                                    options={catData}
                                    isMulti
                                    required
                                    value={catData.filter(option =>
                                        form.category?.some(item=>item?.value == option.value)
                                    )}
                                    className="custom-select"
                                    placeholder="Select category..."
                                    onChange={(selectedOptions) => {
                                        setForm({ ...form, category: selectedOptions });
                                    }}
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

export default FirstPatientPage;