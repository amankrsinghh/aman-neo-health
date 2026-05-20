import {
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { postApiData, securePostData } from "../../Services/api";
import { useEffect, useRef, useState } from "react";
import Loader from "../../Loader/Loader";
import { fetchPatientDetail } from "../../Redux/features/patient";
import { useDispatch } from "react-redux";
import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase";
import { saveFcmToken } from "../../Services/globalFunction";
function Otp() {
    const navigate = useNavigate()
    const [timer, setTimer] = useState(30);
    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(false)
    const contact = searchParams.get('contact')
    const isEmail = contact?.includes('@');
    const userId = localStorage.getItem('userId')
    const dispatch = useDispatch()
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };
    

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 6);

        if (!/^\d+$/.test(pasteData)) return;

        const pasteOtp = pasteData.split("");
        const newOtp = [...otp];

        pasteOtp.forEach((digit, index) => {
            if (index < 6) newOtp[index] = digit;
        });

        setOtp(newOtp);
        inputsRef.current[pasteOtp.length - 1].focus();
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(otp?.join('')?.length!==6){
           return toast.error("Please enter valid otp")
        }
        setLoading(true);

        const accountData = JSON.parse(sessionStorage.getItem('accountData'));
        let data = {
            code: otp?.join('')
        };

        // Dynamic field set
        if (isEmail) {
            data.email = contact;
        } else {
            data.contactNumber = contact;
        }

        try {
            if (searchParams.get('type') === "forgot-password") {

                const response = await postApiData('patient/verify-otp', {
                    ...data,
                    type: "forgot-password"
                });

                if (response.success) {
                    toast.success("Verify successfully");
                    localStorage.setItem('ftoken', response.token);
                    navigate('/set-password');
                }

            } else {

                const response = await postApiData('patient/verify-otp', {
                    ...data,
                    ...accountData
                });

                if (response.success) {
                    sessionStorage.clear();
                    toast.success('Verify successfully');

                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userId', response.userId);
                    localStorage.setItem('role', response.role || 'patient');
                    localStorage.setItem('patientId', response.patientId);

                    if (response.nextStep) {
                        navigate(response.nextStep);
                    } else {
                        dispatch(fetchPatientDetail());
                        navigate('/my-appointment');
                        await saveFcmToken();
                    }
                } else {
                    toast.error(response.message);
                }
            }

        } catch (err) {
            toast.error(err?.response?.data?.message)
            console.error("Error verifying otp:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!contact) {
            navigate('/')
        }
    }, [contact])
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    localStorage.setItem('lat', position.coords.latitude)
                    localStorage.setItem('long', position.coords.longitude)

                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }, []);
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);
    const handleResendCode = async (e) => {
        e.preventDefault();
        let data;
        if (isEmail) {
            data.email = contact
        } else {
            data.contactNumber = contact
        }
        try {
            const response = await postApiData('patient/resend-otp', data)
            if (response.success) {
                toast.success('Otp sent successfully')
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        }
        setTimer(30); // reset timer after resend
    }
    return (
        <>
            {loading ? <Loader />
                : <section className="admin-login-section nw-hero-section ">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="admin-pisture-bx">
                                    <div className="position-relative">
                                        <Link to={-1} className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                    </div>
                                    <img src="new-login-bnnr.png" alt="" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div >
                                    <div className="nw-form-container">
                                        <div className="login-logo">
                                            <img src="/logo.png" alt="" />
                                        </div>

                                        <div className="admin-vndr-login my-2">
                                            <h3 className="heading-grad">Verify OTP</h3>
                                            <p className="py-2">We have sent a verification code to {contact}</p>
                                        </div>

                                        <form>
                                            <div className="custom-frm-bx admin-frm-bx lab-login-frm-bx my-3">
                                                {otp.map((digit, index) => (
                                                    <input
                                                        key={index}
                                                        ref={(el) => (inputsRef.current[index] = el)}
                                                        type="text"
                                                        maxLength="1"
                                                        value={digit}
                                                        className="form-control new-control-frm text-center"
                                                        placeholder="0"
                                                        onChange={(e) => handleChange(e.target.value, index)}
                                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                                        onPaste={handlePaste}
                                                    />
                                                ))}
                                            </div>
                                            <div className="mt-4 text-center">
                                                <NavLink
                                                    className="nw-thm-btn w-100"
                                                    onClick={handleSubmit}
                                                >
                                                    Verify
                                                </NavLink>
                                            </div>

                                            <div className="text-center mt-4">
                                                <p className="do-account-title text-black">
                                                    Didn’t receive any code?
                                                </p>
                                                <p className="do-account-title py-2">
                                                    Request new code in <span className="otp-timing">{timer}s</span>
                                                </p>                                                
                                                <button
                                                    className="nw-register-btn"
                                                    onClick={handleResendCode}
                                                    type="button"
                                                    disabled={timer > 0} // prevent clicking before timer ends
                                                >
                                                    Resend
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}
        </>
    )
}

export default Otp