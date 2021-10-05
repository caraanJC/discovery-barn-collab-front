import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateString, formatParagraph } from '../helper/functions';
const TaskItem = (props) => {
	const { taskTitle } = useParams();
	const programTasks = useSelector((state) => state.programTasks);
	const childProgramSelected = useSelector((state) => state.childProgramSelected);
	const childSelected = useSelector((state) => state.childSelected);
	const [dueDate, setDueDate] = useState('');
	const [description, setDescription] = useState('');
	const [student, setStudent] = useState('');
	const [program, setProgram] = useState('');
	const dispatch = useDispatch();

	useEffect(() => {
		async function fetchData() {
			if (childSelected !== '') {
				await axios.get(`http://localhost:8000/api/programs/${childProgramSelected}/getTasks`).then((res) => {
					dispatch({ type: 'SET_PROGRAM_TASKS', payload: res.data });
				});
			} else {
				dispatch({ type: 'SET_PROGRAM_TASKS', payload: [] });
			}
		}
		fetchData();

		const targetTask = programTasks.filter((task) => task.title === taskTitle);
		setDescription(formatParagraph(targetTask[0].description));
		setDueDate(formatDateString(targetTask[0].deadline));
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
					<div className='col-lg-8'>
						<div className='mt-4'>
							<h2 className='text-green task-view-title'>{taskTitle}</h2>
							<div className='task-view-duedate'>Due Date: {dueDate}</div>
						</div>
						<hr />
						{description}
					</div>
					<div className='col-lg-4'></div>
				</div>
			</div>
		</>
	);
};

export default TaskItem;
