import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusSquare } from "react-icons/fa";
import { faCheck, faCircleXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getApiData, getSecureApiData, securePostData, updateApiData } from "../../Service/api";
import api from "../../api/api";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { PiHandEye } from "react-icons/pi";
import { specialtyOptions } from "../../Service/globalFunction";
import Select from "react-select";
import { toast } from "react-toastify";
import { Tab } from "bootstrap";
import base_url from "../../baseUrl";
import { useSelector } from "react-redux";
function DailyIPDNotes({ data, openTrigger }) {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [searchParams] = useSearchParams();
    const { user } = useSelector(state => state.user)
    const userId = user?._id
    const [headerId, setHeaderId] = useState('')
    const [allotmentDetail, setAllotmentDetail] = useState()
    const [loading, setLoading] = useState(false)
    const [general, setGeneral] = useState({
        authorNh12: '',
        hospitalId: '',
        allotmentId: "",
        bedId: "",
        roomId: "",
        patientId: '',
        doctorNh12: '',
        doctorName: '', role: '', name: '',
        ptName: "",
        ptSex: "",
        ptNh12: "", bed: "", room: ""
    })
    const [subjective, setSubjective] = useState({
        pain: {
            status: "",
            location: "",
            score: ""
        },
        headerId: "",
        fever: false,
        breathlessness: false,
        appetite: "",
        sleep: "",
        otherSymptoms: "",
        overnightEvents: {
            stable: false,
            hypotension: false,
            desaturation: false,
            chestPain: false,
            seizure: false,
            vomiting: false,
            bleeding: false
        },
        notes: ""
    });
    const [subjectiveErrors, setSubjectiveErrors] = useState({})
    const handleSubjectiveChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");

            setSubjective((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === "checkbox" ? checked : value
                }
            }));
        } else {
            setSubjective((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };
    const validateSubjective = () => {
        const newErrors = {};
        if (!subjective.appetite) {
            newErrors["appetite"] = "Appetite is required";
        }
        if (!subjective.sleep) {
            newErrors["sleep"] = "Sleep is required";
        }
        setSubjectiveErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const subjectiveSubmit = async (e) => {
        e.preventDefault();

        if (!validateSubjective()) return;
        try {
            setLoading(true)
            let res;
            if (subjective?._id) {
                res = await updateApiData(`api/ipd-note/subjective/${subjective?._id}`, subjective)
            } else {
                res = await securePostData("api/ipd-note/subjective", subjective)
            }
            if (res.success) {
                setSubjective({ ...subjective, _id: res?.data?._id })
                toast.success("Subjective Saved Successfully")
                setTimeout(() => {
                    openTab('objective-tab')
                }, 200)
            } else {
                toast.error(res.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };
    const [objectiveErrors, setObjectiveErrors] = useState({})
    const [objective, setObjective] = useState({
        headerId: "",
        vitals: {
            temperature: "",
            pulse: "",
            bpSystolic: "",
            bpDiastolic: "",
            respiratoryRate: "",
            spo2: "",
            oxygenSupport: {
                type: "",
                litersPerMin: ""
            },
            weight: "",
            gcs: ""
        },

        intakeOutput: {
            intakeMl: "",
            outputMl: "",
            urineMl: "",
            drains: "",
            stool: ""
        },

        physicalExam: {
            general: {
                comfortable: false,
                distressed: false,
                pallor: false,
                icterus: false,
                edema: false
            },
            cvs: "",
            rs: "",
            abdomen: "",
            cns: "",
            localExam: ""
        }
    });
    const handleObjectiveChange = (e) => {
        const { name, value, type, checked } = e.target;

        const keys = name.split(".");

        setObjective((prev) => {
            let updated = { ...prev };
            let current = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] =
                type === "checkbox" ? checked : value;

            return updated;
        });

        setObjectiveErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };
    const validateObjective = () => {

        let newErrors = {};

        if (!objective.vitals.temperature) {
            newErrors["vitals.temperature"] = "Temperature required";
        }

        if (!objective.vitals.pulse) {
            newErrors["vitals.pulse"] = "Pulse required";
        }

        if (!objective.vitals.bpSystolic) {
            newErrors["vitals.bpSystolic"] = "BP systolic required";
        }

        if (!objective.vitals.bpDiastolic) {
            newErrors["vitals.bpDiastolic"] = "BP diastolic required";
        }

        if (!objective.vitals.spo2) {
            newErrors["vitals.spo2"] = "SpO2 required";
        }

        setObjectiveErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const objectiveSubmit = async (e) => {

        e.preventDefault();

        if (!validateObjective()) return;

        try {
            setLoading(true)
            let res;
            if (objective?._id) {
                res = await updateApiData(`api/ipd-note/objective/${objective?._id}`, objective);
            } else {
                res = await securePostData("api/ipd-note/objective", objective);
            }
            if (res.success) {
                setObjective({ ...objective, _id: res.data?._id })
                toast.success("Objective Saved Successfully");
                setTimeout(() => {
                    openTab('lab-tab')
                }, 200)
            } else {
                toast.error(res.message)
            }

        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false)
        }

    };
    const [labErrors, setLabErrors] = useState({});
    const [labImaging, setLabImaging] = useState({
        headerId: "",
        cbc: {
            hb: "",
            wbc: "",
            platelets: "",
            abnormal: ""
        },

        rft: {
            urea: "",
            creatinine: ""
        },

        lft: {
            bilirubin: "",
            ast: "",
            alt: ""
        },

        electrolytes: {
            sodium: "",
            potassium: "",
            chloride: ""
        },

        otherTests: "",

        imaging: "",

        criticalAlert: {
            exists: false,
            details: ""
        }

    });
    const handleLabChange = (e) => {

        const { name, value, type, checked } = e.target;

        const keys = name.split(".");

        setLabImaging(prev => {

            let updated = { ...prev };
            let current = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] =
                type === "checkbox" ? checked : value;

            return updated;
        });

        setLabErrors(prev => ({
            ...prev,
            [name]: ""
        }));

    };
    const validateLab = () => {

        let newErrors = {};

        if (!labImaging.cbc.hb) {
            newErrors["cbc.hb"] = "HB is required";
        }

        if (!labImaging.cbc.wbc) {
            newErrors["cbc.wbc"] = "WBC is required";
        }

        if (!labImaging.rft.creatinine) {
            newErrors["rft.creatinine"] = "Creatinine required";
        }

        if (!labImaging.electrolytes.sodium) {
            newErrors["electrolytes.sodium"] = "Sodium required";
        }

        setLabErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };
    const labSubmit = async (e) => {
        e.preventDefault();
        if (!validateLab()) return;
        try {
            setLoading(true)
            let res;
            if (labImaging?._id) {
                res = await updateApiData(`api/ipd-note/lab-imaging/${labImaging?._id}`, labImaging);
            } else {
                res = await securePostData("api/ipd-note/lab-imaging", labImaging);
            }
            if (res.success) {
                setLabImaging({ ...labImaging, _id: res.data?._id })
                toast.success("Lab & Imaging Saved Successfully");
                setTimeout(() => {
                    openTab('assessment-tab')
                }, 200)
            } else {
                toast.error(res.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false)
        }

    };
    const [assessmentErrors, setAssessmentErrors] = useState({});
    const [assessment, setAssessment] = useState({
        primaryDiagnosis: "",
        headerId: "",
        comorbidities: [],

        activeProblems: {
            infection: false,
            pain: false,
            hypoxia: false,
            electrolyteImbalance: false,
            anemia: false,
            aki: false,
            bleeding: false,
            others: ""
        },

        clinicalStatus: ""
    });
    const handleAssessmentChange = (e) => {

        const { name, value, type, checked } = e.target;

        const keys = name.split(".");

        setAssessment(prev => {

            let updated = { ...prev };
            let current = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] =
                type === "checkbox" ? checked : value;

            return updated;
        });

        setAssessmentErrors(prev => ({
            ...prev,
            [name]: ""
        }));

    };
    const handleComorbiditiesChange = (e) => {

        const { value } = e.target;

        const list = value.split(",");

        setAssessment(prev => ({
            ...prev,
            comorbidities: list
        }));

    };
    const validateAssessment = () => {

        let newErrors = {};

        if (!assessment.primaryDiagnosis) {
            newErrors["primaryDiagnosis"] = "Primary diagnosis required";
        }

        if (!assessment.clinicalStatus) {
            newErrors["clinicalStatus"] = "Clinical status required";
        }

        setAssessmentErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };
    const assessmentSubmit = async (e) => {
        e.preventDefault();
        if (!validateAssessment()) return;
        try {
            setLoading(true)
            let res;
            if (assessment?._id) {
                res = await updateApiData(`api/ipd-note/assessment/${assessment?._id}`, assessment);
            } else {
                res = await securePostData("api/ipd-note/assessment", assessment);
            }
            if (res.success) {
                setAssessment({ ...assessment, _id: res.data?._id })
                toast.success("Assessment Saved Successfully");
                setTimeout(() => {
                    openTab('plan-tab')
                }, 200)
            } else {
                toast.error(res.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false)
        }

    };
    const [planErrors, setPlanErrors] = useState({});
    const [todayPlan, setTodayPlan] = useState({

        medications: {
            continue: [],
            start: [],
            stopOrHold: [],
            antibiotics: {
                name: "",
                day: "",
                totalDays: ""
            },
            controlledMeds: {
                used: false,
                justification: ""
            }
        },
        headerId: "",
        orders: {
            labs: [],
            imaging: [],
            consults: [],
            procedures: []
        },
        monitoring: {
            vitalsFrequency: "",
            ioChart: false,
            glucoseMonitoring: false
        },
        dietNursing: {
            diet: "",
            nursingInstructions: ""
        },
        discharge: {
            expected: "",
            barriers: "",
            followUp: {
                specialty: "",
                doctor: "",
                days: ""
            }
        }

    });
    const handlePlanChange = (e) => {

        const { name, value, type, checked } = e.target;

        const keys = name.split(".");

        setTodayPlan(prev => {

            let updated = { ...prev };
            let current = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] =
                type === "checkbox" ? checked : value;

            return updated;

        });

        setPlanErrors(prev => ({
            ...prev,
            [name]: ""
        }));

    };
    const handleArrayChange = (e) => {

        const { name, value } = e.target;

        const list = value.split(",");

        const keys = name.split(".");

        setTodayPlan(prev => {

            let updated = { ...prev };
            let current = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = list;

            return updated;

        });

    };
    const validatePlan = () => {

        let newErrors = {};

        if (!todayPlan.monitoring.vitalsFrequency) {
            newErrors["monitoring.vitalsFrequency"] = "Vitals frequency required";
        }

        if (!todayPlan.dietNursing.diet) {
            newErrors["dietNursing.diet"] = "Diet required";
        }

        if (!todayPlan.discharge.expected) {
            newErrors["discharge.expected"] = "Discharge plan required";
        }

        setPlanErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };
    const planSubmit = async (e) => {
        e.preventDefault();
        if (!validatePlan()) return;
        try {
            setLoading(true)
            let res;
            if (todayPlan?._id) {
                res = await updateApiData(`api/ipd-note/plan/${todayPlan?._id}`, todayPlan);
            } else {
                res = await securePostData("api/ipd-note/plan", todayPlan);
            }
            if (res.success) {
                setTodayPlan({ ...todayPlan, _id: res.data?._id })
                toast.success("Today Plan Saved Successfully");
                setTimeout(() => {
                    openTab('signOff-tab')
                }, 200)
            } else {
                toast.error(res.message)
            }

        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false)
        }

    };
    const [offErrors, setOffErrors] = useState({});
    const [signOff, setSignOff] = useState({
        authorActorNh12: "",
        headerId: "",
        authorSignature: "",
        reviewedBy: "",
        reviewerSignature: "",
        noteVersion: "v1",
        amendmentReason: ""
    });
    const handleSignOffChange = (e) => {

        const { name, value } = e.target;

        setSignOff(prev => ({
            ...prev,
            [name]: value
        }));

        setOffErrors(prev => ({
            ...prev,
            [name]: ""
        }));

    };
    const validateSignOff = () => {

        let newErrors = {};

        if (!signOff.authorActorNh12) {
            newErrors["authorActorNh12"] = "Author is required";
        }

        if (!signOff.authorSignature) {
            newErrors["authorSignature"] = "Author signature required";
        }
        if (!signOff.reviewedBy) {
            newErrors["reviewedBy"] = "Reviewd by is required";
        }

        if (signOff.noteVersion === "Addendum" && !signOff.amendmentReason) {
            newErrors["amendmentReason"] = "Amendment reason required";
        }

        setOffErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };
    const signOffSubmit = async (e) => {
        e.preventDefault();
        if (!validateSignOff()) return;
        try {
            setLoading(true)
            const res = await securePostData("api/ipd-note/sign-off", signOff);
            if (res.success) {
                document.getElementById('closeIPD')?.click()
                toast.success("Sign Off Saved Successfully");
            } else {
                toast.error(res.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false)
        }

    };
    async function fetchAllotmentData() {
        try {
            const res = await getSecureApiData(`api/bed/allotment/${data.allotmentId}`)
            if (res.success) {
                setAllotmentDetail(res.data)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }
    async function fetchHospitalStaffById() {
        try {
            const res = await getSecureApiData(`api/staff/${general.authorNh12}`)
            if (res.success) {
                const data = res.staffData
                console.log(data)
                setGeneral({ ...general, role: res.employment?.role, name: res?.user?.name })
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }
    useEffect(() => {
        if (general.authorNh12) {
            fetchHospitalStaffById()
        }
    }, [general?.authorNh12])
    useEffect(() => {
        if (allotmentDetail) {
            setGeneral({
                ...general, doctorNh12: allotmentDetail?.primaryDoctorId?.nh12,
                doctorName: allotmentDetail?.primaryDoctorId?.name, patientId: allotmentDetail?.patientId?._id,
                hospitalId: userId, bedId: allotmentDetail?.bedId?._id, roomId: allotmentDetail?.bedId?.roomId?._id,
                allotmentId: allotmentDetail?._id, ptName: allotmentDetail?.patientId?.name, ptNh12: allotmentDetail?.patientId?.nh12 || allotmentDetail?.patientId?._id,
                bed: allotmentDetail?.bedId?.bedName, room: allotmentDetail?.bedId?.roomId?.roomName
            })
        }
    }, [allotmentDetail])

    const generalSubmit = async (e) => {
        e.preventDefault()
        if (!general.authorNh12?.trim()) {
            return toast.error("Please fill you nhc id ")
        }
        try {
            setLoading(true)
            let res;
            if (headerId) {
                res = await updateApiData(`api/ipd-note/header/${headerId}`, general)
            } else {
                res = await securePostData('api/ipd-note/header', general)
            }
            if (res?.success) {
                toast.success("Daily notes begin")
                setHeaderId(res.data?._id)
                setGeneral({ ...general, _id: res.data?._id })
                setTimeout(() => {
                    openTab('subjective-tab')
                }, 200)
            } else {
                toast.error(res?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    const handleGeneralChange = (e) => {
        const { name, value, } = e.target;
        setGeneral({ ...general, [name]: value })

    }
    const openTab = (tabId) => {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return;

        const tab = new window.bootstrap.Tab(tabEl);
        tab.show();
    };
    useEffect(() => {
        if (headerId) {
            setSubjective({ ...subjective, headerId })
            setObjective({ ...objective, headerId })
            setLabImaging({ ...labImaging, headerId })
            setAssessment({ ...assessment, headerId })
            setTodayPlan({ ...todayPlan, headerId })
            setSignOff({ ...signOff, headerId })
        }
    }, [headerId])
    async function fetchedDailyIpdNotes() {
        try {
            const res = await getSecureApiData(`api/ipd-note/latest/${data?.allotmentId}`);

            if (res.success) {
                const {
                    header,
                    subjective,
                    objective,
                    labImaging,
                    assessment,
                    todayPlan,
                    signOff
                } = res.data;


                const tabs = [
                    { key: "home-tab", data: header },
                    { key: "subjective-tab", data: subjective },
                    { key: "objective-tab", data: objective },
                    { key: "lab-tab", data: labImaging },
                    { key: "assessment-tab", data: assessment },
                    { key: "plan-tab", data: todayPlan },
                    { key: "signOff-tab", data: signOff }
                ];

                const allTabsFilled = tabs.every(t => t.data);

                // ✅ Agar sab filled hai to tab change mat karo
                if (allTabsFilled) return;
                // ✅ Forms me data set karo
                if (header) setGeneral(prev => ({ ...prev, ...header, authorNh12: header?.authorId?.nh12 }));
                if (subjective) setSubjective(prev => ({ ...prev, ...subjective }));
                if (objective) setObjective(prev => ({ ...prev, ...objective }));
                if (labImaging) setLabImaging(prev => ({ ...prev, ...labImaging }));
                if (assessment) setAssessment(prev => ({ ...prev, ...assessment }));
                if (todayPlan) setTodayPlan(prev => ({ ...prev, ...todayPlan }));
                if (signOff) setSignOff(prev => ({ ...prev, ...signOff, reviewedBy: signOff?.reviewedBy?.nh12, authorActorNh12: signOff?.authorActorId?.nh12 }));
                if (header) {
                    setHeaderId(header?._id)
                }

                let nextTabIndex = null;

                tabs.forEach((tab, index) => {
                    if (!tab.data && nextTabIndex === null) {
                        nextTabIndex = index;
                    }
                });

                // ✅ Next empty tab open
                if (nextTabIndex !== null) {
                    openTab(tabs[nextTabIndex].key);
                }

            } else {
                // toast.error(res.message);
            }

        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
    useEffect(() => {

        if (data?.allotmentId && openTrigger) {
            resetForm()
            fetchAllotmentData();
            fetchedDailyIpdNotes();
        }
    }, [data, openTrigger]);
    const resetForm = () => {
        setGeneral({
            authorNh12: '',
            hospitalId: '',
            allotmentId: "",
            bedId: "",
            roomId: "",
            patientId: '',
            doctorNh12: '',
            doctorName: '', role: '', name: '',
            ptName: "",
            ptSex: "",
            ptNh12: "", bed: "", room: ""
        })
        setSubjective({
            pain: {
                status: "",
                location: "",
                score: ""
            },
            headerId: "",
            fever: false,
            breathlessness: false,
            appetite: "",
            sleep: "",
            otherSymptoms: "",
            overnightEvents: {
                stable: false,
                hypotension: false,
                desaturation: false,
                chestPain: false,
                seizure: false,
                vomiting: false,
                bleeding: false
            },
            notes: ""
        })
        setObjective({
            headerId: "",
            vitals: {
                temperature: "",
                pulse: "",
                bpSystolic: "",
                bpDiastolic: "",
                respiratoryRate: "",
                spo2: "",
                oxygenSupport: {
                    type: "",
                    litersPerMin: ""
                },
                weight: "",
                gcs: ""
            },

            intakeOutput: {
                intakeMl: "",
                outputMl: "",
                urineMl: "",
                drains: "",
                stool: ""
            },

            physicalExam: {
                general: {
                    comfortable: false,
                    distressed: false,
                    pallor: false,
                    icterus: false,
                    edema: false
                },
                cvs: "",
                rs: "",
                abdomen: "",
                cns: "",
                localExam: ""
            }
        })
        setLabImaging({
            headerId: "",
            cbc: {
                hb: "",
                wbc: "",
                platelets: "",
                abnormal: ""
            },
            rft: {
                urea: "",
                creatinine: ""
            },
            lft: {
                bilirubin: "",
                ast: "",
                alt: ""
            },
            electrolytes: {
                sodium: "",
                potassium: "",
                chloride: ""
            },
            otherTests: "",
            imaging: "",
            criticalAlert: {
                exists: false,
                details: ""
            }
        })
        setAssessment({
            primaryDiagnosis: "",
            headerId: "",
            comorbidities: [],

            activeProblems: {
                infection: false,
                pain: false,
                hypoxia: false,
                electrolyteImbalance: false,
                anemia: false,
                aki: false,
                bleeding: false,
                others: ""
            },

            clinicalStatus: ""
        })
        setTodayPlan({
            medications: {
                continue: [],
                start: [],
                stopOrHold: [],
                antibiotics: {
                    name: "",
                    day: "",
                    totalDays: ""
                },
                controlledMeds: {
                    used: false,
                    justification: ""
                }
            },
            headerId: "",
            orders: {
                labs: [],
                imaging: [],
                consults: [],
                procedures: []
            },
            monitoring: {
                vitalsFrequency: "",
                ioChart: false,
                glucoseMonitoring: false
            },
            dietNursing: {
                diet: "",
                nursingInstructions: ""
            },
            discharge: {
                expected: "",
                barriers: "",
                followUp: {
                    specialty: "",
                    doctor: "",
                    days: ""
                }
            }
        })
        setSignOff({
            authorActorNh12: "",
            headerId: "",
            authorSignature: "",
            reviewedBy: "",
            reviewerSignature: "",
            noteVersion: "v1",
            amendmentReason: ""
        })
    }



    return (
        <>
            <div className="modal step-modal fade" id="add-IPD-Notes" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content rounded-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="lg_title mb-0">IPD Daily Notes</h6>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className=""
                                    id="closeIPD"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    style={{ color: "#00000040" }}
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4 pb-5">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="employee-tabs mb-4">
                                        <ul className="nav nav-tabs gap-3 ps-2" id="myTab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link active"
                                                    id="home-tab"
                                                    data-bs-toggle="tab"
                                                    href="#home"
                                                    role="tab"
                                                >
                                                    General
                                                </a>
                                            </li>

                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="subjective-tab"
                                                    data-bs-toggle="tab"
                                                    href="#subjective"
                                                    role="tab"
                                                    disabled={!headerId}
                                                >
                                                    Subjective
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="objective-tab"
                                                    data-bs-toggle="tab"
                                                    href="#objective"
                                                    role="tab"
                                                    disabled={!headerId}
                                                >
                                                    Objective
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="lab-tab"
                                                    data-bs-toggle="tab"
                                                    href="#lab"
                                                    disabled={!headerId}
                                                    role="tab"
                                                >
                                                    Lab & Imaging
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="assessment-tab"
                                                    data-bs-toggle="tab"
                                                    href="#assessment"
                                                    role="tab"
                                                    disabled={!headerId}
                                                >
                                                    Assessment
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="plan-tab"
                                                    data-bs-toggle="tab"
                                                    href="#plan"
                                                    role="tab"
                                                    disabled={!headerId}
                                                >
                                                    Today Plan
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="signOff-tab"
                                                    data-bs-toggle="tab"
                                                    href="#signOff"
                                                    role="tab"
                                                    disabled={!headerId}
                                                >
                                                    Sign Off
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="new-panel-card">
                                        <div className="">
                                            <div className="tab-content" id="myTabContent">
                                                <div
                                                    className="tab-pane fade show active"
                                                    id="home"
                                                    role="tabpanel"
                                                >
                                                    <form onSubmit={generalSubmit}>
                                                        <div className="row">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <h4 className="lg_title text-black fw-700 mb-3">General Information</h4>

                                                            </div>
                                                        </div>


                                                        <div className="row">
                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Patient Id</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.ptNh12}

                                                                />
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Patient Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.ptName}

                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">

                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Bed</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.bed}

                                                                />
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Room</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.room}

                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-4 col-md-6 col-sm-12">

                                                                <label htmlFor="">Author id</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    placeholder=""
                                                                    name="authorNh12"
                                                                    value={general?.authorNh12}
                                                                    onChange={handleGeneralChange}

                                                                />
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Author Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.name}

                                                                />
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Role</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.role}

                                                                />
                                                            </div>

                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Attending Doctor</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control "
                                                                    placeholder=""
                                                                    name="doctorNh12"
                                                                    value={general?.doctorNh12}

                                                                />
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Attending Doctor Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    placeholder=""
                                                                    value={general?.doctorName}
                                                                />
                                                            </div>
                                                            <div className="text-end">
                                                                <button type="submit" disabled={loading}
                                                                    // onClick={() => openTab('subjective-tab')} 
                                                                    className="nw-thm-btn">{loading ? "Submitting" : "Save & Continue"}</button>
                                                            </div>

                                                        </div>
                                                    </form>
                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="subjective"
                                                    role="tabpanel"
                                                >

                                                    <form onSubmit={subjectiveSubmit}>

                                                        <div className="row">

                                                            <h4 className="lg_title text-black fw-700 mb-3">
                                                                Subjective Information
                                                            </h4>


                                                            <div className="col-lg-4">
                                                                <label>Pain Status</label>
                                                                <select
                                                                    name="pain.status"
                                                                    className="form-control"
                                                                    value={subjective?.pain?.status}
                                                                    onChange={handleSubjectiveChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="better">Better</option>
                                                                    <option value="same">Same</option>
                                                                    <option value="worse">Worse</option>
                                                                </select>

                                                            </div>


                                                            <div className="col-lg-4">
                                                                <label>Pain Location</label>
                                                                <input
                                                                    type="text"
                                                                    name="pain.location"
                                                                    className="form-control"
                                                                    value={subjective.pain.location}
                                                                    onChange={handleSubjectiveChange}
                                                                />
                                                            </div>


                                                            <div className="col-lg-4">
                                                                <label>Pain Score (0-10)</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="10"
                                                                    name="pain.score"
                                                                    className="form-control"
                                                                    value={subjective.pain.score}
                                                                    onChange={handleSubjectiveChange}
                                                                />

                                                            </div>


                                                            <div className="col-lg-3 mt-3">
                                                                <div className="form-check custom-check">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="fever"
                                                                        id="fever"
                                                                        className="form-check-input"
                                                                        checked={subjective.fever}
                                                                        onChange={handleSubjectiveChange}
                                                                    />
                                                                    <label htmlFor="fever" className="form-check-label">
                                                                        Fever
                                                                    </label>
                                                                </div>
                                                            </div>


                                                            <div className="col-lg-3 mt-3">
                                                                <div className="form-check custom-check">
                                                                    <input
                                                                        id="breathlessness"
                                                                        type="checkbox"
                                                                        name="breathlessness"
                                                                        className="form-check-input"
                                                                        checked={subjective.breathlessness}
                                                                        onChange={handleSubjectiveChange}
                                                                    />
                                                                    <label htmlFor="breathlessness" className="form-check-label">
                                                                        Breathlessness
                                                                    </label>
                                                                </div>
                                                            </div>


                                                            <div className="col-lg-4 mt-3">
                                                                <label>Appetite</label>
                                                                <select
                                                                    name="appetite"
                                                                    className="form-control"
                                                                    value={subjective.appetite}
                                                                    onChange={handleSubjectiveChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="good">Good</option>
                                                                    <option value="poor">Poor</option>
                                                                </select>
                                                                {subjectiveErrors["appetite"] && (
                                                                    <div className="text-danger small">
                                                                        {subjectiveErrors["appetite"]}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            <div className="col-lg-4 mt-3">
                                                                <label>Sleep</label>
                                                                <select
                                                                    name="sleep"
                                                                    className="form-control"
                                                                    value={subjective.sleep}
                                                                    onChange={handleSubjectiveChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="ok">OK</option>
                                                                    <option value="disturbed">Disturbed</option>
                                                                </select>
                                                                {subjectiveErrors["sleep"] && (
                                                                    <div className="text-danger small">
                                                                        {subjectiveErrors["sleep"]}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            <div className="col-lg-12 mt-3">
                                                                <label>Other Symptoms</label>
                                                                <textarea
                                                                    name="otherSymptoms"
                                                                    className="form-control"
                                                                    value={subjective.otherSymptoms}
                                                                    onChange={handleSubjectiveChange}
                                                                />
                                                            </div>


                                                            <h5 className="mt-4">Overnight Events</h5>

                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="stable">
                                                                        Stable
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        id="stable"
                                                                        name="overnightEvents.stable"
                                                                        checked={subjective.overnightEvents.stable}
                                                                        onChange={handleSubjectiveChange}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="hypotension">
                                                                        Hypotension
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="hypotension"
                                                                        name="overnightEvents.hypotension"
                                                                        checked={subjective.overnightEvents.hypotension}
                                                                        onChange={handleSubjectiveChange}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="desaturation">
                                                                        Desaturation
                                                                    </label>
                                                                    <input
                                                                        id="desaturation"
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="overnightEvents.desaturation"
                                                                        checked={subjective.overnightEvents.desaturation}
                                                                        onChange={handleSubjectiveChange}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">

                                                                    <label className="form-check-label" htmlFor="chestPain">
                                                                        Chest Pain
                                                                    </label>
                                                                    <input
                                                                        id="chestPain"
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="overnightEvents.chestPain"
                                                                        checked={subjective.overnightEvents.chestPain}
                                                                        onChange={handleSubjectiveChange}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="seizure">
                                                                        Seizure
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="overnightEvents.seizure"
                                                                        checked={subjective.overnightEvents.seizure}
                                                                        onChange={handleSubjectiveChange}
                                                                    />
                                                                </div>
                                                            </div>


                                                            <div className="col-lg-12 mt-3">
                                                                <label>Notes</label>
                                                                <textarea
                                                                    name="notes"
                                                                    className="form-control"
                                                                    value={subjective.notes}
                                                                    onChange={handleSubjectiveChange}
                                                                />
                                                            </div>


                                                            <div className="text-end mt-4">
                                                                <button type="submit" disabled={loading}
                                                                    // onClick={() => openTab('objective-tab')} 
                                                                    className="nw-thm-btn">
                                                                    {loading ? "Submitting" : "Save & Continue"}
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </form>
                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="objective"
                                                    role="tabpanel"
                                                >

                                                    <form onSubmit={objectiveSubmit}>

                                                        <h4 className="mb-3">Vitals</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Temperature</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.temperature"
                                                                    className="form-control"
                                                                    value={objective.vitals.temperature}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                                {objectiveErrors["vitals.temperature"] && (
                                                                    <div className="text-danger small">
                                                                        {objectiveErrors["vitals.temperature"]}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Pulse</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.pulse"
                                                                    className="form-control"
                                                                    value={objective.vitals.pulse}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                                {objectiveErrors["vitals.pulse"] && (
                                                                    <div className="text-danger small">
                                                                        {objectiveErrors["vitals.pulse"]}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>BP Systolic</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.bpSystolic"
                                                                    className="form-control"
                                                                    value={objective.vitals.bpSystolic}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                                {objectiveErrors["vitals.bpSystolic"] && (
                                                                    <div className="text-danger small">
                                                                        {objectiveErrors["vitals.bpSystolic"]}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>BP Diastolic</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.bpDiastolic"
                                                                    className="form-control"
                                                                    value={objective.vitals.bpDiastolic}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                                {objectiveErrors["vitals.bpDiastolic"] && (
                                                                    <div className="text-danger small">
                                                                        {objectiveErrors["vitals.bpDiastolic"]}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            <div className="col-md-3 mt-3">
                                                                <label>SpO2</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.spo2"
                                                                    className="form-control"
                                                                    value={objective.vitals.spo2}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                                {objectiveErrors["vitals.spo2"] && (
                                                                    <div className="text-danger small">
                                                                        {objectiveErrors["vitals.spo2"]}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            <div className="col-md-3 mt-3">
                                                                <label>Respiratory Rate</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.respiratoryRate"
                                                                    className="form-control"
                                                                    value={objective.vitals.respiratoryRate}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                            </div>


                                                            <div className="col-md-3 mt-3">
                                                                <label>Oxygen Type</label>
                                                                <select
                                                                    name="vitals.oxygenSupport.type"
                                                                    className="form-control"
                                                                    value={objective.vitals.oxygenSupport.type}
                                                                    onChange={handleObjectiveChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="RA">Room Air</option>
                                                                    <option value="O2">Oxygen</option>
                                                                </select>
                                                            </div>


                                                            <div className="col-md-3 mt-3">
                                                                <label>Liters / Min</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.oxygenSupport.litersPerMin"
                                                                    className="form-control"
                                                                    value={objective.vitals.oxygenSupport.litersPerMin}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Intake / Output</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Intake (ml)</label>
                                                                <input
                                                                    type="number"
                                                                    name="intakeOutput.intakeMl"
                                                                    className="form-control"
                                                                    value={objective.intakeOutput.intakeMl}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Output (ml)</label>
                                                                <input
                                                                    type="number"
                                                                    name="intakeOutput.outputMl"
                                                                    className="form-control"
                                                                    value={objective.intakeOutput.outputMl}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Urine (ml)</label>
                                                                <input
                                                                    type="number"
                                                                    name="intakeOutput.urineMl"
                                                                    className="form-control"
                                                                    value={objective.intakeOutput.urineMl}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Drains</label>
                                                                <input
                                                                    type="text"
                                                                    name="intakeOutput.drains"
                                                                    className="form-control"
                                                                    value={objective.intakeOutput.drains}
                                                                    onChange={handleObjectiveChange}
                                                                />
                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">General Exam</h4>

                                                        <div className="row">

                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="comfortable">
                                                                        Comfortable
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        id="comfortable"
                                                                        className="form-check-input"
                                                                        name="physicalExam.general.comfortable"
                                                                        checked={objective.physicalExam.general.comfortable}
                                                                        onChange={handleObjectiveChange}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="distressed">
                                                                        Distressed
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        id="distressed"
                                                                        name="physicalExam.general.distressed"
                                                                        checked={objective.physicalExam.general.distressed}
                                                                        onChange={handleObjectiveChange}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="pallor">
                                                                        Pallor
                                                                    </label>
                                                                    <input
                                                                        id="pallor"
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="physicalExam.general.pallor"
                                                                        checked={objective.physicalExam.general.pallor}
                                                                        onChange={handleObjectiveChange}
                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>


                                                        <div className="col-md-12 mt-3">
                                                            <label>CVS</label>
                                                            <textarea
                                                                name="physicalExam.cvs"
                                                                className="form-control"
                                                                value={objective.physicalExam.cvs}
                                                                onChange={handleObjectiveChange}
                                                            />
                                                        </div>

                                                        <div className="col-md-12 mt-3">
                                                            <label>RS</label>
                                                            <textarea
                                                                name="physicalExam.rs"
                                                                className="form-control"
                                                                value={objective.physicalExam.rs}
                                                                onChange={handleObjectiveChange}
                                                            />
                                                        </div>


                                                        <div className="text-end mt-4">
                                                            <button className="nw-thm-btn" type="submit" disabled={loading}
                                                            //  onClick={() => openTab('lab-tab')}
                                                            >
                                                                {loading ? "Submitting" : "Save & Continue"}
                                                            </button>
                                                        </div>

                                                    </form>

                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="lab"
                                                    role="tabpanel"
                                                >

                                                    <form onSubmit={labSubmit}>

                                                        <h4 className="mb-3">CBC</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>HB</label>
                                                                <input
                                                                    type="number"
                                                                    name="cbc.hb"
                                                                    className="form-control"
                                                                    value={labImaging.cbc.hb}
                                                                    onChange={handleLabChange}
                                                                />
                                                                {labErrors["cbc.hb"] && (
                                                                    <div className="text-danger small">
                                                                        {labErrors["cbc.hb"]}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>WBC</label>
                                                                <input
                                                                    type="number"
                                                                    name="cbc.wbc"
                                                                    className="form-control"
                                                                    value={labImaging.cbc.wbc}
                                                                    onChange={handleLabChange}
                                                                />
                                                                {labErrors["cbc.wbc"] && (
                                                                    <div className="text-danger small">
                                                                        {labErrors["cbc.wbc"]}
                                                                    </div>
                                                                )}
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Platelets</label>
                                                                <input
                                                                    type="number"
                                                                    name="cbc.platelets"
                                                                    className="form-control"
                                                                    value={labImaging.cbc.platelets}
                                                                    onChange={handleLabChange}
                                                                />
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Abnormal</label>
                                                                <input
                                                                    type="text"
                                                                    name="cbc.abnormal"
                                                                    className="form-control"
                                                                    value={labImaging.cbc.abnormal}
                                                                    onChange={handleLabChange}
                                                                />
                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">RFT</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Urea</label>
                                                                <input
                                                                    type="number"
                                                                    name="rft.urea"
                                                                    className="form-control"
                                                                    value={labImaging.rft.urea}
                                                                    onChange={handleLabChange}
                                                                />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>Creatinine</label>
                                                                <input
                                                                    type="number"
                                                                    name="rft.creatinine"
                                                                    className="form-control"
                                                                    value={labImaging.rft.creatinine}
                                                                    onChange={handleLabChange}
                                                                />
                                                                {labErrors["rft.creatinine"] && (
                                                                    <div className="text-danger small">
                                                                        {labErrors["rft.creatinine"]}
                                                                    </div>
                                                                )}
                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">LFT</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Bilirubin</label>
                                                                <input
                                                                    type="number"
                                                                    name="lft.bilirubin"
                                                                    className="form-control"
                                                                    value={labImaging.lft.bilirubin}
                                                                    onChange={handleLabChange}
                                                                />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>AST</label>
                                                                <input
                                                                    type="number"
                                                                    name="lft.ast"
                                                                    className="form-control"
                                                                    value={labImaging.lft.ast}
                                                                    onChange={handleLabChange}
                                                                />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>ALT</label>
                                                                <input
                                                                    type="number"
                                                                    name="lft.alt"
                                                                    className="form-control"
                                                                    value={labImaging.lft.alt}
                                                                    onChange={handleLabChange}
                                                                />
                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Electrolytes</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Sodium</label>
                                                                <input
                                                                    type="number"
                                                                    name="electrolytes.sodium"
                                                                    className="form-control"
                                                                    value={labImaging.electrolytes.sodium}
                                                                    onChange={handleLabChange}
                                                                />
                                                                {labErrors["electrolytes.sodium"] && (
                                                                    <div className="text-danger small">
                                                                        {labErrors["electrolytes.sodium"]}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>Potassium</label>
                                                                <input
                                                                    type="number"
                                                                    name="electrolytes.potassium"
                                                                    className="form-control"
                                                                    value={labImaging.electrolytes.potassium}
                                                                    onChange={handleLabChange}
                                                                />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>Chloride</label>
                                                                <input
                                                                    type="number"
                                                                    name="electrolytes.chloride"
                                                                    className="form-control"
                                                                    value={labImaging.electrolytes.chloride}
                                                                    onChange={handleLabChange}
                                                                />
                                                            </div>

                                                        </div>


                                                        <div className="mt-4">
                                                            <label>Other Tests</label>
                                                            <textarea
                                                                name="otherTests"
                                                                className="form-control"
                                                                value={labImaging.otherTests}
                                                                onChange={handleLabChange}
                                                            />
                                                        </div>


                                                        <div className="mt-4">
                                                            <label>Imaging</label>
                                                            <input
                                                                type="text"
                                                                name="imaging"
                                                                className="form-control"
                                                                value={labImaging.imaging}
                                                                onChange={handleLabChange}
                                                            />
                                                        </div>


                                                        <h4 className="mt-4">Critical Alert</h4>

                                                        <div className="form-check custom-check">


                                                            <input
                                                                type="checkbox"
                                                                name="criticalAlert.exists"
                                                                className="form-check-input"
                                                                checked={labImaging.criticalAlert.exists}
                                                                onChange={handleLabChange}
                                                            />

                                                            <label className="form-check-label">
                                                                Critical Alert Exists
                                                            </label>
                                                        </div>



                                                        <div className="mt-2">

                                                            <textarea
                                                                name="criticalAlert.details"
                                                                className="form-control"
                                                                placeholder="Alert Details"
                                                                value={labImaging.criticalAlert.details}
                                                                onChange={handleLabChange}
                                                            />

                                                        </div>


                                                        <div className="text-end mt-4">

                                                            <button className="nw-thm-btn" type="submit" disabled={loading}
                                                            // onClick={() => openTab('assessment-tab')}
                                                            >
                                                                {loading ? "Submitting" : "Save & Continue"}
                                                            </button>

                                                        </div>

                                                    </form>

                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="assessment"
                                                    role="tabpanel"
                                                >

                                                    <form onSubmit={assessmentSubmit}>

                                                        <h4 className="mb-3">Diagnosis</h4>

                                                        <div className="row">

                                                            <div className="col-md-6">

                                                                <label>Primary Diagnosis</label>

                                                                <input
                                                                    type="text"
                                                                    name="primaryDiagnosis"
                                                                    className="form-control"
                                                                    value={assessment.primaryDiagnosis}
                                                                    onChange={handleAssessmentChange}
                                                                />

                                                                {assessmentErrors["primaryDiagnosis"] && (
                                                                    <div className="text-danger small">
                                                                        {assessmentErrors["primaryDiagnosis"]}
                                                                    </div>
                                                                )}

                                                            </div>


                                                            <div className="col-md-6">

                                                                <label>Comorbidities (comma separated)</label>

                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Diabetes, Hypertension"
                                                                    onChange={handleComorbiditiesChange}
                                                                />

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Active Problems</h4>

                                                        <div className="row">

                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" id="infection">
                                                                        Infection
                                                                    </label>
                                                                    <input
                                                                        id="activeProblems.infection"
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="activeProblems.infection"
                                                                        checked={assessment.activeProblems.infection}
                                                                        onChange={handleAssessmentChange}
                                                                    />
                                                                </div>

                                                            </div>


                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">

                                                                    <label className="form-check-label">
                                                                        Pain
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="activeProblems.pain"
                                                                        checked={assessment.activeProblems.pain}
                                                                        onChange={handleAssessmentChange}
                                                                    />

                                                                </div>

                                                            </div>


                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Hypoxia
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="activeProblems.hypoxia"
                                                                        checked={assessment.activeProblems.hypoxia}
                                                                        onChange={handleAssessmentChange}
                                                                    />

                                                                </div>

                                                            </div>


                                                            <div className="col-md-3">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Electrolyte Imbalance
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="activeProblems.electrolyteImbalance"
                                                                        checked={assessment.activeProblems.electrolyteImbalance}
                                                                        onChange={handleAssessmentChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Anemia
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="activeProblems.anemia"
                                                                        checked={assessment.activeProblems.anemia}
                                                                        onChange={handleAssessmentChange}
                                                                    />
                                                                </div>

                                                            </div>


                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        AKI
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="activeProblems.aki"
                                                                        checked={assessment.activeProblems.aki}
                                                                        onChange={handleAssessmentChange}
                                                                    />

                                                                </div>

                                                            </div>


                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Bleeding
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="activeProblems.bleeding"
                                                                        checked={assessment.activeProblems.bleeding}
                                                                        onChange={handleAssessmentChange}
                                                                    />

                                                                </div>

                                                            </div>


                                                            <div className="col-md-4 mt-3">

                                                                <label>Other Problems</label>

                                                                <input
                                                                    type="text"
                                                                    name="activeProblems.others"
                                                                    className="form-control"
                                                                    value={assessment.activeProblems.others}
                                                                    onChange={handleAssessmentChange}
                                                                />

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Clinical Status</h4>

                                                        <div className="col-md-4">

                                                            <select
                                                                name="clinicalStatus"
                                                                className="form-control"
                                                                value={assessment.clinicalStatus}
                                                                onChange={handleAssessmentChange}
                                                            >

                                                                <option value="">Select Status</option>
                                                                <option value="improving">Improving</option>
                                                                <option value="stable">Stable</option>
                                                                <option value="deteriorating">Deteriorating</option>

                                                            </select>

                                                            {assessmentErrors["clinicalStatus"] && (
                                                                <div className="text-danger small">
                                                                    {assessmentErrors["clinicalStatus"]}
                                                                </div>
                                                            )}

                                                        </div>


                                                        <div className="text-end mt-4">

                                                            <button className="nw-thm-btn" type="submit" disabled={loading}
                                                            // onClick={() => openTab('plan-tab')}
                                                            >
                                                                {loading ? "Submitting" : "Save & Continue"}
                                                            </button>

                                                        </div>

                                                    </form>

                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="plan"
                                                    role="tabpanel"
                                                >

                                                    <form onSubmit={planSubmit}>

                                                        <h4 className="mb-3">Medications</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <label>Continue Medications</label>

                                                                <input
                                                                    type="text"
                                                                    name="medications.continue"
                                                                    className="form-control"
                                                                    placeholder="Paracetamol, Aspirin"
                                                                    onChange={handleArrayChange}
                                                                />

                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Start Medications</label>

                                                                <input
                                                                    type="text"
                                                                    name="medications.start"
                                                                    className="form-control"
                                                                    onChange={handleArrayChange}
                                                                />

                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Stop / Hold</label>

                                                                <input
                                                                    type="text"
                                                                    name="medications.stopOrHold"
                                                                    className="form-control"
                                                                    onChange={handleArrayChange}
                                                                />

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Antibiotics</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <label>Name</label>

                                                                <input
                                                                    type="text"
                                                                    name="medications.antibiotics.name"
                                                                    className="form-control"
                                                                    value={todayPlan.medications.antibiotics.name}
                                                                    onChange={handlePlanChange}
                                                                />

                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Day</label>

                                                                <input
                                                                    type="number"
                                                                    name="medications.antibiotics.day"
                                                                    className="form-control"
                                                                    value={todayPlan.medications.antibiotics.day}
                                                                    onChange={handlePlanChange}
                                                                />

                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Total Days</label>

                                                                <input
                                                                    type="number"
                                                                    name="medications.antibiotics.totalDays"
                                                                    className="form-control"
                                                                    value={todayPlan.medications.antibiotics.totalDays}
                                                                    onChange={handlePlanChange}
                                                                />

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Monitoring</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <label>Vitals Frequency</label>

                                                                <select
                                                                    name="monitoring.vitalsFrequency"
                                                                    className="form-control"
                                                                    value={todayPlan.monitoring.vitalsFrequency}
                                                                    onChange={handlePlanChange}
                                                                >

                                                                    <option value="">Select</option>
                                                                    <option value="q4h">q4h</option>
                                                                    <option value="q6h">q6h</option>
                                                                    <option value="q8h">q8h</option>
                                                                    <option value="continuous">Continuous</option>

                                                                </select>

                                                                {planErrors["monitoring.vitalsFrequency"] && (
                                                                    <div className="text-danger small">
                                                                        {planErrors["monitoring.vitalsFrequency"]}
                                                                    </div>
                                                                )}

                                                            </div>


                                                            <div className="align-items-center col-md-3">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        IO Chart
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="monitoring.ioChart"
                                                                        checked={todayPlan.monitoring.ioChart}
                                                                        onChange={handlePlanChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Glucose Monitoring
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="monitoring.glucoseMonitoring"
                                                                        checked={todayPlan.monitoring.glucoseMonitoring}
                                                                        onChange={handlePlanChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h4 className="mt-4">Diet</h4>
                                                        <div className="col-md-4">
                                                            <select
                                                                name="dietNursing.diet"
                                                                className="form-control"
                                                                value={todayPlan.dietNursing.diet}
                                                                onChange={handlePlanChange}
                                                            >
                                                                <option value="">Select Diet</option>
                                                                <option value="NPO">NPO</option>
                                                                <option value="liquid">Liquid</option>
                                                                <option value="soft">Soft</option>
                                                                <option value="normal">Normal</option>
                                                            </select>
                                                            {planErrors["dietNursing.diet"] && (
                                                                <div className="text-danger small">
                                                                    {planErrors["dietNursing.diet"]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h4 className="mt-4">Discharge Plan</h4>
                                                        <div className="col-md-4">
                                                            <select
                                                                name="discharge.expected"
                                                                className="form-control"
                                                                value={todayPlan.discharge.expected}
                                                                onChange={handlePlanChange}
                                                            >

                                                                <option value="">Select</option>
                                                                <option value="today">Today</option>
                                                                <option value="24-48h">24-48 Hours</option>
                                                                <option value="later">Later</option>

                                                            </select>

                                                            {planErrors["discharge.expected"] && (
                                                                <div className="text-danger small">
                                                                    {planErrors["discharge.expected"]}
                                                                </div>
                                                            )}

                                                        </div>


                                                        <div className="text-end mt-4">

                                                            <button className="nw-thm-btn" type="submit" disabled={loading}
                                                            //  onClick={() => openTab('signOff-tab')}
                                                            >
                                                                {loading ? "Submitting" : "Save & Continue"}
                                                            </button>

                                                        </div>

                                                    </form>

                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="signOff"
                                                    role="tabpanel"
                                                >

                                                    <form onSubmit={signOffSubmit}>

                                                        <h4 className="mb-3">Author Details</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <label>Author Staff ID</label>

                                                                <input
                                                                    type="text"
                                                                    name="authorActorNh12"
                                                                    className="form-control"
                                                                    value={signOff.authorActorNh12}
                                                                    onChange={handleSignOffChange}
                                                                />

                                                                {offErrors["authorActorNh12"] && (
                                                                    <div className="text-danger small">
                                                                        {offErrors["authorActorNh12"]}
                                                                    </div>
                                                                )}

                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Author Signature</label>

                                                                <input
                                                                    type="text"
                                                                    name="authorSignature"
                                                                    className="form-control"
                                                                    value={signOff.authorSignature}
                                                                    onChange={handleSignOffChange}
                                                                />

                                                                {offErrors["authorSignature"] && (
                                                                    <div className="text-danger small">
                                                                        {offErrors["authorSignature"]}
                                                                    </div>
                                                                )}

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Reviewer</h4>

                                                        <div className="row">


                                                            <div className="col-md-4">

                                                                <label>Reviewed By</label>

                                                                <input
                                                                    type="text"
                                                                    name="reviewedBy"
                                                                    className="form-control"
                                                                    value={signOff.reviewedBy}
                                                                    onChange={handleSignOffChange}
                                                                />
                                                                {offErrors["reviewedBy"] && (
                                                                    <div className="text-danger small">
                                                                        {offErrors["reviewedBy"]}
                                                                    </div>
                                                                )}
                                                            </div>




                                                        </div>


                                                        <h4 className="mt-4">Note Version</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <select
                                                                    name="noteVersion"
                                                                    className="form-control"
                                                                    value={signOff.noteVersion}
                                                                    onChange={handleSignOffChange}
                                                                >

                                                                    <option value="v1">Version 1</option>
                                                                    <option value="v2">Version 2</option>
                                                                    <option value="Addendum">Addendum</option>

                                                                </select>

                                                            </div>

                                                        </div>


                                                        {signOff.noteVersion === "Addendum" && (

                                                            <div className="mt-3">

                                                                <label>Amendment Reason</label>

                                                                <textarea
                                                                    name="amendmentReason"
                                                                    className="form-control"
                                                                    value={signOff.amendmentReason}
                                                                    onChange={handleSignOffChange}
                                                                />

                                                                {offErrors["amendmentReason"] && (
                                                                    <div className="text-danger small">
                                                                        {offErrors["amendmentReason"]}
                                                                    </div>
                                                                )}

                                                            </div>

                                                        )}


                                                        <div className="text-end mt-4">

                                                            <button type="submit" disabled={loading} className="nw-thm-btn">
                                                                Finalize & Sign
                                                            </button>

                                                        </div>

                                                    </form>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default DailyIPDNotes