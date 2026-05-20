import { useState, useEffect } from "react";
import PersonalInfo from "./PersonalInfo";
import ProfessionalInfo from "./ProfessionalInfo";
import EmploymentInfo from "./EmploymentInfo";
import AccessInfo from "./AccessInfo";
import { NavLink } from "react-router-dom";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";



function EditStaff() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const initialStaffState = {
    personalInfo: {},
    professionalInfo: {},
    employmentInfo: {},
    accessInfo: {},
    profileImage: null
  };


  const [staffData, setStaffData] = useState({
    personalInfo: {},
    professionalInfo: {},
    employmentInfo: {},
    accessInfo: {},
    profileImage: null
  });

  const updateSection = (section, data) => {
    setStaffData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const submitStaff = async (data = staffData) => {
    const formData = new FormData();

    if (data.personalInfo?.profileImage instanceof File) {
      formData.append("profileImage", data.personalInfo.profileImage);
    }

    data.professionalInfo?.certificates?.forEach(cert => {
      if (cert.file instanceof File) {
        formData.append("certificates", cert.file);
      }
    });
    const cleanData = {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        profileImage: undefined
      },
      professionalInfo: {
        ...data.professionalInfo,
        certificates: data.professionalInfo.certificates.map(c => ({
          name: c.name   // ✅ KEEP SAME AS STATE
        }))
      }
    };

    formData.append("data", JSON.stringify(cleanData));
    setLoading(true)
    try {


      if (id) {
        formData.forEach((value, key) => {
          console.log(key, value);
        });
        const res = await api.put(`/hospital-staff/${id}`, formData);
        if (res.data.success) {
          toast.success("Staff Updated Successfully");
        } else {
          toast.error(res.data.message)
        }
      } else {
        const res = await api.post("/hospital-staff/create", formData);
        if (res.data.success) {
          toast.success("Staff Created Successfully");
        } else {
          toast.error(res.data.message)
        }
      }
      navigate("/staff-management");
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    if (!id) return;
    api.get(`/hospital-staff/get-by-id/${id}`).then(res => {
      setStaffData(res.data.data);
    });
  }, [id]);
  useEffect(() => {
    console.log("staffData updated:", staffData);
  }, [staffData]);
  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">

          {/* Header */}
          <div className="row ">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="innr-title mb-2">Add New Staff</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#" className="breadcrumb-link">
                          Dashboard
                        </a>
                      </li>
                      <li className="breadcrumb-item">
                        <NavLink to="/staff-management" className="breadcrumb-link">Staff</NavLink>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Add New Staff
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="employee-tabs">
            <ul
              className="nav nav-tabs gap-3 ps-2"
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#personal"
                  role="tab"
                >
                  Personal Info
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#professional"
                  role="tab"
                >
                  Professional
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#employment"
                  role="tab"
                >
                  Employment
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#access"
                  role="tab"
                >
                  Access
                </a>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div className="tab-content mt-4">
            <div className="tab-pane fade show active" id="personal">
              <PersonalInfo
                staffData={staffData}
                setStaffData={setStaffData}
              />
            </div>

            <div className="tab-pane fade" id="professional">
              <ProfessionalInfo
                staffData={staffData}
                setStaffData={setStaffData}
              />
            </div>

            <div className="tab-pane fade" id="employment">
              <EmploymentInfo
                staffData={staffData}
                setStaffData={setStaffData}
              />
            </div>

            <div className="tab-pane fade" id="access">
              <AccessInfo
                staffData={staffData}
                setStaffData={setStaffData}
                onFinalSubmit={submitStaff}
              />
            </div>
          </div>
        </div>}
    </>
  );
}

export default EditStaff;
