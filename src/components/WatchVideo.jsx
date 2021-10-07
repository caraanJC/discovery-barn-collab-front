import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WatchVideo = (props) => {
	const { id } = useParams();
	const [title, setTitle] = useState('');
	const [lessondate, setLessonDate] = useState('');
	const [description, setDescription] = useState('');
	const [video, setVideo] = useState('');

	useEffect(() => {
		axios.get(`http://localhost:8000/api/videos/info/${id}`).then((res) => {
			let lessondate = new Date(res.data.lesson_date);
			let dateformat = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			setTitle(res.data.title);
			setLessonDate(lessondate.toLocaleDateString('en-US', dateformat));
			setDescription(res.data.description);
			setVideo(res.data.video_path);
		});
	}, []);

	const handleGoBack = () => {
		props.history.goBack();
	};
	return (
		<>
			<div className='container-fluid mt-4'>
				<span className='goBackButton' onClick={() => handleGoBack()}>
					&#10229; Go Back
				</span>
				<div className='vidsection my-4'>
					<div className='vidsource'>
						<iframe
							width='100%'
							height='500'
							src={video}
							title='YouTube video player'
							frameborder='0'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
							allowfullscreen></iframe>
					</div>
					<div className='vidtextcontent'>
						<div className='vidtitle'>{title}</div>
						<div className='vidsubtitle'>{lessondate}</div>
						<div className='viddescription'>{description}</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default WatchVideo;
