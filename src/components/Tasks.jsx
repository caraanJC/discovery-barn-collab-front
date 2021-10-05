import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toNormalTime } from '../helper';
import { useHistory } from 'react-router';

import { Form } from 'react-bootstrap';

import { Button, Card, Modal } from 'react-bootstrap';

//import { storage } from './admin/firebase';
//import { storage } from './base';
import firebaseApp from './admin/firebase';
import { getDownloadURL, ref, uploadBytes, getStorage as storage } from '@firebase/storage';

const Tasks = () => {
	const parentToken = useSelector((state) => state.parentToken);
	const students = useSelector((state) => state.parentChildren);

	const [showModal, setShowModal] = useState(false);

	const [selectedTask, setSelectedTask] = useState({});
	const [appMessage, setAppMessage] = useState('');
	const [fileToSubmit, setFileToSubmit] = useState('');
	const [backendFile, setBackendFile] = useState();

	const childSelected = useSelector((state) => state.childSelected);
	const childProgramSelected = useSelector((state) => state.childProgramSelected);
	const programTasks = useSelector((state) => state.programTasks);

	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		if (childSelected != '') {
			axios.get(`http://localhost:8000/api/programs/${childProgramSelected}/getTasks`).then((res) => {
				dispatch({ type: 'SET_PROGRAM_TASKS', payload: res.data });
			});
		} else {
			dispatch({ type: 'SET_PROGRAM_TASKS', payload: [] });
		}
	}, [childSelected]);

	const handleOnChange = (e) => {
		let child = e.target.value;
		let childprogram = e.target.childNodes[e.target.selectedIndex].getAttribute('data-program-id');
		dispatch({ type: 'SET_CHILD_PROGRAM_SELECTED', payload: childprogram });
		dispatch({ type: 'SET_CHILD_SELECTED', payload: child });
	};

	/*const handleOpenModal = (task) => {
		setShowModal(true);
		setSelectedTask({
			...task,
			file_type_string: file_type_strings[task.file_type]
		});
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setFileToSubmit('');
		setAppMessage('');
	};

	const handleSetFile = (e) => {
		setFileToSubmit(e.target.files[0]);
	};

	const getImageURL = (filename, taskID) => {
		getDownloadURL(ref(storage, filename))
			.then((url) => {
				setBackendFile({ taskID, url });
			})
			.catch((error) => {
				// Handle any errors
				console.log(error);
			});
	};

	const getTasks = async (student) => {
		let tasks;
		await axios.get(`http://localhost:8000/api/programs/${childProgramSelected}/getTasks`).then((res) => {
			tasks = res.data;
		});
		return tasks;
	};

	const fileExists = async (taskID) => {
		let result;

		await axios.post(`http://localhost:8000/api/students/${childSelected}/submissions/file-exist`, { task_id: taskID }).then((res) => (result = res.data));
		return result;
	};

	const handleSubmit = async (task) => {
		if (!fileToSubmit.name) return setAppMessage('Please provide the file');

		const existing = await fileExists(task._id);

		if (!existing) {
			//  submit file to firebase

			const location = `${childSelected.first_name}${childSelected.last_name.replace(/ /g, '')}/${task.title.replace(/ /g, '')}/${fileToSubmit.name}`;

			const imagesRef = ref(storage, location);
			await uploadBytes(imagesRef, fileToSubmit).then((snapshot) => {
				console.log('Uploaded a file');
			});

			getImageURL(`${location}`, task._id);
		} else {
			setAppMessage('Already Submitted');
		}
	};

	const getStatus = async (student) => {
		let tasks = student.task_list.map((task) => {
			const foundSubmission = student?.submissions.find((submission) => submission.task_id === task._id) ? student?.submissions.find((submission) => submission.task_id === task._id) : {};

			if (Object.keys(foundSubmission).length !== 0) {
				if (foundSubmission.date_submitted) {
					if (toNormalTime(foundSubmission.date_submitted) > toNormalTime(task.deadline)) {
						task.status = 'Late';
					} else {
						task.status = 'Submitted';
					}
				}
			} else {
				task.status = 'Not Submitted';
			}
			return task;
		});

		return tasks;
	};

	const getAllStudents = async () => {
		await axios.get(`http://localhost:8000/api/parents/get-students/${parentToken}`).then(async (res) => {
			res.data.map(async (student) => {
				student.task_list = await getTasks(student);
				student.task_list = await getStatus(student);

				dispatch({
					type: 'FETCH_STUDENT',
					payload: student
				});
				return student;
			});
		});
	};

	useEffect(() => {
		(async () => await getAllStudents())();
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (backendFile) {
			const init = async () => {
				await axios.post(`http://localhost:8000/api/students/${childSelected._id}/submissions/upload`, {
					link: backendFile.url,
					task_id: backendFile.taskID
				});
				handleCloseModal();
			};
			init();
		}
		// eslint-disable-next-line
	}, [backendFile]);*/

	return (
		<>
			<div className='container-fluid mt-4'>
				<div className='table-responsive'>
					<div className='d-flex align-items-bottom justify-content-between'>
						<h2>Tasks</h2>

						<select className='form-select form-select-md mb-3 ' aria-label='.form-select-md' id='childselection' onChange={(e) => handleOnChange(e)} value={childSelected}>
							<option value='' data-program-id=''>
								Select A Student
							</option>
							{students.map((child) => {
								return (
									<option key={child._id} value={child._id} data-program-id={child.program_id}>
										{child.first_name} {child.last_name}
									</option>
								);
							})}
						</select>
					</div>
					<hr />
					<div className='d-flex flex-wrap flex-row align-items-center justify-content-center'>
						{programTasks.length > 0 &&
							programTasks.map((task) => (
								<Card
									key={task.title}
									className='text-center m-4 '
									style={{
										height: '300px',
										width: '250px'
									}}>
									<Card.Header>
										<br />
									</Card.Header>
									<Card.Body className='d-flex flex-wrap flex-row align-items-center justify-content-center'>
										<Card.Title className='task-title'>{task.title}</Card.Title>
										<p className='task-date'>Due Date: {task.deadline && toNormalTime(task.deadline)}</p>
										<Button className='myButton btn-success' onClick={console.log('sdfsd')}>
											View Task
										</Button>
									</Card.Body>
									<Card.Footer className='text-muted'>
										<p className={`task-status ${task.status === 'COMPLETED' ? 'completed' : ''}`}>{task.status === undefined || task.status === '' ? 'PENDING' : task.status}</p>
									</Card.Footer>
								</Card>
							))}
					</div>
				</div>
			</div>
		</>
	);
};

export default Tasks;
