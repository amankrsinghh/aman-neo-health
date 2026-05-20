// export const IMAGE_BASE_URL = "http://127.0.0.1:9155";

export const IMAGE_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:9100";

export default IMAGE_BASE_URL;
