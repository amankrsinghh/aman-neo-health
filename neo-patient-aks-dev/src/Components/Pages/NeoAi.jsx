import { faChevronLeft, faClose, faMicrophone, faPaperclip, faPaperPlane, faPhone, faPlusCircle, faSearch, faVideo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import AudioWaveform from "../AudioWaveform";
import base_url from "../../baseUrl";
import Loader from "../Layouts/Loader";
import '../../assets/css/chat.css'
import { toast } from "react-toastify";
import ProfileSidebar from "./ProfileSidebar";
import { set } from "date-fns";
import { Link } from "react-router-dom";
import { PiPaperPlaneRightFill } from "react-icons/pi";
function NeoAi() {
    const bottomRef = useRef(null);
    const userId = localStorage.getItem('userId')
    const [generalQuestions, setGeneralQuestions] = useState([]);
    const [myQuestions, setMyQuestions] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState()
    const [loading, setLoading] = useState(false)
    const [question, setQuestion] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [recording, setRecording] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [recordSeconds, setRecordSeconds] = useState(0);
    const recordTimerRef = useRef(null);
    const [chatSessions, setChatSessions] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    async function fetchGeneralQuestions() {
        if (!question.trim()) return toast.error("Please enter a question");
        setMyQuestions(prev => [
            ...prev,
            {
                type: "user",
                question,
                file: previewFile || null,
                audio: recordedAudio || null
            },
        ]);
        setIsTyping(true);
        setRecording(false)
        setQuestion("");
        const data = new FormData()
        data.append("question", question)
        data.append("userId", userId)
        let chatSessionId
        if (!activeChatId) {
            const res = await securePostData("api/comman/create-chat");
            chatSessionId = res.data?._id
            setActiveChatId(res.data?._id)
        } else {
            chatSessionId = activeChatId
        }
        data.append("chatSessionId", chatSessionId)
        if (previewFile) {
            data.append("file", previewFile)
        } if (recordedAudio) {
            data.append("audio", recordedAudio)
        }
        try {
            const response = await securePostData(`api/comman/follow-up-question`, data)

            if (response.success) {
                setPreviewFile(null);
                setPreviewUrl(null);
                setRecordedAudio(null);
                const formattedMessages = [];
                response.questions.forEach(item => {
                    // USER QUESTION (RIGHT)
                    // formattedMessages.push({
                    //     type: "user",
                    //     question: item.question,
                    //     file: item.file || null,
                    //     audio: item.audio || null
                    // });
                    if (item.responseId) {
                        formattedMessages.push({
                            type: "ai",
                            answer: {
                                medicalBoundaryNote: "",
                                defination: "",
                                summary: item?.responseId.summary,
                                followUpQuestions: item?.responseId.followUpQuestions || [],
                                whenToSeekHelp: [],
                                seriousCauses: [],
                                commonCauses: [],
                                generalNextSteps: [],

                            }
                        });
                    }
                });

                fetchChatSessions();

                setMyQuestions(prev => [...prev, ...formattedMessages]);

            }
            else {
                toast.error("Please try after some time")
            }
        } catch (error) {
            toast.error(error?.message)
        } finally {
            setIsTyping(false);
        }
    }
    async function fetchMyQuestions(chatId) {
        try {
            const response = await getSecureApiData(`api/comman/ask/question?chatSessionId=${chatId}`);

            if (response.success) {
                const formattedMessages = [];

                response.data.forEach(item => {
                    // USER QUESTION (RIGHT)
                    formattedMessages.push({
                        type: "user",
                        question: item.question,
                        file: item.file || null,
                        audio: item.audio || null
                    });

                    // AI ANSWER (LEFT)
                    if (item.responseId) {
                        formattedMessages.push({
                            type: "ai",
                            answer: {
                                medicalBoundaryNote: item?.responseId?.medicalBoundaryNote,
                                defination: item?.responseId?.defination,
                                summary: item?.responseId?.summary,
                                followUpQuestions: item?.responseId?.followUpQuestions || [],
                                generalNextSteps: item.responseId?.generalNextSteps || [],
                                whenToSeekHelp: item.responseId?.whenToSeekHelp || [],
                                seriousCauses: item.responseId?.seriousCauses || [],
                                commonCauses: item.responseId?.commonCauses || []
                            }
                        });
                    }
                });

                setMyQuestions(formattedMessages);
                setTotalPages(response.totalPages);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function askQuestion(text = question) {
        if (!text.trim()) return;

        setMyQuestions(prev => [...prev, { type: "user", question: text, chatSessionId: activeChatId }]);
        setIsTyping(true);
        setQuestion("");
        try {
            const response = await securePostData(`api/comman/ask-question`, {
                question: text, chatSessionId: activeChatId,
                userId
            });

            if (response.success) {
                setMyQuestions(prev => [...prev, {
                    type: "ai",
                    answer: {
                        short: response.data.responseId ? response.data.responseId?.answer_short : response.data?.answer_short,
                        detailed: response.data.responseId ? response.data.responseId?.answer_detailed : response.data?.answer_detailed,
                        generalNextSteps: response.data.responseId ? response.data.responseId?.generalNextSteps || [] : response.data?.generalNextSteps || [],
                        whenToSeekHelp: response.data.responseId ? response.data.responseId?.whenToSeekHelp || [] : response.data?.whenToSeekHelp || [],
                        seriousCauses: response.data.responseId ? response.data.responseId?.seriousCauses || [] : response.data?.seriousCauses || [],
                        commonCauses: response.data.responseId ? response.data.responseId?.commonCauses || [] : response.data?.commonCauses || [],
                        followUpQuestions: response?.data?.followUpQuestions || []
                    }
                }]);
            } else {
                toast.error("Please try after some time")
            }
        } catch (err) {
            toast.error(err?.message)
        } finally {
            setIsTyping(false);
        }
    }
    useEffect(() => {
        if (activeChatId && chatSessions?.length > 0) {
            fetchMyQuestions(activeChatId);
        }
    }, [activeChatId]);
    useEffect(() => {
        fetchChatSessions();
    }, []);

    async function fetchChatSessions() {
        setLoading(true)
        try {

            const res = await getSecureApiData("api/comman/chat-sessions");
            if (res.success) {
                setChatSessions(res.data);

                if (res.data.length > 0) {
                    setActiveChatId(res.data[0]._id);
                }
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    async function startNewChat() {
        const res = await securePostData("api/comman/create-chat");
        if (res.success) {
            setChatSessions(prev => [res.data, ...prev]);
            setActiveChatId(res.data._id);
            setMyQuestions([]); // clear messages
        }
    }
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollTop =
                bottomRef.current.scrollHeight;
        }
    }, [myQuestions, isTyping]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreviewFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };
    const uploadAudio = async (file) => {
        if (!selectedChat) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await securePostData("api/chat/upload", formData);

        socketRef.current.emit("send-message", {
            toUserId: selectedChat.participants[0]._id,
            message: "",
            file: {
                ...res.file,
                isAudio: true,
            },
        });

        setMessages((prev) => [
            ...prev,
            {
                sender: { _id: myUserId },
                file: { ...res.file, isAudio: true },
                createdAt: new Date(),
            },
        ]);
    };

    const toggleRecording = async () => {
        if (recording) {
            mediaRecorderRef.current.stop();
            clearInterval(recordTimerRef.current);
            recordTimerRef.current = null;
            setRecording(false);
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, {
                type: "audio/webm",
            });

            setRecordedAudio(audioBlob); // ✅ STORE, NOT SEND
        };

        mediaRecorderRef.current.start();
        setRecording(true);
        setRecordSeconds(0);
        recordTimerRef.current = setInterval(() => {
            setRecordSeconds((s) => s + 1);
        }, 1000);

    };
    return (
        <>
            {loading ? <Loader />
                :
                <>
                    <section className="chat-section">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-3 pe-lg-0 mb-3">
                                    <div className="chat-left-usr-bx position-relative">

                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <Link to={'/my-appointment'} className="thm-btn p-2"><FontAwesomeIcon icon={faChevronLeft} /></Link>
                                            <h6>Message</h6>

                                        </div>
                                        <div>
                                            {chatSessions?.map((chat) => (
                                                <a href="#" key={chat?._id}>
                                                    <div
                                                        className="chat-usr-card nw-chat-usr-card py-3"
                                                        onClick={() => setActiveChatId(chat?._id)}
                                                    >
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="chat-usr-avatr-crd">
                                                                <div className="chat-usr-info">
                                                                    <h5 className="text-capitalize">{chat?.title.slice(0, 35)}</h5>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9 mb-3">
                                    <div className="right-chat-card chat-tp-header">
                                        <div className="lab-tp-title patient-bio-tab  d-flex align-items-center justify-content-between py-2">
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="chat-usr-avatr-crd">
                                                        <div className="chat-usr-avatr-bx nw-chat-add-live">
                                                            <img src="/logo.png" alt="" style={{ objectFit: 'contain' }} />
                                                        </div>
                                                        <div className="chat-usr-info">
                                                            <h5 className="mb-0">Neo AI Chat</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                {(
                                                    (activeChatId && myQuestions.length > 0)
                                                ) && (
                                                        <div>
                                                            <button
                                                                className="p-2 thm-btn outline"
                                                                onClick={() => startNewChat()}
                                                            >
                                                                <FontAwesomeIcon icon={faPlusCircle} />
                                                            </button>
                                                        </div>
                                                    )}
                                            </div>

                                        </div>

                                        <div className="all-chating-content-bx">
                                            <div className="chat-container" ref={bottomRef}>
                                                {myQuestions.map((msg, i) => (
                                                    <div
                                                        key={i}
                                                        className={`d-flex mb-3 ${msg.type === "user"
                                                            ? "justify-content-end"
                                                            : "justify-content-start"
                                                            }`}
                                                    >
                                                        <div className={`chat-bubble ${msg.type === "user" ? "nw-right text-white" : "nw-left"
                                                            }`} >

                                                            {/* USER QUESTION */}
                                                            {msg.type === "user" && (<>

                                                                {msg?.file && (() => {
                                                                    const isFileObject = typeof msg.file === "object";

                                                                    // ---------- FILE OBJECT (Preview) ----------
                                                                    if (isFileObject) {
                                                                        if (msg.file.type === "application/pdf") {
                                                                            return (
                                                                                <p className="text-info mt-1">
                                                                                    📄 {msg.file.name}
                                                                                </p>
                                                                            );
                                                                        }

                                                                        const imageUrl = URL.createObjectURL(msg.file);

                                                                        return (
                                                                            <img
                                                                                src={imageUrl}
                                                                                alt="uploaded"
                                                                                style={{ maxWidth: "200px", marginTop: "8px" }}
                                                                            />
                                                                        );
                                                                    }

                                                                    // ---------- STRING PATH (Backend) ----------
                                                                    const isPdf = msg.file.toLowerCase().endsWith(".pdf");

                                                                    if (isPdf) {
                                                                        return (
                                                                            <p className="text-info mt-1">
                                                                                📄 {msg.file.split("/").pop()}
                                                                            </p>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <img
                                                                            src={`${base_url}/${msg.file}`}
                                                                            alt="uploaded"
                                                                            style={{ maxWidth: "200px", marginTop: "8px" }}
                                                                        />
                                                                    );
                                                                })()}
                                                                {/* -------- AUDIO RENDER -------- */}
                                                                {msg?.audio && (() => {
                                                                    const isAudioObject = typeof msg.audio === "object";

                                                                    // ---------- AUDIO OBJECT (Preview) ----------
                                                                    if (isAudioObject) {
                                                                        const audioUrl = URL.createObjectURL(msg.audio);

                                                                        return (
                                                                            <div className="audio-preview mt-2">
                                                                                <audio controls src={audioUrl} />
                                                                                <div className="text-muted small">{msg.audio.name}</div>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    // ---------- STRING PATH (Backend) ----------
                                                                    return (
                                                                        <div className="audio-preview mt-2">
                                                                            <audio controls src={`${base_url}/${msg.audio}`} />
                                                                        </div>
                                                                    );
                                                                })()}

                                                                <p className="mb-0 text-white">{msg.question}</p>

                                                            </>
                                                            )}

                                                            {/* AI ANSWER */}
                                                            {msg.type === "ai" && (
                                                                <>
                                                                    <p><strong>{msg.answer.defination}</strong></p>
                                                                    {/* Common Causes */}
                                                                    {msg.answer.commonCauses?.length > 0 && (
                                                                        <>
                                                                            <p className="mt-2 text-info"><strong>� Common Causes</strong></p>
                                                                            <ul className="list-group">
                                                                                {msg.answer.commonCauses.map((item, idx) => (
                                                                                    <li className="list-group-item" key={idx}>{item}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </>
                                                                    )}

                                                                    {/* Help */}
                                                                    {msg.answer.whenToSeekHelp?.length > 0 && (
                                                                        <>
                                                                            <p className="mt-2"><strong>✅ When To Seek Help</strong></p>
                                                                            <ul className="list-group">
                                                                                {msg.answer.whenToSeekHelp.map((item, idx) => (
                                                                                    <li className="list-group-item" key={idx}>{item}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </>
                                                                    )}

                                                                    {/* Serious Causes */}
                                                                    {msg.answer.seriousCauses?.length > 0 && (
                                                                        <>
                                                                            <p className="mt-2 text-danger"><strong>🚨 Serious Causes</strong></p>
                                                                            <ul className="list-group">
                                                                                {msg.answer.seriousCauses.map((item, idx) => (
                                                                                    <li className="list-group-item" key={idx}>{item}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </>
                                                                    )}
                                                                    {msg?.answer?.followUpQuestions?.length > 0 && (
                                                                        <>
                                                                            {msg?.answer?.summary && <p className="mt-2 "><strong>Summary:</strong>{msg?.answer?.summary}</p>}
                                                                            <p className="mt-2 text-danger"><strong>Follow Up Questions</strong></p>
                                                                            <ul className="list-group">
                                                                                {msg?.answer?.followUpQuestions.map((item, idx) => (
                                                                                    <li className="list-group-item" key={idx}
                                                                                        style={{ cursor: "pointer" }}
                                                                                        onClick={() => askQuestion(item)}>{item}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </>
                                                                    )}
                                                                    {msg.answer.medicalBoundaryNote && <p><strong>Note :</strong>{msg.answer.medicalBoundaryNote}</p>}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                {isTyping && <p className="typing-text">Neo AI is typing...</p>}

                                            </div>


                                            <div className="">

                                                <div className="custom-frm-bx mb-0">
                                                    <div>
                                                        {recording && (
                                                            <div className="recording-indicator mb-2">
                                                                <span className="text-danger fw-bold">
                                                                    🔴 Recording… {recordSeconds}s
                                                                </span>
                                                                <small className="d-block text-muted">
                                                                    Tap mic to stop
                                                                </small>
                                                            </div>
                                                        )}

                                                        {recordedAudio && !isTyping && (
                                                            <div className="audio-preview mb-2">
                                                                <small className="text-success d-block mb-1">
                                                                    🎧 Audio ready to send
                                                                </small>

                                                                <AudioWaveform audioBlob={recordedAudio} />

                                                                <button
                                                                    className="btn btn-sm btn-outline-danger mt-1 text-black"
                                                                    onClick={() => setRecordedAudio(null)}
                                                                >
                                                                    ❌ Cancel Audio
                                                                </button>
                                                            </div>
                                                        )}


                                                        <div className="chat-papperclip-bx">
                                                            {/* 📎 FILE */}
                                                            <button
                                                                type="button"
                                                                className="papperclip-btn"
                                                                onClick={() => fileInputRef.current.click()}
                                                            >
                                                                <FontAwesomeIcon icon={faPaperclip} />
                                                            </button>

                                                            {/* 🎤 MIC */}
                                                            <button
                                                                type="button"
                                                                className={`mic-btn ${recording ? "recording" : ""}`}
                                                                onClick={toggleRecording}
                                                            >
                                                                {recording ? "⏹️" : <FontAwesomeIcon icon={faMicrophone} style={{ color: '#00B4B5' }} />}
                                                            </button>
                                                        </div>
                                                        {previewUrl && !isTyping && (
                                                            <div className="image-preview chat-picture-box ">
                                                                <img
                                                                    src={previewUrl}
                                                                    alt="preview"
                                                                    style={{
                                                                        maxWidth: "200px",
                                                                        borderRadius: "8px",
                                                                        display: "block",

                                                                    }}
                                                                />

                                                                <button
                                                                    className="chat-close-btn"
                                                                    onClick={() => {
                                                                        setPreviewFile(null);
                                                                        setPreviewUrl(null);
                                                                    }}
                                                                >
                                                                    <div className="chat-close-picture">
                                                                        <FontAwesomeIcon icon={faClose} />
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            hidden
                                                            ref={fileInputRef}
                                                            onChange={handleFileSelect}
                                                        />
                                                        <div className="chat-papper-plane-bx">

                                                            <button onClick={() => fetchGeneralQuestions()} className="chat-papper-plane-btn"> <PiPaperPlaneRightFill /></button>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        style={{ paddingLeft: '70px', paddingRight: '70px' }}
                                                        className="form-control new-control-frm"
                                                        value={question}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setQuestion(value);

                                                        }}

                                                        onKeyDown={(e) => e.key === "Enter" && fetchGeneralQuestions()}
                                                    />




                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>


                </>
            }
        </>
    )
}

export default NeoAi