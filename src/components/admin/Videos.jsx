import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal, Form, Button, ProgressBar } from 'react-bootstrap';
import firebaseApp from './firebase';

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
//import Compress from "react-image-file-resizer";
import { formatDate, renderActiveTags } from '../../helper/functions';
import { v4 as uuidv4 } from 'uuid';

const Videos = (props) => {
    const data = useSelector((state) => state.videos);
    const programList = useSelector((state) => state.programs);
    const dispatch = useDispatch();
    const [showModalFlag, setShowModalFlag] = useState(false);
    const [showUploadModalFlag, setShowUploadModalFlag] = useState(false);
    const [appMessage, setAppMessage] = useState('');
    const [targetVideoId, setTargetVideoId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lessonDate, setLessonDate] = useState('');
    const [fileToUpload, setFileToUpload] = useState('');
    const [isActive, setIsActive] = useState('true');
    const [program, setProgram] = useState('');
    const [uploadType, setUploadType] = useState('');
    const [videoObjectId, setVideoObjectId] = useState('');
    const [showFileModalFlag, setShowFileModalFlag] = useState(false);
    const [targetShownImage, setTargetShownImage] = useState('');
    const [targetShownVideo, setTargetShownVideo] = useState('');
    const [targetShownType, setTargetShownType] = useState('');
    const [uploadState, setUploadState] = useState(false);
    const forUploadBtn = uploadState === false ? '' : 'hidden';
    const loadingBtn = uploadState === false ? 'hidden' : '';
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:8000/api/videos').then((res) => {
            let temp = res.data.map((data) => {
                data.lesson_date = formatDate(data.lesson_date);
                return data;
            });
            dispatch({ type: 'FETCH_VIDEOS', payload: temp });
        });

        axios.get('http://localhost:8000/api/programs').then((res) => {
            dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
        });
        //eslint-disable-next-line
    }, []);

    const handleOnUploadFileChange = (e) => {
        setAppMessage('');
        const file = e.target.files[0];
        /*if(file.type=== 'image/jpeg'||file.type=== 'image/png'){
			Compress.imageFileResizer(
				file, // the file from input
				480, // width
				480, // height
				"JPEG", // compress format WEBP, JPEG, PNG
				70, // quality
				0, // rotation
				(uri) => {
				console.log(uri);
				// You upload logic goes here
				},
				"base64" // blob or base64 default base64
			);
		}*/

        setFileToUpload(file);
    };

    const handleOnFileUpload = () => {
        let directory = uploadType === 'IMG' ? 'images' : 'videos';
        if (uploadType === '' || uploadType === null) {
            setAppMessage('Please select upload type');
        } else if (fileToUpload === null || fileToUpload === '') {
            setAppMessage('Please select file to upload');
        } else if (
            (fileToUpload.type !== 'image/png' &&
                fileToUpload.type !== 'image/jpeg' &&
                uploadType === 'IMG') ||
            (fileToUpload.type !== 'video/mp4' && uploadType === 'VID')
        ) {
            setAppMessage('Invalid File Type');
        } else {
            setAppMessage('');
            const randomStr = uuidv4();
            const storage = getStorage();
            const metadata = {
                contentType: fileToUpload.type,
            };
            const storageRef = ref(
                storage,
                `${directory}/` + fileToUpload.name + '__DBP' + randomStr
            );
            const uploadFile = uploadBytesResumable(
                storageRef,
                fileToUpload,
                metadata
            );

            uploadFile.on(
                'state_changed',
                (snapshot) => {
                    setUploadState(true);
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                    switch (snapshot.state) {
                        case 'paused':
                            //console.log('Upload is paused');
                            break;
                        case 'running':
                            //console.log('Upload is running: ');
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                    setUploadProgress(0);
                },
                () => {
                    getDownloadURL(uploadFile.snapshot.ref).then((url) => {
                        setUploadState(false);
                        axios
                            .put(
                                `http://localhost:8000/api/videos/upload-file/${videoObjectId}/${uploadType}`,
                                { path: url }
                            )
                            .then((res) => {
                                let updatedVideos = data.map((video) => {
                                    if (video._id === videoObjectId) {
                                        if (uploadType === 'IMG') {
                                            video.thumbnail_path = url;
                                        } else if (uploadType === 'VID') {
                                            video.video_path = url;
                                        }
                                    }
                                    video.lesson_date = formatDate(
                                        video.lesson_date
                                    );
                                    return video;
                                });
                                dispatch({
                                    type: 'FETCH_VIDEOS',
                                    payload: updatedVideos,
                                });
                                handleUploadModalHidden();
                                setUploadProgress(0);
                            });
                    });
                }
            );
        }
    };

    const clearVideoModal = () => {
        setTitle('');
        setDescription('');
        setLessonDate('');
        setProgram('');
        setIsActive('true');
        setAppMessage('');
    };

    const handleVideoDelete = (id) => {
        axios.delete(`http://localhost:8000/api/videos/${id}`).then((res) => {
            if (res.data.deletedCount === 1) {
                axios.get('http://localhost:8000/api/videos').then((res) => {
                    dispatch({ type: 'FETCH_VIDEOS', payload: res.data });
                });
            } else {
                console.log('Unable to delete video.' + res.data);
            }
        });
    };

    const handleVideoTableRefresh = () => {
        axios.get('http://localhost:8000/api/videos').then((res) => {
            dispatch({ type: 'FETCH_VIDEOS', payload: res.data });
        });
    };

    const handleShowUploadModal = (videoId) => {
        setVideoObjectId(videoId);
        setShowUploadModalFlag(true);
    };

    const handleShowModal = (targetVideoId) => {
        setShowModalFlag(true);
        setTargetVideoId(targetVideoId);
        clearVideoModal();
    };

    const LoadVideoData = (data) => {
        setTitle(data.title);
        setDescription(data.description);
        setLessonDate(formatDate(data.lesson_date));
        setProgram(data.program_id);
        setIsActive(data.active_flag);
        setAppMessage('');
    };

    const handleModalHidden = () => {
        setShowModalFlag(false);
    };

    const handleAddEditVideo = () => {
        if (title.trim() === '') {
            setAppMessage('Please provide video title');
        } else if (lessonDate.trim() === '') {
            setAppMessage('Please provide lesson date');
        } else if (program.trim() === '') {
            setAppMessage('Please select a program');
        } else {
            let newVideo = {
                title: title,
                description: description,
                program_id: program,
                lesson_date: lessonDate,
                active_flag: isActive,
            };
            console.log(newVideo);
            if (targetVideoId === 'ADD') {
                axios
                    .post('http://localhost:8000/api/videos', newVideo)
                    .then((res) => {
                        if (res.data.success) {
                            setShowModalFlag(false);
                            clearVideoModal();
                            axios
                                .get('http://localhost:8000/api/videos')
                                .then((res) => {
                                    dispatch({
                                        type: 'FETCH_VIDEOS',
                                        payload: res.data,
                                    });
                                });
                        } else {
                            setAppMessage(res.data.message);
                        }
                    });
            } else {
                axios
                    .put(
                        `http://localhost:8000/api/videos/${targetVideoId}`,
                        newVideo
                    )
                    .then((res) => {
                        if (res.data.success) {
                            setShowModalFlag(false);
                            clearVideoModal();
                            axios
                                .get('http://localhost:8000/api/videos')
                                .then((res) => {
                                    dispatch({
                                        type: 'FETCH_VIDEOS',
                                        payload: res.data,
                                    });
                                });
                        } else {
                            setAppMessage(res.data.message);
                        }
                    });
            }
        }
    };

    const handleOnInputChange = (e, fieldtype) => {
        if (fieldtype === 'title') {
            setTitle(e.target.value);
        } else if (fieldtype === 'description') {
            setDescription(e.target.value);
        } else if (fieldtype === 'program') {
            setProgram(e.target.value);
        } else if (fieldtype === 'lessondate') {
            setLessonDate(e.target.value);
        } else if (fieldtype === 'activeflag') {
            setIsActive(e.target.value);
        }
    };

    const handleOnChangeFileType = (e) => {
        setUploadType(e.target.value);
    };

    const handleViewFileModal = (path, type) => {
        if (type === 'IMG') {
            setTargetShownImage(path);
        } else {
            setTargetShownVideo(path);
        }
        setShowFileModalFlag(true);
        setTargetShownType(type);
    };

    const handleUploadModalHidden = () => {
        setShowUploadModalFlag(false);
        setFileToUpload('');
    };

    const renderViewFile = () => {
        if (targetShownType === 'IMG') {
            return (
                <img
                    className='thumbnail-image'
                    src={targetShownImage}
                    alt={targetShownImage}
                />
            );
        } else {
            return (
                <iframe
                    width='100%'
                    height='400'
                    src={targetShownVideo}
                    title='YouTube video player'
                    frameborder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowfullscreen
                ></iframe>
            );
        }
    };

    return (
        <>
            <div className='container-fluid  mt-4'>
                <div className='table-responsive'>
                    <MaterialTable
                        title='Videos'
                        data={data}
                        columns={[
                            {
                                title: 'Title',
                                field: 'title',
                            },
                            {
                                title: 'Description',
                                field: 'description',
                            },
                            {
                                title: 'Program',
                                field: 'programinfo[0].name',
                            },
                            {
                                title: 'Lesson Date',
                                field: 'lesson_date',
                            },
                            {
                                title: 'Thumbnail',
                                field: 'thumbnail_path',
                                render: (rowData) =>
                                    rowData.thumbnail_path !== null && (
                                        <span
                                            className='viewUploadedFileBtn'
                                            onClick={() =>
                                                handleViewFileModal(
                                                    rowData.thumbnail_path,
                                                    'IMG'
                                                )
                                            }
                                        >
                                            Click To See Image
                                        </span>
                                    ),
                            },
                            {
                                title: 'Video',
                                field: 'video_path',
                                render: (rowData) =>
                                    rowData.video_path !== null && (
                                        <span
                                            className='viewUploadedFileBtn'
                                            onClick={() =>
                                                handleViewFileModal(
                                                    rowData.video_path,
                                                    'VID'
                                                )
                                            }
                                        >
                                            Click To View Video
                                        </span>
                                    ),
                            },
                            {
                                title: 'Active Flag',
                                field: 'active_flag',
                                align: 'center',
                                render: (rowData) =>
                                    renderActiveTags(rowData.active_flag),
                            },
                        ]}
                        actions={[
                            {
                                icon: 'add',
                                tooltip: 'Add Video',
                                isFreeAction: true,
                                onClick: (event) => handleShowModal('ADD'),
                            },
                            {
                                icon: 'refresh',
                                tooltip: 'Refresh Data',
                                isFreeAction: true,
                                onClick: () => handleVideoTableRefresh(),
                            },
                            {
                                icon: 'edit',
                                tooltip: 'Edit Video',
                                onClick: (event, rowData) => {
                                    handleShowModal(rowData._id);
                                    LoadVideoData(rowData);
                                },
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete Video',
                                onClick: (event, rowData) => {
                                    let videoId = rowData._id;
                                    handleVideoDelete(videoId);
                                },
                            },
                            {
                                icon: 'upload',
                                tooltip: 'Upload Files',
                                onClick: (event, rowData) =>
                                    handleShowUploadModal(rowData._id),
                            },
                        ]}
                        options={{
                            search: true,
                            paging: true,
                            filtering: true,
                            exportButton: true,
                            pageSize: 10,
                            maxBodyHeight: '80vh',
                        }}
                    />
                </div>
            </div>

            <Modal
                show={showModalFlag}
                onHide={() => handleModalHidden()}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {targetVideoId === 'ADD' ? 'New Video' : 'Edit Video'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id='appmessage'>{appMessage}</p>
                    <Form.Group className='mb-3'>
                        <Form.Label>Title*</Form.Label>
                        <Form.Control
                            type='text'
                            value={title}
                            onChange={(e) => handleOnInputChange(e, 'title')}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type='text'
                            value={description}
                            onChange={(e) =>
                                handleOnInputChange(e, 'description')
                            }
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Program*</Form.Label>
                        <Form.Select
                            value={program}
                            onChange={(e) => handleOnInputChange(e, 'program')}
                        >
                            <option value=''></option>
                            {programList.map((p) => {
                                return (
                                    <option key={p._id} value={p._id}>
                                        {p.name}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Lesson Date*</Form.Label>
                        <Form.Control
                            type='date'
                            value={lessonDate}
                            onChange={(e) =>
                                handleOnInputChange(e, 'lessondate')
                            }
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Active Flag*</Form.Label>
                        <Form.Select
                            value={isActive}
                            onChange={(e) =>
                                handleOnInputChange(e, 'activeflag')
                            }
                        >
                            <option value='true'>Active</option>
                            <option value='false'>Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className='py-3'>
                    <Button
                        className='myButton'
                        onClick={() => handleAddEditVideo()}
                    >
                        <i className='fa fa-save' /> Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showUploadModalFlag}
                onHide={() => handleUploadModalHidden()}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id='appmessage'>{appMessage}</p>
                    <Form.Group className='mb-3'>
                        <Form.Label>Type*</Form.Label>
                        <Form.Select
                            value={uploadType}
                            onChange={(e) => handleOnChangeFileType(e)}
                        >
                            <option value=''></option>
                            <option value='IMG'>Thumbnail</option>
                            <option value='VID'>Video</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>File*</Form.Label>
                        <Form.Control
                            type='file'
                            onChange={(e) => handleOnUploadFileChange(e)}
                        />
                        <ProgressBar
                            className='mt-2'
                            variant='success'
                            now={uploadProgress}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className='py-3'>
                    <Button
                        className='myButton'
                        disabled={uploadState}
                        onClick={() => handleOnFileUpload()}
                    >
                        <span className={loadingBtn}>
                            <span
                                className='spinner-border spinner-border-sm'
                                role='status'
                                aria-hidden='true'
                            ></span>{' '}
                            Uploading...
                        </span>
                        <span className={forUploadBtn}>
                            <i className='fa fa-upload' /> Upload
                        </span>
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showFileModalFlag}
                onHide={() => setShowFileModalFlag(false)}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>View</Modal.Title>
                </Modal.Header>
                <Modal.Body>{renderViewFile()}</Modal.Body>
            </Modal>
        </>
    );
};
export default Videos;
