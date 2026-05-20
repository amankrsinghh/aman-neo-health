import { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import "jodit/es5/jodit.min.css";
import { NavLink } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function AboutUs() {
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get("/api/admin/cms/about-us");
                setContent(res.data.data?.content || "");
            } catch (err) {
                toast.error("Failed to load content");
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, []);

    /* ================= SAVE DATA ================= */
    const handleSave = async () => {
        try {
            setSaving(true);

            await api.put("/api/admin/cms/about-us", {
                title: "About Us",
                content: content
            });

            Swal.fire({
                icon: "success",
                title: "Saved",
                text: "About Us updated successfully"
            });

        } catch (err) {
            toast.error("Failed to save content");
        } finally {
            setSaving(false);
        }
    };

    const config = {
        readonly: false,
        height: 300,
        toolbarSticky: false,
        placeholder: "Write something nice...",
        uploader: { insertImageAsBase64URI: true },
        toolbarAdaptive: false,
        buttons: [
            "bold","italic","underline","|",
            "fontsize","brush","|",
            "align","ul","ol","|",
            "paragraph","link","image","hr"
        ],
    };

    if (loading) return <div className="p-3">Loading...</div>;

    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">About Us</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/" className="breadcrumb-link">
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        <li className="breadcrumb-item active">About Us</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='new-mega-card'>
                    <div className="row">
                        <div className="col-lg-12 col-dm-12 col-sm-12">

                            <JoditEditor
                                ref={editor}
                                value={content}
                                config={config}
                                onBlur={(newContent) => setContent(newContent)}
                                onChange={() => {}}
                            />

                            <div className="d-flex justify-content-end gap-3 mt-3">
                                <button className="nw-filtr-thm-btn outline">
                                    Cancel
                                </button>

                                <button
                                    className="nw-filtr-thm-btn"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AboutUs;
