import React, {Component, useEffect, useState} from 'react'
import axios from 'axios';
import FileDataService from "../services/FileDataService";
import UploadDataList from "./UploadDataList";
import '../css/UploadFileComponent.css'
import {CircularProgress, CircularProgressProps, Typography, Box} from '@mui/material';

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}
const UploadFiles = () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");

    const [fileInfos, setFileInfos] = useState([]);

    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
    };

    const upload = () => {
        let currentFile = selectedFiles? selectedFiles[0] : null;

        setProgress(0);
        setCurrentFile(currentFile? currentFile : undefined);

        FileDataService.uploadFile(currentFile, (event) => {
            console.log(event)
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then((res) => {
                let progress = 0;
                setProgress(100);
                setFileInfos(res.data);
            })
            .catch(() => {
                setProgress(0);
                setMessage("Could not upload the file!");
                setCurrentFile(undefined);
            });

        setSelectedFiles(undefined);
    };
    // @ts-ignore
    return (
            <div className="upload-section">
                {currentFile && (
                    <div className="progress">
                        <CircularProgressWithLabel value={progress} />
                    </div>
                )}

                <label className="btn btn-default">
                    <input type="file" onChange={selectFile} />
                </label>

                <button
                    className="btn btn-success"
                    disabled={!selectedFiles}
                    onClick={upload}
                >
                    Upload
                </button>

                <div className="alert alert-light" role="alert">
                    {message}
                </div>
                    {fileInfos && fileInfos.length>0 &&
                        <UploadDataList data = {fileInfos} setData = {setFileInfos}/>
                    }
            </div>
        );
};
export default UploadFiles;
