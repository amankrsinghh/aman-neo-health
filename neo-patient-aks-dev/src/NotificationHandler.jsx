import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listenForegroundNotification } from "./firebase";

function NotificationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    listenForegroundNotification(navigate);
  }, []);

  return null; // UI kuch render nahi karega
}

export default NotificationHandler;
