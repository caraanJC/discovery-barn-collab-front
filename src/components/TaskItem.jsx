import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateString, formatParagraph } from '../helper/functions';
import { Modal, Form, Button, ProgressBar } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { toNormalTime } from '../helper/index';
import TaskSubmission from './TaskSubmission';

import firebaseApp from './admin/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const TaskItem = (props) => {
	const { taskTitle } = useParams();
	const programTasks = useSelector((state) => state.programTasks);
	const schoolPrograms = useSelector((state) => state.programs);
	const parentChildren = useSelector((state) => state.parentChildren);
	const childProgramSelected = useSelector((state) => state.childProgramSelected);
	const studentSubmissions = useSelector((state) => state.submissions);
	const childSelected = useSelector((state) => state.childSelected);
	const [dueDate, setDueDate] = useState('');
	const [dueDateRaw, setDueDateRaw] = useState('');
	const [description, setDescription] = useState('');
	const [student, setStudent] = useState('');
	const [studentID, setStudentID] = useState('');
	const [program, setProgram] = useState('');
	const [uploadModalHidden, setShowModalFlag] = useState(false);
	const [appMessage, setAppMessage] = useState('');
	const [fileToUpload, setFileToUpload] = useState('');
	const [uploadState, setUploadState] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const forUploadBtn = uploadState === false ? '' : 'hidden';
	const loadingBtn = uploadState === false ? 'hidden' : '';

	const dispatch = useDispatch();

	const handleShowModal = (targetParentId) => {
		setShowModalFlag(true);
	};

	const handleUploadModalHidden = () => {
		setShowModalFlag(false);
		setFileToUpload('');
	};

	const handleOnUploadFileChange = (e) => {
		setAppMessage('');
		setFileToUpload(e.target.files[0]);
	};

	const handleOnFileUpload = () => {
		if (!fileToUpload) return setAppMessage('Please select file to upload');
		// console.log(fileToUpload.type, fileToUpload.name);

		const storage = getStorage();
		const metadata = {
			contentType: fileToUpload.type
		};
		const randomStr = uuidv4();
		const storageRef = ref(storage, `${childSelected}/${childProgramSelected}/` + randomStr + '__DBP54321__' + fileToUpload.name);
		const uploadFile = uploadBytesResumable(storageRef, fileToUpload, metadata);
		uploadFile.on(
			'state_changed',
			(snapshot) => {
				setUploadState(true);
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
						.post(`http://localhost:8000/api/students/${studentID}/submissions/upload`, {
							file_path: url,
							file_name: fileToUpload.name,
							reference: `${childSelected}/${childProgramSelected}/` + randomStr + '__DBP54321__' + fileToUpload.name,
							task_title: taskTitle
						})
						.then((res) => {
							axios.get(`http://localhost:8000/api/students/${studentID}/submissions/getSubmissions`).then((res) => {
								dispatch({
									type: 'FETCH_SUBMISSIONS',
									payload: res.data
								});
								handleUploadModalHidden();
								setUploadProgress(0);
							});
						});
				});
			}
		);
	};

	useEffect(() => {
		if (childSelected !== '') {
			axios.get(`http://localhost:8000/api/programs/${childProgramSelected}/getTasks`).then((res) => {
				dispatch({ type: 'SET_PROGRAM_TASKS', payload: res.data });
			});
		} else {
			dispatch({ type: 'SET_PROGRAM_TASKS', payload: [] });
		}

		schoolPrograms.filter((program) => {
			if (program._id === childProgramSelected) {
				setProgram(program.name);
			}
			return program;
		});
		const targetChild = parentChildren.filter((child) => child._id === childSelected);
		setStudent(`${targetChild[0].first_name} ${targetChild[0].last_name}`);
		setStudentID(`${targetChild[0]._id}`);
	}, [childSelected, dispatch, schoolPrograms, parentChildren, childProgramSelected]);

	useEffect(() => {
		programTasks.filter((task) => {
			if (task.title === taskTitle) {
				setDescription(formatParagraph(task.description));
				setDueDate(formatDateString(task.deadline));
				setDueDateRaw(toNormalTime(task.deadline));
			}
			return task;
		});
	}, [programTasks, taskTitle]);

	useEffect(() => {
		if (!studentID) return;
		axios.get(`http://localhost:8000/api/students/${studentID}/submissions/getSubmissions`).then((res) => {
			dispatch({ type: 'FETCH_SUBMISSIONS', payload: res.data });
		});
	}, [studentID, dispatch]);

	const handleGoBack = () => {
		props.history.goBack();
	};

	const submissionCountForTask = studentSubmissions.filter((submission) => submission.task_title === taskTitle).length;

	return (
		<>
			<div className='container-fluid mt-4'>
				<div className='row'>
					<span className='goBackButton' onClick={() => handleGoBack()}>
						&#10229; Go Back
					</span>
					<div className='col-xl-8 col-lg-7 col-md-12 col-sm-12 mb-3'>
						<div className='mt-4'>
							<h2 className='text-green task-view-title'>{taskTitle}</h2>
							<div className='task-view-duedate'>Due Date: {dueDate}</div>
						</div>
						<hr />
						{description}
					</div>
					<div className='col-xl-4 col-lg-5 col-md-12 col-sm-12'>
						<div className='submissions-section'>
							<div className='submissions-section-title'>Student Submissions</div>
							<div className='submissions-section-body d-flex flex-nowrap flex-column justify-content-between'>
								<div className='d-flex flex-wrap flex-row text-center align-items-center justify-content-center'>
									<img className='submission-image' src='../assets/images/user.png' alt='student avatar' />
									<div className='submission-info'>
										<p className='submission-info-student'>{student}</p>
										<p className='submission-info-program'>{program}</p>
									</div>
								</div>
								<div className='submission-uploaded-files'>
									{submissionCountForTask <= 0 && <div className='submission-nosubmission'>No Submissions</div>}
									{studentSubmissions.map((submission) => {
										if (submission.task_title === taskTitle) {
											return (
												<TaskSubmission
													key={submission._id}
													submissionId={submission._id}
													filePath={submission.file_path}
													fileName={submission.file_name}
													dateSubmitted={submission.date_submitted}
													reference={submission.reference}
												/>
											);
										}
										return '';
									})}
								</div>

								<button className='myButton btn-success btn btn-block submission-upload-button' onClick={handleShowModal}>
									Upload
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<iframe title='iframe' name='iframe' id='iframe'></iframe>
			<Modal show={uploadModalHidden} onHide={handleUploadModalHidden} keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Upload Work</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p id='appmessage'>{appMessage}</p>
					<Form.Group className='mb-3'>
						<Form.Label>Choose File To Upload*</Form.Label>
						<Form.Control type='file' onChange={handleOnUploadFileChange} />
						<ProgressBar className='mt-2' variant='success' now={uploadProgress} />
					</Form.Group>
				</Modal.Body>
				<Modal.Footer className='py-3'>
					<Button className='myButton btn-success' disabled={uploadState} onClick={() => handleOnFileUpload()}>
						<span className={loadingBtn}>
							<span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Uploading...
						</span>
						<span className={forUploadBtn}>
							<i className='fa fa-upload' /> Upload
						</span>
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default TaskItem;
