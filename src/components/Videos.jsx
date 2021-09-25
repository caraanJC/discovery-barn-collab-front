import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Videos = (props) => {
	const videos = useSelector((state) => state.videos);
	const parentChildren = useSelector((state) => state.parentChildren);
	const programVideos = useSelector((state) => state.programVideos);
	const dispatch = useDispatch();
	const [programId, setProgramId] = useState('');
	const [program, setProgram] = useState('');

	const handleOnChange = (e) => {
		setProgramId(e.target.value);
	};

	useEffect(() => {
		if (programId !== '') {
			axios
				.get(`http://localhost:8000/api/programs/${programId}`)
				.then((res) => {
					setProgram(res.data.name);
				});
			axios
				.get(`http://localhost:8000/api/videos/${programId}`)
				.then((res) => {
					dispatch({
						type: 'FETCH_PROGRAM_VIDEOS',
						payload: res.data,
					});
				});
		} else {
			dispatch({
				type: 'FETCH_PROGRAM_VIDEOS',
				payload: [],
			});
			setProgram('');
			setProgramId('');
		}
	}, [programId]);

	return (
		<div className='container-fluid mt-4'>
			<div className='table-responsive'>
				<div className='d-flex align-items-bottom justify-content-between'>
					<h2>Videos</h2>

					<select
						className='form-select form-select-md mb-3 '
						aria-label='.form-select-md'
						id='childselection'
						onChange={(e) => handleOnChange(e)}
					>
						<option value=''>Select A Student</option>
						{parentChildren.map((child) => {
							return (
								<option
									key={child._id}
									value={child.program_id}
								>
									{child.first_name} {child.last_name}
								</option>
							);
						})}
					</select>
				</div>

				<div className='row' id='programvideocontent'>
					<h4 className='mt-3 mb-2' id='programtitle'>
						{program}
					</h4>
					{programVideos.map((video) => {
						let lessondate = new Date(video.lesson_date);
						let dateformat = {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						};
						return (
							<div
								key={video._id}
								className='col-xl-3 col-lg-4 col-sm-6 mb-4'
							>
								<div className='dbp-thumbnail card'>
									<Link
										to={`/videos/${video._id}`}
										className='card-img-container'
									>
										<img
											className='card-img-top img-responsive'
											src={video.thumbnail_path}
											alt={video.title}
										/>
									</Link>
									<div className='card-body'>
										<h6 className='card-title'>
											<Link to={`/videos/${video._id}`}>
												{video.title}
											</Link>
										</h6>
										<h6 className='card-subtitle mb-3'>
											{lessondate.toLocaleDateString(
												'en-US',
												dateformat
											)}
										</h6>
										<p className='card-text'>
											{video.description}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
export default Videos;
