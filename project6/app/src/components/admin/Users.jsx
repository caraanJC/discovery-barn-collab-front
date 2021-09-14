import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
const Users = (props) => {
	const data = useSelector((state) => state.users);
	const dispatch = useDispatch();
	const [showModalFlag, setShowModalFlag] = useState(false);
	const [appMessage, setAppMessage] = useState('');
	const [targetUserId, setTargetUserId] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [isActive, setIsActive] = useState('true');
	const [isAdmin, setIsAdmin] = useState('true');

	useEffect(() => {
		axios.get('http://localhost:8000/api/users').then((res) => {
			dispatch({ type: 'FETCH_USERS', payload: res.data });
		});
	}, []);

	const clearUserModal = () => {
		setFirstName('');
		setLastName('');
		setEmail('');
		setIsAdmin('true');
		setIsActive('true');
		setAppMessage('');
	};

	const handleUserDelete = (id) => {
		axios.delete(`http://localhost:8000/api/users/${id}`).then((res) => {
			if (res.data.deletedCount === 1) {
				axios.get('http://localhost:8000/api/users').then((res) => {
					dispatch({ type: 'FETCH_USERS', payload: res.data });
				});
			} else {
				console.log('Unable to delete user.' + res.data);
			}
		});
	};

	const handleUserTableRefresh = () => {
		axios.get('http://localhost:8000/api/users').then((res) => {
			dispatch({ type: 'FETCH_USERS', payload: res.data });
		});
	};

	const handleShowModal = (targetUserId) => {
		setShowModalFlag(true);
		setTargetUserId(targetUserId);
	};

	const LoadUserData = (data) => {
		setFirstName(data.first_name);
		setLastName(data.last_name);
		setEmail(data.email_address);
		setIsAdmin(data.admin_flag);
		setIsActive(data.active_flag);
		setAppMessage('');
	};

	const handleModalHidden = () => {
		setShowModalFlag(false);
	};

	const handleAddEditUser = () => {
		if (firstName.trim() === '') {
			setAppMessage('Please provide first name');
		} else if (lastName.trim() === '') {
			setAppMessage('Please provide last name');
		} else if (email.trim() === '') {
			setAppMessage('Please provide email address');
		} else {
			let newUser = {
				first_name: firstName,
				last_name: lastName,
				email_address: email,
				password: '12345', //default password for newly created users
				active_flag: isActive === 'true' ? true : false,
				admin_flag: isAdmin === 'true' ? true : false,
			};
			if (targetUserId === 'ADD') {
				axios
					.post('http://localhost:8000/api/users', newUser)
					.then((res) => {
						if (res.data.success) {
							setShowModalFlag(false);
							clearUserModal();
							axios
								.get('http://localhost:8000/api/users')
								.then((res) => {
									dispatch({
										type: 'FETCH_USERS',
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
						`http://localhost:8000/api/users/${targetUserId}`,
						newUser
					)
					.then((res) => {
						if (res.data.success) {
							setShowModalFlag(false);
							clearUserModal();
							axios
								.get('http://localhost:8000/api/users')
								.then((res) => {
									dispatch({
										type: 'FETCH_USERS',
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
		} else if (fieldtype === 'email') {
			setEmail(e.target.value);
		} else if (fieldtype === 'activeflag') {
			setIsActive(e.target.value);
		} else if (fieldtype === 'adminflag') {
			setIsAdmin(e.target.value);
		}
	};

	return (
		<>
			<div className='container-fluid  mt-4'>
				<div className='table-responsive'>
					<MaterialTable
						title='Users'
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
								title: 'Email',
								field: 'email_address',
							},
							{
								title: 'Active Flag',
								field: 'active_flag',
							},
							{
								title: 'Admin Flag',
								field: 'admin_flag',
							},
						]}
						actions={[
							{
								icon: 'add',
								tooltip: 'Add User',
								isFreeAction: true,
								onClick: (event) => handleShowModal('ADD'),
							},
							{
								icon: 'refresh',
								tooltip: 'Refresh Data',
								isFreeAction: true,
								onClick: () => handleUserTableRefresh(),
							},
							{
								icon: 'edit',
								tooltip: 'Edit User',
								onClick: (event, rowData) => {
									handleShowModal(rowData._id);
									LoadUserData(rowData);
								},
							},
							{
								icon: 'delete',
								tooltip: 'Delete User',
								onClick: (event, rowData) => {
									let userId = rowData._id;
									handleUserDelete(userId);
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
						{targetUserId === 'ADD' ? 'New User' : 'Edit User'}
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
						<Form.Label>Email Address*</Form.Label>
						<Form.Control
							type='email'
							value={email}
							onChange={(e) => handleOnInputChange(e, 'email')}
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
							<option value='true'>True</option>
							<option value='false'>False</option>
						</Form.Select>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Admin Flag*</Form.Label>
						<Form.Select
							value={isAdmin}
							onChange={(e) =>
								handleOnInputChange(e, 'adminflag')
							}
						>
							<option value='true'>True</option>
							<option value='false'>False</option>
						</Form.Select>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer className='py-3'>
					<Button
						className='myButton'
						onClick={() => handleAddEditUser()}
					>
						<i className='fa fa-save' /> Save
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default Users;
