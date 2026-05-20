import { useState, useEffect } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function ProfessionalInfo({ staffData, setStaffData }) {

  const [errors, setErrors] = useState({});
  const [profession, setProfession] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setTotalExperience] = useState("");
  const [bio, setBio] = useState("");

  // ===== STATE =====
  const [educations, setEducations] = useState([
    { university: "", degree: "", fromYear: "", toYear: "" }
  ]);

  const [certificates, setCertificates] = useState([
    { name: "", file: null }
  ]);

  // ===== TAB NAV =====
  const goToNextTab = () => {
    document.querySelector('a[href="#employment"]')?.click();
  };

  const goToBackTab = () => {
    document.querySelector('a[href="#personal"]')?.click();
  };

  // ===== EDUCATION HANDLERS =====
  const addEducation = () => {
    setEducations([...educations, { university: "", degree: "", fromYear: "", toYear: "" }]);
  };

  const removeEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  // ===== CERTIFICATE HANDLERS =====
  const addCertificate = () => {
    setCertificates([...certificates, { name: "", file: null }]);
  };

  const removeCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleCertificateChange = (index, field, value) => {
    const updated = [...certificates];
    updated[index][field] = value;
    setCertificates(updated);
  };


  const handleSaveAndNext = () => {
    if (!validate()) return;

    if (typeof setStaffData !== "function") {
      console.error("setStaffData not received in ProfessionalInfo");
      return;
    }

    const professionalInfo = {
      profession,
      specialization,
      experience,
      bio,
      educations,
      certificates
    };

    setStaffData(prev => ({
      ...prev,
      professionalInfo
    }));

    goToNextTab();
  };


  useEffect(() => {
    if (!staffData?.professionalInfo) return;

    const p = staffData.professionalInfo;

    setProfession(p.profession || "");
    setSpecialization(p.specialization || "");
    setTotalExperience(p.experience || p.experience || "");
    setBio(p.bio || "");

    // ===== EDUCATION PREFILL =====
    setEducations(
      p.education && p.education.length
        ? p.education.map(e => ({
          university: e.university || "",
          degree: e.degree || "",
          fromYear: e.yearFrom || "",
          toYear: e.yearTo || ""
        }))
        : [{ university: "", degree: "", fromYear: "", toYear: "" }]
    );

    // ===== CERTIFICATE PREFILL =====
    setCertificates(
      p.certificates && p.certificates.length
        ? p.certificates.map(c => ({
          name: c.certificateName || "",
          file: c.certificateFile || null // string URL in edit
        }))
        : [{ name: "", file: null }]
    );

  }, [staffData]);


  const validate = () => {
    let newErrors = {};

    if (!profession.trim()) newErrors.profession = "Profession is required";
    if (!specialization.trim()) newErrors.specialization = "Specialization is required";

    if (!experience) {
      newErrors.experience = "Total experience is required";
    } else if (isNaN(experience)) {
      newErrors.experience = "Experience must be a number";
    }

    // ===== EDUCATION VALIDATION =====
    educations.forEach((edu, i) => {
      if (!edu.university.trim())
        newErrors[`edu_university_${i}`] = "University is required";

      if (!edu.degree.trim())
        newErrors[`edu_degree_${i}`] = "Degree is required";

      if (!edu.fromYear)
        newErrors[`edu_from_${i}`] = "From year required";

      if (!edu.toYear)
        newErrors[`edu_to_${i}`] = "To year required";

      if (
        edu.fromYear &&
        edu.toYear &&
        Number(edu.fromYear) > Number(edu.toYear)
      ) {
        newErrors[`edu_year_${i}`] = "From year cannot be greater than To year";
      }
    });

    // ===== CERTIFICATE VALIDATION =====
    certificates.forEach((cert, i) => {
      if (cert.file && !cert.name.trim()) {
        newErrors[`cert_name_${i}`] = "Certificate name is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


console.log(errors)


  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <h4 className="lg_title text-black fw-700 mb-3">Professional Information</h4>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="custom-frm-bx">
              <label htmlFor="">Profession</label>
              <input
                type="text"
                className="form-control nw-frm-select"
                placeholder="e.g. Pharmacist, Nurse, etc."
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
              {errors.profession && (
                <small className="text-danger">{errors.profession}</small>
              )}
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="custom-frm-bx">
              <label htmlFor="">Specialization</label>
              <input
                type="text"
                className="form-control nw-frm-select"
                placeholder="e.g. Cardiology, Pediatrics, etc."
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
              {errors.specialization && (
                <small className="text-danger">{errors.specialization}</small>
              )}
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="custom-frm-bx">
              <label htmlFor="">Total Experience</label>
              <input
                type="text"
                className="form-control nw-frm-select"
                placeholder="Enter  Total Experience"
                value={experience}
                onChange={(e) => setTotalExperience(e.target.value)}
              />
              {errors.experience && (
                <small className="text-danger">{errors.experience}</small>
              )}
            </div>
          </div>

          <div className="col-lg-12">
            <div className="custom-frm-bx">
              <label htmlFor="">Professional Bio</label>
              <textarea className="form-control nw-frm-select"
                placeholder="Enter professional biography and experience"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              >
              </textarea>
            </div>
          </div>


          <div className="col-lg-12 my-3">
            <div className="">
              <h5 className="add-contact-title">Education</h5>
            </div>
          </div>


        </div>

        {educations.map((edu, index) => (
          <div className="education-frm-bx mb-3" key={index}>
            <div className="row">
              <div className="col-lg-3">
                <input
                  className="form-control"
                  placeholder="University"
                  value={edu.university}
                  onChange={(e) =>
                    handleEducationChange(index, "university", e.target.value)
                  }
                />
                {errors[`edu_university_${index}`] && (
                  <small className="text-danger">
                    {errors[`edu_university_${index}`]}
                  </small>
                )}
              </div>

              <div className="col-lg-3">
                <input
                  className="form-control"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleEducationChange(index, "degree", e.target.value)
                  }
                />
              </div>

              <div className="col-lg-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="From"
                  value={edu.fromYear}
                  onChange={(e) =>
                    handleEducationChange(index, "fromYear", e.target.value)
                  }
                />
                 {errors[`edu_year_${index}`] && (
                  <small className="text-danger">
                    {errors[`edu_year_${index}`]}
                  </small>
                )}
              </div>

              <div className="col-lg-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="To"
                  value={edu.toYear}
                  onChange={(e) =>
                    handleEducationChange(index, "toYear", e.target.value)
                  }
                />
                {errors[`edu_to_${index}`] && (
                  <small className="text-danger">
                    {errors[`edu_to_${index}`]}
                  </small>
                )}
              </div>

              <div className="col-lg-2 text-end">
                {educations.length > 1 && (
                  <button
                    type="button"
                    className="text-danger"
                    onClick={() => removeEducation(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="text-end my-3">
          <button
            type="button"
            className="add-employee-btn"
            onClick={addEducation}
          >
            <FaPlusSquare /> Add More
          </button>
        </div>
        <div className="col-lg-12 my-3">
          <div className="">
            <h5 className="add-contact-title">Certificate</h5>
          </div>
        </div>

        {certificates.map((cert, index) => (
          <div className="education-frm-bx mb-3" key={index}>
            <div className="row">
              <div className="col-lg-5">
                <input
                  className="form-control"
                  placeholder="Certificate Name"
                  value={cert.name}
                  onChange={(e) =>
                    handleCertificateChange(index, "name", e.target.value)
                  }
                />
                {errors[`cert_name_${index}`] && (
                  <small className="text-danger">
                    {errors[`cert_name_${index}`]}
                  </small>
                )}
              </div>
              <div className="col-lg-5">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    handleCertificateChange(index, "file", e.target.files[0])
                  }
                />
              </div>
              <div className="col-lg-2 text-end">
                {certificates.length > 1 && (
                  <button
                    type="button"
                    className="text-danger"
                    onClick={() => removeCertificate(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="text-end my-3">
          <button
            type="button"
            className="add-employee-btn"
            onClick={addCertificate}
          >
            <FaPlusSquare /> Add More
          </button>
        </div>

        <div className="d-flex align-items-center justify-content-end gap-3">
          <button type="button" className="nw-thm-btn outline rounded-3" onClick={goToBackTab}>Back</button>
          <button type="button" className="nw-thm-btn rounded-3" onClick={handleSaveAndNext}>Save & Continue</button>
        </div>

      </form>

    </>
  );
}

export default ProfessionalInfo;
