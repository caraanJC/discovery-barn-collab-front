import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateString, formatParagraph } from '../helper/functions';
const TaskItem = (props) => {
	const { taskTitle } = useParams();
	const programTasks = useSelector((state) => state.programTasks);
	const schoolPrograms = useSelector((state) => state.programs);
	const parentChildren = useSelector((state) => state.parentChildren);
	const childProgramSelected = useSelector((state) => state.childProgramSelected);
	const childSelected = useSelector((state) => state.childSelected);
	const [dueDate, setDueDate] = useState('');
	const [description, setDescription] = useState('');
	const [student, setStudent] = useState('');
	const [program, setProgram] = useState('');
	const dispatch = useDispatch();
	const studentSubmissions = [];

	useEffect(() => {
		if (childSelected !== '') {
			axios.get(`http://localhost:8000/api/programs/${childProgramSelected}/getTasks`).then((res) => {
				dispatch({ type: 'SET_PROGRAM_TASKS', payload: res.data });
			});
		} else {
			dispatch({ type: 'SET_PROGRAM_TASKS', payload: [] });
		}

		const targetProgram = schoolPrograms.filter((program) => program._id === childProgramSelected);
		const targetChild = parentChildren.filter((child) => child._id === childSelected);
		const targetTask = programTasks.filter((task) => task.title === taskTitle);
		setDescription(formatParagraph(targetTask[0].description));
		setDueDate(formatDateString(targetTask[0].deadline));
		setStudent(`${targetChild[0].first_name} ${targetChild[0].last_name}`);
		console.log(targetProgram);
	}, []);

	const handleGoBack = () => {
		props.history.goBack();
	};
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
									<img className='submission-image' src='../assets/images/user.png' alt='student image' />
									<div className='submission-info'>
										<p className='submission-info-student'>{student}</p>
										<p className='submission-info-program'>{program}</p>
									</div>
								</div>
								<div className='submission-uploaded-files'>{studentSubmissions.length === 0 && <div className='submission-nosubmission'>No Submissions</div>}</div>
								<button className='myButton btn-success btn btn-block submission-upload-button'>Upload</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TaskItem;
