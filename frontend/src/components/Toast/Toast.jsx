import { useEffect } from "react";
import "./Toast.css";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{type === "success" ? "✓" : "✕"}</span>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

export default Toast;
