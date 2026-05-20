import { FaFlask } from "react-icons/fa6";
import { BsFillFileImageFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserDetail } from "../../redux/feature/userSlice";
import { securePostData } from "../../Services/api";

function CreateAccountImage() {
    const dispatch = useDispatch()
    const [thumbnail, setThumbnail] = useState(null);
    const [pharImages, setPharImages] = useState([]);
    const { pharImg } = useSelector(state => state.user)

    const [previewThumb, setPreviewThumb] = useState(null);
    const [previewPharImages, setPreviewPharImages] = useState([]);
    const navigate = useNavigate()

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        setPreviewThumb(URL.createObjectURL(file));
    };

    const handlePharImagesChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 3); // max 3
        setPharImages(files);
        setPreviewPharImages(files.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!thumbnail) return alert('Thumbnail required!');
        const formData = new FormData();
        formData.append('thumbnail', thumbnail);
        pharImages.forEach(file => formData.append('pharImg', file));
        formData.append('userId', localStorage.getItem('userId'));

        try {
            const res = await securePostData('pharmacy/image', formData);
            if (res.success) {
                toast.success("Images saved successfully")
                navigate('/create-account-address')
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        dispatch(fetchUserDetail())
    }, [dispatch])
    useEffect(() => {
        if (pharImg) {
            navigate('/create-account-address')
        }
    }, [pharImg])
  return (
     <>
            <section className="admin-login-section account-lg-section nw-create-account-section ">
                <div className="container-fluid px-lg-0">
                    <div className="row justify-content-center mb-4">
                        <div className="col-lg-8">
                            <div className="account-step-main-bx">
                                 <NavLink to="/create-account">
                                <div className="account-step-crd account-step-one account-progress-done">
                                    <div className="account-step-bx account-step-complete">
                                        <FaFlask className="account-step-icon" />
                                    </div>
                                    <h6>Pharmacy Details</h6>
                                </div>
                                </NavLink>

                                <NavLink to="/create-account-image">
                                <div className="account-step-crd account-step-one">
                                    <div className="account-step-bx ">
                                        <BsFillFileImageFill className="account-step-icon" />
                                    </div>
                                    <h6>Images</h6>
                                </div>
                                </NavLink>

                                <NavLink to="/create-account-address">
                                <div className="account-step-crd account-step-one">
                                    <div className="account-step-bx account-unstep-card ">
                                        <FaMapMarkerAlt className="account-step-icon" />
                                    </div>
                                    <h6>Address</h6>
                                </div>
                                </NavLink>


                                <NavLink to="/create-account-person">
                                <div className="account-step-crd account-step-one">
                                    <div className="account-step-bx account-unstep-card">
                                        <FaUser className="account-step-icon" />
                                    </div>
                                    <h6>Contact Person</h6>
                                </div>
                                </NavLink>

                                <NavLink to="/create-account-upload">
                                <div className="account-step-crd">
                                    <div className="account-step-bx account-unstep-card">
                                        <FaCloudUploadAlt className="account-step-icon" />
                                    </div>
                                    <h6>Upload</h6>
                                </div>
                                </NavLink>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div>
                                {/* <img src="/footer-bnner.png" alt="" /> */}
                            </div>
                        </div>

                    </div>

                    <div className="row justify-content-center mb-4">
                        <div className="col-lg-5 col-md-6 col-sm-12">
                            <form onSubmit={handleSubmit}>
                                <div className="neo-health-frm-card">
                                    <div className="">
                                        <div className="admin-vndr-login">
                                            <h3 className="text-grad">Upload Pharmacy images</h3>
                                            <p>Please Upload Pharmacy images</p>
                                        </div>


                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Upload  Thumbnail image</label>
                                            <div className="upload-box nw-upload-bx p-3 justify-content-center">
                                                <div className="upload-icon mb-2">
                                                    <IoCloudUploadOutline />
                                                </div>

                                                <div>
                                                    <p className="fw-semibold mb-1">
                                                        <label htmlFor="fileInput1" className="file-label file-select-label">
                                                            Choose a file or drag & drop here
                                                        </label>
                                                    </p>

                                                    <small className="format-title">JPEG Format</small>


                                                    <div className="mt-3">
                                                        <label htmlFor="fileInput1" className="browse-btn">
                                                            Browse File
                                                        </label>
                                                    </div>

                                                    <input
                                                        type="file"
                                                        className="d-none"
                                                        id="fileInput1"
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={handleThumbnailChange}
                                                    />

                                                    <div id="filePreviewWrapper" className="d-none mt-3">
                                                        <img src="" alt="Preview" className="img-thumbnail" />
                                                    </div>
                                                    {previewThumb && <img src={previewThumb} alt="Thumbnail Preview" width={100} />}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Upload  Pharmacy images(max 3 images)</label>
                                            <div className="upload-box nw-upload-bx p-3 justify-content-center">
                                                <div className="upload-icon mb-2">
                                                    <IoCloudUploadOutline />
                                                </div>

                                                <div>
                                                    <p className="fw-semibold mb-1">
                                                        <label htmlFor="fileInput2" className="file-label file-select-label">
                                                            Choose a file or drag & drop here
                                                        </label>
                                                    </p>

                                                    <small className="format-title">JPEG Format</small>


                                                    <div className="mt-3">
                                                        <label htmlFor="fileInput2" className="browse-btn">
                                                            Browse File
                                                        </label>
                                                    </div>

                                                    <input
                                                        type="file"
                                                        className="d-none"
                                                        multiple
                                                        id="fileInput2"
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={handlePharImagesChange}
                                                    />

                                                    <div id="filePreviewWrapper" className="d-none mt-3">
                                                        <img src="" alt="Preview" className="img-thumbnail" />
                                                    </div>
                                                    {previewPharImages.map((src, idx) => (
                                                        <img key={idx} src={src} alt={`Phar Preview ${idx}`} width={100} style={{ marginRight: '10px' }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='mt-4'>
                                            <button type="submit" className="admin-lg-btn">
                                                Next
                                            </button>
                                        </div>

                                        <div className='text-center mt-5'>
                                            <span className='do-account-title'>Already have an account?<NavLink to="/login" className='lab-login-forgot-btn'>Login here</NavLink></span>
                                        </div>


                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>

                    {/* <div className="row">
                        <div className="col-lg-12">
                            <div>
                                <img src="/footer-pharmacy.png" alt="" />
                            </div>
                        </div>
                    </div> */}

                </div>

                 <div className="footer-half-img">
                    <img src="/footer-pharmacy.png" alt="" />
               </div>
            </section>







        </>
  )
}

export default CreateAccountImage