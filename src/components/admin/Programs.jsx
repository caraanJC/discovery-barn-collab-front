import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
const Programs = (props) => {
	const data = useSelector((state) => state.programs);
	const dispatch = useDispatch();
	const [showModalFlag, setShowModalFlag] = useState(false);
	const [appMessage, setAppMessage] = useState('');
	const [targetProgramId, setTargetProgramId] = useState('');
	const [programName, setProgramName] = useState('');
	const [isActive, setIsActive] = useState('true');

	useEffect(() => {
		axios.get('https://safe-beyond-96213.herokuapp.com/api/programs').then((res) => {
			dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
		});
	}, []);

	const clearProgramModal = () => {
		setProgramName('');
		setIsActive('true');
		setAppMessage('');
	};

	const handleProgramDelete = (id) => {
		axios.delete(`https://safe-beyond-96213.herokuapp.com/api/programs/${id}`).then((res) => {
			if (res.data.deletedCount === 1) {
				axios.get('https://safe-beyond-96213.herokuapp.com/api/programs').then((res) => {
					dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
				});
			} else {
				console.log('Unable to delete program.' + res.data);
			}
		});
	};

	const handleProgramTableRefresh = () => {
		axios.get('https://safe-beyond-96213.herokuapp.com/api/programs').then((res) => {
			dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
		});
	};

	const handleShowModal = (targetProgramId) => {
		setShowModalFlag(true);
		setTargetProgramId(targetProgramId);
	};

	const LoadProgramData = (data) => {
		setProgramName(data.name);
		setIsActive(data.active_flag);
		setAppMessage('');
	};

	const handleModalHidden = () => {
		setShowModalFlag(false);
	};

	const handleAddEditProgram = () => {
		if (programName.trim() === '') {
			setAppMessage('Please provide program name');
		} else {
			let newProgram = {
				name: programName,
				active_flag: isActive === 'true' ? true : false,
			};
			if (targetProgramId === 'ADD') {
				axios.post('https://safe-beyond-96213.herokuapp.com/api/programs', newProgram).then((res) => {
					if (res.data.success) {
						setShowModalFlag(false);
						clearProgramModal();
						axios.get('https://safe-beyond-96213.herokuapp.com/api/programs').then((res) => {
							dispatch({
								type: 'FETCH_PROGRAMS',
								payload: res.data,
							});
						});
					} else {
						setAppMessage(res.data.message);
					}
				});
			} else {
				axios.put(`https://safe-beyond-96213.herokuapp.com/api/programs/${targetProgramId}`, newProgram).then((res) => {
					if (res.data.success) {
						setShowModalFlag(false);
						clearProgramModal();
						axios.get('https://safe-beyond-96213.herokuapp.com/api/programs').then((res) => {
							dispatch({
								type: 'FETCH_PROGRAMS',
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
		if (fieldtype === 'programname') {
			setProgramName(e.target.value);
		} else if (fieldtype === 'activeflag') {
			setIsActive(e.target.value);
		}
	};

	return (
		<>
			<div className='container-fluid  mt-4'>
				<div className='table-responsive'>
					<MaterialTable
						title='Programs'
						data={data}
						columns={[
							{
								title: 'Program Name',
								field: 'name',
							},
							{
								title: 'Active Flag',
								field: 'active_flag',
							},
						]}
						actions={[
							{
								icon: 'add',
								tooltip: 'Add Program',
								isFreeAction: true,
								onClick: (event) => handleShowModal('ADD'),
							},
							{
								icon: 'refresh',
								tooltip: 'Refresh Data',
								isFreeAction: true,
								onClick: () => handleProgramTableRefresh(),
							},
							{
								icon: 'edit',
								tooltip: 'Edit Program',
								onClick: (event, rowData) => {
									handleShowModal(rowData._id);
									LoadProgramData(rowData);
								},
							},
							{
								icon: 'delete',
								tooltip: 'Delete Program',
								onClick: (event, rowData) => {
									let userId = rowData._id;
									handleProgramDelete(userId);
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

			<Modal show={showModalFlag} onHide={() => handleModalHidden()} keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>{targetProgramId === 'ADD' ? 'New Program' : 'Edit Program'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p id='appmessage'>{appMessage}</p>
					<Form.Group className='mb-3'>
						<Form.Label>Program Name*</Form.Label>
						<Form.Control type='text' value={programName} onChange={(e) => handleOnInputChange(e, 'programname')} />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Active Flag*</Form.Label>
						<Form.Select value={isActive} onChange={(e) => handleOnInputChange(e, 'activeflag')}>
							<option value='true'>True</option>
							<option value='false'>False</option>
						</Form.Select>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer className='py-3'>
					<Button className='myButton' onClick={() => handleAddEditProgram()}>
						<i className='fa fa-save' /> Save
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default Programs;
