import { useEffect, useState } from "react";
import { faBell, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../utils/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "y", sec: 31536000 },
    { label: "mo", sec: 2592000 },
    { label: "d", sec: 86400 },
    { label: "h", sec: 3600 },
    { label: "m", sec: 60 }
  ];

  for (const i of intervals) {
    const val = Math.floor(seconds / i.sec);
    if (val >= 1) return val + i.label;
  }
  return "now";
}

function Notification() {

  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/api/admin/notifications");
      setNotifications(res.data.data);
    } catch {
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
  loadNotifications();

  const interval = setInterval(loadNotifications, 10000); // every 10s
  return () => clearInterval(interval);
}, []);


/* DELETE ONE */
const deleteOne = (id) => {
  Swal.fire({
    title: "Delete notification?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete"
  }).then(async (r) => {
    if (!r.isConfirmed) return;

    await api.delete(`/api/admin/notifications/${id}`);
    setNotifications(prev => prev.filter(n => n._id !== id));
    toast.success("Deleted");
  });
};

/* DELETE ALL */
const deleteAll = () => {
  Swal.fire({
    title: "Delete all notifications?",
    text: "This cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete All"
  }).then(async (r) => {
    if (!r.isConfirmed) return;

    await api.delete("/api/admin/notifications");
    await loadNotifications();
    toast.success("All notifications cleared");
  });
};


  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">

        <div className="row ">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Notification</h3>
            </div>

            <div>
              <button type="button" className="nw-thm-btn" onClick={deleteAll}>
                All Delete
              </button>
            </div>
          </div>
        </div>

        <div className='new-mega-card'>
          <div className="row">
            <div className="col-lg-12 col-dm-12 col-sm-12">

              {notifications.length === 0 && (
                <div className="text-center p-4">No notifications</div>
              )}

              {notifications.map((n) => (
                <div className="notification-card" key={n._id}>
                  <div className="notification-parent-card">

                    <div className="notification-sub-card">
                      <div>
                        <span className="notifi-icon-bx">
                          <FontAwesomeIcon icon={faBell} />
                        </span>
                      </div>

                      <div className="notification-content">
                        <h5>{n.title}</h5>
                        <p>{n.message}</p>
                      </div>
                    </div>

                    <div className="notification-timing">
                      <span>
                        <button
                            type="button"
                            className="notifi-remv-btn"
                            onClick={() => deleteOne(n._id)}
                            >
                            <FontAwesomeIcon icon={faTrash} />
                            </button>

                      </span>
                      <h6>{timeAgo(n.createdAt)}</h6>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Notification;
