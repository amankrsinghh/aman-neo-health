import { useState } from "react";
import PersonalInfo from "./PersonalInfo";
import ProfessionalInfo from "./ProfessionalInfo";
import EmploymentInfo from "./EmploymentInfo";
import AccessInfo from "./AccessInfo";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { securePostData } from "../Services/api";

function NewStaff() {
  const navigate = useNavigate();

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

  const submitStaff = async () => {
    const formData = new FormData();

    if (staffData.personalInfo?.profileImage instanceof File) {
      formData.append("profileImage", staffData.personalInfo.profileImage);
    }

    // ✅ CERTIFICATES
    staffData.professionalInfo?.certificates?.forEach((cert) => {
      if (cert?.file instanceof File) {
        formData.append("certificates", cert.file);
      }
    });


    const cleanData = {
      ...staffData,
      personalInfo: {
        ...staffData.personalInfo,
        profileImage: undefined
      },
      professionalInfo: {
        ...staffData.professionalInfo,
        certificates: staffData.professionalInfo.certificates?.map(c => ({
          certificateName: c.name
        }))
      }
    };



    formData.append("data", JSON.stringify(cleanData));

    try {
      const res = await securePostData.post("/doctor/staff", formData);
      if (res.success) {


        toast.success("Staff Created Successfully");

        // ✅ RESET ALL FORM DATA
        setStaffData(initialStaffState);

        // ✅ NAVIGATE TO STAFF LIST
        setTimeout(() => {
          navigate("/staff-management");
        }, 800); // small delay for toast visibility
      } else {
        toast.error(res.data.message)
      }

    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Error creating staff"
      );
    }
  };

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">

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
          <PersonalInfo setStaffData={setStaffData} />
        </div>

        <div className="tab-pane fade" id="professional">
          <ProfessionalInfo setStaffData={setStaffData} />
        </div>

        <div className="tab-pane fade" id="employment">
          <EmploymentInfo setStaffData={setStaffData} />
        </div>

        <div className="tab-pane fade" id="access">
          <AccessInfo
            setStaffData={setStaffData}
            onFinalSubmit={submitStaff}
          />
        </div>
      </div>
      <div className="text-end mt-3">
        <Link className="nw-thm-btn outline" to={-1}>Go Back</Link>
      </div>
    </div>
  );
}

export default NewStaff;
