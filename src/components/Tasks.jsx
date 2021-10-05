import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toNormalTime } from '../helper';
import { useHistory } from 'react-router';
import { Button, Card } from 'react-bootstrap';

const Tasks = (props) => {
	const students = useSelector((state) => state.parentChildren);
	const childSelected = useSelector((state) => state.childSelected);
	const childProgramSelected = useSelector((state) => state.childProgramSelected);
	const programTasks = useSelector((state) => state.programTasks);
	const dispatch = useDispatch();
	const history = useHistory();

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
	}, [childSelected]);

	const handleOnChange = (e) => {
		let child = e.target.value;
		let childprogram = e.target.childNodes[e.target.selectedIndex].getAttribute('data-program-id');
		dispatch({ type: 'SET_CHILD_PROGRAM_SELECTED', payload: childprogram });
		dispatch({ type: 'SET_CHILD_SELECTED', payload: child });
	};

	const handleOnViewTask = (taskTitle) => {
		history.push(`/view-task/${taskTitle}`);
	};

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
										<Button className='myButton btn-success' onClick={() => handleOnViewTask(task.title)}>
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
