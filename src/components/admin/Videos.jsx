import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
const Videos = (props) => {
	const data = useSelector((state) => state.videos);
	const programList = useSelector((state) => state.programs);
	const dispatch = useDispatch();
	const [showModalFlag, setShowModalFlag] = useState(false);
	const [appMessage, setAppMessage] = useState('');
	const [targetVideoId, setTargetVideoId] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [lessonDate, setLessonDate] = useState('');
	const [image, setImage] = useState('');
	const [video, setVideo] = useState('');
	const [isActive, setIsActive] = useState('true');
	const [program, setProgram] = useState('');

	useEffect(() => {
		axios.get('https://safe-beyond-96213.herokuapp.com/api/videos').then((res) => {
			dispatch({ type: 'FETCH_VIDEOS', payload: res.data });
		});

		axios.get('https://safe-beyond-96213.herokuapp.com/api/programs').then((res) => {
			dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
		});
	}, []);

	const clearVideoModal = () => {
		setTitle('');
		setDescription('');
		setLessonDate('');
		setImage('');
		setVideo('');
		setProgram('');
		setIsActive('true');
		setAppMessage('');
	};

	const handleVideoDelete = (id) => {
		axios.delete(`https://safe-beyond-96213.herokuapp.com/api/videos/${id}`).then((res) => {
			if (res.data.deletedCount === 1) {
				axios.get('https://safe-beyond-96213.herokuapp.com/api/videos').then((res) => {
					dispatch({ type: 'FETCH_VIDEOS', payload: res.data });
				});
			} else {
				console.log('Unable to delete video.' + res.data);
			}
		});
	};

	const handleVideoTableRefresh = () => {
		axios.get('https://safe-beyond-96213.herokuapp.com/api/videos').then((res) => {
			dispatch({ type: 'FETCH_VIDEOS', payload: res.data });
		});
	};

	const handleShowModal = (targetVideoId) => {
		setShowModalFlag(true);
		setTargetVideoId(targetVideoId);
	};

	const LoadVideoData = (data) => {
		setTitle(data.title);
		setDescription(data.description);
		setLessonDate(data.lesson_date);
		setImage(data.thumbnail_path);
		setVideo(data.video_path);
		setProgram(data.program_id);
		setIsActive(data.active_flag);
		setAppMessage('');
	};

	const handleModalHidden = () => {
		setShowModalFlag(false);
	};

	const handleAddEditVideo = () => {
		if (title.trim() === '') {
			setAppMessage('Please provide video title');
		} else if (lessonDate.trim() === '') {
			setAppMessage('Please provide lesson date');
		} else if (image.trim() === '') {
			setAppMessage('Please provide image path');
		} else if (video.trim() === '') {
			setAppMessage('Please provide video path');
		} else if (program.trim() === '') {
			setAppMessage('Please select a program');
		} else {
			let newVideo = {
				title: title,
				description: description,
				program_id: program,
				lesson_date: lessonDate,
				thumbnail_path: image,
				video_path: video,
				active_flag: isActive,
			};
			if (targetVideoId === 'ADD') {
				axios.post('https://safe-beyond-96213.herokuapp.com/api/videos', newVideo).then((res) => {
					if (res.data.success) {
						setShowModalFlag(false);
						clearVideoModal();
						axios.get('https://safe-beyond-96213.herokuapp.com/api/videos').then((res) => {
							dispatch({
								type: 'FETCH_VIDEOS',
								payload: res.data,
							});
						});
					} else {
						setAppMessage(res.data.message);
					}
				});
			} else {
				axios.put(`https://safe-beyond-96213.herokuapp.com/api/videos/${targetVideoId}`, newVideo).then((res) => {
					if (res.data.success) {
						setShowModalFlag(false);
						clearVideoModal();
						axios.get('https://safe-beyond-96213.herokuapp.com/api/videos').then((res) => {
							dispatch({
								type: 'FETCH_VIDEOS',
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
		if (fieldtype === 'title') {
			setTitle(e.target.value);
		} else if (fieldtype === 'description') {
			setDescription(e.target.value);
		} else if (fieldtype === 'program') {
			setProgram(e.target.value);
		} else if (fieldtype === 'lessondate') {
			setLessonDate(e.target.value);
		} else if (fieldtype === 'image') {
			setImage(e.target.value);
		} else if (fieldtype === 'video') {
			setVideo(e.target.value);
		} else if (fieldtype === 'activeflag') {
			setIsActive(e.target.value);
		}
	};

	return (
		<>
			<div className='container-fluid  mt-4'>
				<div className='table-responsive'>
					<MaterialTable
						title='Videos'
						data={data}
						columns={[
							{
								title: 'Title',
								field: 'title',
							},
							{
								title: 'Description',
								field: 'description',
							},
							{
								title: 'Program',
								field: 'programinfo[0].name',
							},
							{
								title: 'Lesson Date',
								field: 'lesson_date',
							},
							{
								title: 'Image',
								field: 'thumbnail_path',
							},
							{
								title: 'Video',
								field: 'video_path',
							},
							{
								title: 'Active Flag',
								field: 'active_flag',
							},
						]}
						actions={[
							{
								icon: 'add',
								tooltip: 'Add Video',
								isFreeAction: true,
								onClick: (event) => handleShowModal('ADD'),
							},
							{
								icon: 'refresh',
								tooltip: 'Refresh Data',
								isFreeAction: true,
								onClick: () => handleVideoTableRefresh(),
							},
							{
								icon: 'edit',
								tooltip: 'Edit Video',
								onClick: (event, rowData) => {
									handleShowModal(rowData._id);
									LoadVideoData(rowData);
								},
							},
							{
								icon: 'delete',
								tooltip: 'Delete Video',
								onClick: (event, rowData) => {
									let videoId = rowData._id;
									handleVideoDelete(videoId);
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
					<Modal.Title>{targetVideoId === 'ADD' ? 'New Video' : 'Edit Video'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p id='appmessage'>{appMessage}</p>
					<Form.Group className='mb-3'>
						<Form.Label>Title*</Form.Label>
						<Form.Control type='text' value={title} onChange={(e) => handleOnInputChange(e, 'title')} />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Description</Form.Label>
						<Form.Control type='text' value={description} onChange={(e) => handleOnInputChange(e, 'description')} />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Program*</Form.Label>
						<Form.Select value={program} onChange={(e) => handleOnInputChange(e, 'program')}>
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
					<Form.Group className='mb-3'>
						<Form.Label>Lesson Date*</Form.Label>
						<Form.Control type='date' value={lessonDate} onChange={(e) => handleOnInputChange(e, 'lessondate')} />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Image Path</Form.Label>
						<Form.Control type='text' value={image} onChange={(e) => handleOnInputChange(e, 'image')} />
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Video Path</Form.Label>
						<Form.Control type='text' value={video} onChange={(e) => handleOnInputChange(e, 'video')} />
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
					<Button className='myButton' onClick={() => handleAddEditVideo()}>
						<i className='fa fa-save' /> Save
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default Videos;
