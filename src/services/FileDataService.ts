import http from "../http-common";

const getAll = (params) => {
    return http.get("/csv/data", { params });
};

const uploadFile = (file, onUploadProgress) => {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/csv/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
};

export default {
    getAll,
    uploadFile
};