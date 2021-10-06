import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
import { formatDate, renderActiveTags } from '../../helper/functions';
const Announcements = (props) => {
	const data = useSelector((state) => state.announcements);
	const dispatch = useDispatch();
	const [showModalFlag, setShowModalFlag] = useState(false);
	const [appMessage, setAppMessage] = useState('');
	const [targetId, setTargetId] = useState('');
	const [title, setTitle] = useState('');
	const [subtitle, setSubtitle] = useState('');
	const [details, setDetails] = useState('');
	const [date, setDate] = useState('');

	const fetchData = () => {
		axios.get('http://localhost:8000/api/announcements').then((res) => {
			let temp = res.data.map((data) => {
				data.date = formatDate(data.date);
				return data;
			});
			dispatch({ type: 'FETCH_ANNOUNCEMENTS', payload: temp });
		});
	};

	useEffect(() => {
		fetchData();
	}, []);

	const clearAddEditModal = () => {
		setTitle('');
		setSubtitle('');
		setDetails('');
		setDate('');
	};

	const handleTableRefresh = () => {
		fetchData();
	};

	const handleTableDelete = (id) => {
		axios.delete(`http://localhost:8000/api/announcements/${id}`).then((res) => {
			if (res.data.deletedCount === 1) {
				fetchData();
			} else {
				console.log('Unable to delete announcement.' + res.data);
			}
		});
	};

	const handleShowModal = (targetId) => {
		setShowModalFlag(true);
		setTargetId(targetId);
	};

	const handleHideModal = () => {
		setShowModalFlag(false);
	};

	const loadData = (data) => {
		setTitle(data.title);
		setSubtitle(data.subtitle);
		setDetails(data.details);
		setDate(formatDate(data.date));
	};

	const handleOnInputChange = (e, fieldtype) => {
		if (fieldtype === 'title') {
			setTitle(e.target.value);
		} else if (fieldtype === 'subtitle') {
			setSubtitle(e.target.value);
		} else if (fieldtype === 'details') {
			setDetails(e.target.value);
		} else if (fieldtype === 'date') {
			setDate(e.target.value);
		}
	};

	const handleAddEditTableRow = () => {
		if (title.trim() === '') {
			setAppMessage('Please provide a title');
		} else if (subtitle.trim() === '') {
			setAppMessage('Please provide a subtitle');
		} else if (details.trim() === '') {
			setAppMessage('Please provide details');
		} else if (date.trim() === '') {
			setAppMessage('Please provide date');
		} else {
			let rowData = {
				title: title,
				subtitle: subtitle,
				details: details,
				date: date
			};
			if (targetId === 'ADD') {
				axios.post('http://localhost:8000/api/announcements', rowData).then((res) => {
					if (res.data.success) {
						setShowModalFlag(false);
						clearAddEditModal();
						fetchData();
					} else {
						setAppMessage(res.data.message);
					}
				});
			} else {
				axios.put(`http://localhost:8000/api/announcements/${targetId}`, rowData).then((res) => {
					if (res.data.success) {
						setShowModalFlag(false);
						clearAddEditModal();
						fetchData();
					} else {
						setAppMessage(res.data.message);
					}
				});
			}
		}
	};

	return (
		<>
			<div className='container-fluid  mt-4'>
				<div className='table-responsive'>
					<MaterialTable
						title='Announcements'
						data={data}
						columns={[
							{
								title: 'Title',
								field: 'title'
							},
							{
								title: 'Subtitle',
								field: 'subtitle'
							},
							{
								title: 'Details',
								field: 'details'
							},
							{
								title: 'Date',
								field: 'date'
							}
						]}
						actions={[
							{
								icon: 'add',
								tooltip: 'Add Announcement',
								isFreeAction: true,
								onClick: (event) => handleShowModal('ADD')
							},
							{
								icon: 'refresh',
								tooltip: 'Refresh Data',
								isFreeAction: true,
								onClick: () => handleTableRefresh()
							},
							{
								icon: 'edit',
								tooltip: 'Edit',
								onClick: (event, rowData) => {
									handleShowModal(rowData._id);
									loadData(rowData);
								}
							},
							{
								icon: 'delete',
								tooltip: 'Delete',
								onClick: (event, rowData) => {
									let rowId = rowData._id;
									handleTableDelete(rowId);
								}
							}
						]}
						options={{
							search: true,
							paging: true,
							filtering: true,
							exportButton: true,
							pageSize: 10,
							maxBodyHeight: '90vh'
						}}
					/>
				</div>
			</div>

			<Modal show={showModalFlag} onHide={() => handleHideModal()} keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>{targetId === 'ADD' ? 'New Announcement' : 'Edit Announcement'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p id='appmessage'>{appMessage}</p>
					<Form.Group className='mb-3'>
						<Form.Label>Title*</Form.Label>
						<Form.Control type='text' value={title} onChange={(e) => handleOnInputChange(e, 'title')} />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Subtitle*</Form.Label>
						<Form.Control type='text' value={subtitle} onChange={(e) => handleOnInputChange(e, 'subtitle')} />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Details*</Form.Label>
						<Form.Control as='textarea' rows={10} value={details} onChange={(e) => handleOnInputChange(e, 'details')} />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Date*</Form.Label>
						<Form.Control type='date' value={date} onChange={(e) => handleOnInputChange(e, 'date')} />
					</Form.Group>
				</Modal.Body>
				<Modal.Footer className='py-3'>
					<Button className='myButton' onClick={() => handleAddEditTableRow()}>
						<i className='fa fa-save' /> Save
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Announcements;
