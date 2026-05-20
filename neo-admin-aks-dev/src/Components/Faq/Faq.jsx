import { useEffect, useState } from "react";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { RiMenuUnfold3Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import api from "../../utils/axios";

function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FAQS ================= */
  const fetchFaqs = async () => {
    try {
      const res = await api.get("/api/admin/faqs");
      setFaqs(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  /* ================= DELETE FAQ ================= */
  const deleteFaq = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This FAQ will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/admin/faqs/${id}`);
      setFaqs((prev) => prev.filter((f) => f._id !== id));
      toast.success("FAQ deleted successfully");
    } catch (err) {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      {/* HEADER */}
      <div className="row">
        <div className="d-flex align-items-center justify-content-between mega-content-bx">
          <div>
            <h3 className="innr-title mb-2 gradient-text">FAQs</h3>
            <div className="admin-breadcrumb">
              <ol className="breadcrumb custom-breadcrumb">
                <li className="breadcrumb-item">
                  <NavLink to="/" className="breadcrumb-link">
                    Dashboard
                  </NavLink>
                </li>
                <li className="breadcrumb-item active">FAQs</li>
              </ol>
            </div>
          </div>

          <NavLink to="/add-faqs" className="nw-thm-btn">
            Add FAQs
          </NavLink>
        </div>
      </div>

      {/* BODY */}
      <div className="new-mega-card mt-3">
        {loading ? (
          <p>Loading FAQs...</p>
        ) : faqs.length === 0 ? (
          <p>No FAQs found.</p>
        ) : (
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div className="accordion-item mb-3" key={faq._id}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className={`accordion-button ${
                      index !== 0 ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                  >
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <span className="fw-semibold">{faq.question}</span>

                      <div className="d-flex gap-2 me-lg-3 me-sm-1">
                        <button
                          className="notifi-remv-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFaq(faq._id);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>

                        <NavLink
                          to={`/edit-faqs?id=${faq._id}`}
                          className="notifi-remv-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </NavLink>

                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <RiMenuUnfold3Line className="fz-24" />
                        </button>
                      </div>
                    </div>
                  </button>
                </h2>

                <div
                  id={`collapse-${index}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Faq;
