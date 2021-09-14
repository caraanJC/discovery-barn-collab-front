import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
const Students = (props) => {
	const data = useSelector((state) => state.students);
	const parentList = useSelector((state) => state.parents);
	const programList = useSelector((state) => state.programs);
	const dispatch = useDispatch();
	const [showModalFlag, setShowModalFlag] = useState(false);
	const [appMessage, setAppMessage] = useState('');
	const [targetStudentId, setTargetStudentId] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [age, setAge] = useState('');
	const [parent, setParent] = useState('');
	const [programs, setPrograms] = useState('');

	useEffect(() => {
		axios.get('http://localhost:8000/api/students').then((res) => {
			dispatch({ type: 'FETCH_STUDENTS', payload: res.data });
			console.log(res.data);
		});

		axios.get('http://localhost:8000/api/parents').then((res) => {
			dispatch({ type: 'FETCH_PARENTS', payload: res.data });
		});

		axios.get('http://localhost:8000/api/programs').then((res) => {
			dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
		});
	}, []);

	const clearStudentModal = () => {
		setFirstName('');
		setLastName('');
		setAge('');
		setParent('');
		setPrograms('');
		setAppMessage('');
	};

	const handleStudentDelete = (id) => {
		axios.delete(`http://localhost:8000/api/students/${id}`).then((res) => {
			if (res.data.deletedCount === 1) {
				axios.get('http://localhost:8000/api/students').then((res) => {
					dispatch({ type: 'FETCH_STUDENTS', payload: res.data });
				});
			} else {
				console.log('Unable to delete student.' + res.data);
			}
		});
	};

	const handleStudentTableRefresh = () => {
		axios.get('http://localhost:8000/api/students').then((res) => {
			dispatch({ type: 'FETCH_STUDENTS', payload: res.data });
		});
	};

	const handleShowModal = (targetStudentId) => {
		setShowModalFlag(true);
		setTargetStudentId(targetStudentId);
	};

	const LoadStudentData = (data) => {
		setFirstName(data.first_name);
		setLastName(data.last_name);
		setAge(data.age);
		setParent(data.parent_id);
		setPrograms(data.program_id);
		setAppMessage('');
	};

	const handleModalHidden = () => {
		setShowModalFlag(false);
	};

	const handleAddEditStudent = () => {
		if (firstName.trim() === '') {
			setAppMessage('Please provide first name');
		} else if (lastName.trim() === '') {
			setAppMessage('Please provide last name');
		} else if (age === '') {
			setAppMessage('Please provide age');
		} else if (parent.trim() === '') {
			setAppMessage('Please select a parent/guardian');
		} else if (programs.trim() === '') {
			setAppMessage('Please select a program');
		} else {
			let newStudent = {
				first_name: firstName,
				last_name: lastName,
				age: age,
				parent_id: parent,
				program_id: programs,
			};
			console.log(newStudent);
			if (targetStudentId === 'ADD') {
				axios
					.post('http://localhost:8000/api/students', newStudent)
					.then((res) => {
						if (res.data.success) {
							setShowModalFlag(false);
							clearStudentModal();
							axios
								.get('http://localhost:8000/api/students')
								.then((res) => {
									dispatch({
										type: 'FETCH_STUDENTS',
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
						`http://localhost:8000/api/students/${targetStudentId}`,
						newStudent
					)
					.then((res) => {
						if (res.data.success) {
							setShowModalFlag(false);
							clearStudentModal();
							axios
								.get('http://localhost:8000/api/students')
								.then((res) => {
									dispatch({
										type: 'FETCH_STUDENTS',
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
		if (fieldtype === 'firstname') {
			setFirstName(e.target.value);
		} else if (fieldtype === 'lastname') {
			setLastName(e.target.value);
		} else if (fieldtype === 'age') {
			setAge(e.target.value);
		} else if (fieldtype === 'parent') {
			setParent(e.target.value);
		} else if (fieldtype === 'programs') {
			setPrograms(e.target.value);
		}
	};

	return (
		<>
			<div className='container-fluid  mt-4'>
				<div className='table-responsive'>
					<MaterialTable
						title='Students'
						data={data}
						columns={[
							{
								title: 'First Name',
								field: 'first_name',
							},
							{
								title: 'Last Name',
								field: 'last_name',
							},
							{
								title: 'Age',
								field: 'age',
							},
							{
								title: 'Program',
								field: 'programinfo[0].name',
							},
							{
								title: 'Parent',
								field: 'parentinfo[0].parent_name',
							},
						]}
						actions={[
							{
								icon: 'add',
								tooltip: 'Add Student',
								isFreeAction: true,
								onClick: (event) => handleShowModal('ADD'),
							},
							{
								icon: 'refresh',
								tooltip: 'Refresh Data',
								isFreeAction: true,
								onClick: () => handleStudentTableRefresh(),
							},
							{
								icon: 'edit',
								tooltip: 'Edit Student',
								onClick: (event, rowData) => {
									handleShowModal(rowData._id);
									LoadStudentData(rowData);
								},
							},
							{
								icon: 'delete',
								tooltip: 'Delete Student',
								onClick: (event, rowData) => {
									let parentId = rowData._id;
									handleStudentDelete(parentId);
								},
							},
						]}
						options={{
							search: true,
							paging: true,
							filtering: true,
							exportButton: true,
							pageSize: 10,
							maxBodyHeight: '90vh',
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
						{targetStudentId === 'ADD'
							? 'New Student'
							: 'Edit Student'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p id='appmessage'>{appMessage}</p>
					<Form.Group className='mb-3'>
						<Form.Label>First Name*</Form.Label>
						<Form.Control
							type='text'
							value={firstName}
							onChange={(e) =>
								handleOnInputChange(e, 'firstname')
							}
						/>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Last Name*</Form.Label>
						<Form.Control
							type='text'
							value={lastName}
							onChange={(e) => handleOnInputChange(e, 'lastname')}
						/>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Age*</Form.Label>
						<Form.Control
							type='number'
							value={age}
							onChange={(e) => handleOnInputChange(e, 'age')}
						/>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Parent*</Form.Label>
						<Form.Select
							value={parent}
							onChange={(e) => handleOnInputChange(e, 'parent')}
						>
							<option value=''></option>
							{parentList.map((p) => {
								return (
									<option value={p._id}>
										{p.first_name} {p.last_name}
									</option>
								);
							})}
						</Form.Select>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label>Programs*</Form.Label>
						<Form.Select
							value={programs}
							onChange={(e) => handleOnInputChange(e, 'programs')}
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
				</Modal.Body>
				<Modal.Footer className='py-3'>
					<Button
						className='myButton'
						onClick={() => handleAddEditStudent()}
					>
						<i className='fa fa-save' /> Save
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default Students;
