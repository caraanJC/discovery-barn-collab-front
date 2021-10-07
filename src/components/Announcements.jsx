import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { formatDateString } from '../helper/functions';
const Announcements = () => {
	const announcements = useSelector((state) => state.announcements);
	const dispatch = useDispatch();
	const [title, setTitle] = useState('');
	const [subtitle, setSubtitle] = useState('');
	const [details, setDetails] = useState('');
	const [aDate, setADate] = useState('');
	const [showModalFlag, setShowModalFlag] = useState(false);

	useEffect(() => {
		axios.get(`http://localhost:8000/api/announcements/`).then((res) => {
			dispatch({ type: 'FETCH_ANNOUNCEMENTS', payload: res.data });
		});
		//eslint-disable-next-line
	}, []);

	const handleViewAnnouncement = (id) => {
		announcements.map((a) => {
			if (a._id === id) {
				setTitle(a.title);
				setSubtitle(a.subtitle);
				setDetails(a.details);
				setADate(formatDateString(a.date));
			}
			return a;
		});
		setShowModalFlag(true);
	};

	const handleModalHidden = () => {
		setShowModalFlag(false);
		setTitle('');
		setSubtitle('');
		setDetails('');
		setADate('');
	};

	return (
		<>
			<div className='announcement-section'>
				<div className='announcement-section-title'>Announcements</div>

				<ul className='announcement-section-item'>
					{announcements.length < 1 && (
						<li>
							<p className='mt-3 text-center'>
								<i>No Announcements</i>
							</p>
						</li>
					)}
					{announcements.map((a) => {
						return (
							<li>
								<p className='announcement-item-title'>{a.title}</p>
								<p className='announcement-item-date'>{formatDateString(a.date)}</p>
								<p className='announcement-item-details'>{a.subtitle}</p>
								<button className='myButton btn btn-success' onClick={() => handleViewAnnouncement(a._id)}>
									Read More
								</button>
							</li>
						);
					})}
				</ul>
			</div>

			<Modal show={showModalFlag} onHide={() => handleModalHidden()} dialogClassName='modal-90w' keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>View Announcement</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='view-announcement-section'>
						<p className='view-announcement-title'>{title}</p>
						<p className='view-announcement-date'>{aDate}</p>
						<p className='view-announcement-details'>{details}</p>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};
export default Announcements;
