import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';

const Submissions = (props) => {
	const [students, setStudents] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [programTasks, setProgramTasks] = useState([]);
	const [studentSelected, setStudentSelected] = useState('');
	const [programSelected, setProgramSelected] = useState('');
	const [programTaskSelected, setProgramTaskSelected] = useState('');
	const [programTaskTitleSelected, setProgramTaskTitleSelected] = useState('');
	const [submissions, setSubmissions] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		axios.get(`http://localhost:8000/api/students/`).then((res) => {
			setStudents(res.data);
		});
		axios.get(`http://localhost:8000/api/programs/`).then((res) => {
			setPrograms(res.data);
		});
	}, []);

	useEffect(() => {
		setStudentSelected('');
		setProgramTaskSelected('');
		setProgramTaskTitleSelected('');

		if (programSelected !== '') {
			axios.get(`http://localhost:8000/api/programs/program-tasks/${programSelected}`).then((res) => {
				setProgramTasks(res.data);
				axios.get(`http://localhost:8000/api/students/program-students/${programSelected}`).then((res) => {
					setStudents(res.data);
					console.log({ program: programSelected, task: programTaskTitleSelected, student: studentSelected });
					axios.post(`http://localhost:8000/api/students/all-submissions`, { program: programSelected, task: programTaskTitleSelected, student: studentSelected }).then((res) => {
						setSubmissions(res.data);
					});
				});
			});
		} else {
			setProgramTasks([]);
			axios.get(`http://localhost:8000/api/students/`).then((res) => {
				setStudents(res.data);
			});

			axios.post(`http://localhost:8000/api/students/all-submissions`, { program: programSelected, task: programTaskTitleSelected, student: studentSelected }).then((res) => {
				setSubmissions(res.data);
			});
		}
	}, [programSelected]);

	useEffect(() => {
		axios.post(`http://localhost:8000/api/students/all-submissions`, { program: programSelected, task: programTaskTitleSelected, student: studentSelected }).then((res) => {
			setSubmissions(res.data);
		});
	}, [studentSelected, programTaskSelected]);

	const handleOnChange = (e, type) => {
		if (type === 'PROGRAM') {
			setProgramSelected(e.target.value);
		} else if (type === 'TASK') {
			setProgramTaskSelected(e.target.value);
			setProgramTaskTitleSelected(e.target.childNodes[e.target.selectedIndex].getAttribute('programTaskTitle'));
		} else if (type === 'STUDENT') {
			setStudentSelected(e.target.value);
		}
	};

	const handleFileDownload = (file) => {};
	return (
		<>
			<div className='container-fluid mt-4'>
				<div className='d-flex flex-wrap flex-row align-items-center justify-content-between'>
					<h2>Submissions</h2>
					<div className='d-flex flex-row flex-nowrap my-2'>
						<select className='form-select form-select-md mx-3' aria-label='.form-select-md' onChange={(e) => handleOnChange(e, 'PROGRAM')} value={programSelected}>
							<option value=''>Select A Program</option>
							{programs.map((program) => {
								return (
									<option key={program._id} value={program._id}>
										{program.name}
									</option>
								);
							})}
						</select>
						<select className='form-select form-select-md mx-3' aria-label='.form-select-md' onChange={(e) => handleOnChange(e, 'TASK')} value={programTaskSelected}>
							<option value='' programTaskTitle=''>
								Select A Task
							</option>
							{programTasks.map((task) => {
								return (
									<option key={task._id} value={task._id} programTaskTitle={task.title}>
										{task.title}
									</option>
								);
							})}
						</select>
						<select className='form-select form-select-md  mx-3' aria-label='.form-select-md' onChange={(e) => handleOnChange(e, 'STUDENT')} value={studentSelected}>
							<option value=''>Select A Student</option>
							{students.map((student) => {
								return (
									<option key={student._id} value={student._id}>
										{student.first_name} {student.last_name}
									</option>
								);
							})}
						</select>
					</div>
				</div>
				<hr />
				<div className='table-responsive'>
					<MaterialTable
						title=''
						data={submissions}
						columns={[
							{
								title: 'Student',
								field: 'student_name'
							},
							{
								title: 'Task',
								field: 'task_title'
							},
							{
								title: 'File',
								field: 'file_name'
							},
							{
								title: 'Date Submitted',
								field: 'date_submitted'
							}
						]}
						actions={[
							{
								icon: 'download',
								tooltip: 'Download File',
								onClick: (rowData) => handleFileDownload(rowData._id)
							}
						]}
						options={{
							search: true,
							paging: true,
							filtering: true,
							exportButton: true,
							pageSize: 10,
							maxBodyHeight: '70vh'
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default Submissions;
