import Calendar from './Calendar';
import Announcements from './Announcements';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const Dashboard = () => {
	const parentChildren = useSelector((state) => state.parentChildren);
	const dispatch = useDispatch();
	const childSelected = useSelector((state) => state.childSelected);
	const childProgramSelected = useSelector((state) => state.childProgramSelected);

	useEffect(() => {
		axios.get(`http://localhost:8000/api/students/${childSelected}/submissions/getSubmissions`).then((res) => {
			dispatch({
				type: 'FETCH_SUBMISSIONS',
				payload: res.data
			});
		});
	}, [childSelected, dispatch]);

	const handleOnChange = (e) => {
		let child = e.target.value;
		let childprogram = e.target.childNodes[e.target.selectedIndex].getAttribute('data-program-id');
		dispatch({ type: 'SET_CHILD_PROGRAM_SELECTED', payload: childprogram });
		dispatch({ type: 'SET_CHILD_SELECTED', payload: child });
	};

	return (
		<>
			<div className='container-fluid mt-4'>
				<div className='d-flex align-items-bottom justify-content-between'>
					<h2>Dashboard</h2>
					<select className='form-select form-select-md mb-3 ' aria-label='.form-select-md' id='childselection' onChange={(e) => handleOnChange(e)} value={childSelected}>
						<option value='' data-program-id=''>
							Select A Student
						</option>
						{parentChildren.map((child) => {
							return (
								<option key={child._id} value={child._id} data-program-id={child.program_id}>
									{child.first_name} {child.last_name}
								</option>
							);
						})}
					</select>
				</div>
				<hr />
				<div className='row'>
					<div className='col-xl-9 col-lg-8 col-md-7 col-sm-12 mb-3'>
						<Calendar childProgram={childProgramSelected} childSelected={childSelected} />
					</div>
					<div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
						<Announcements key={uuidv4()} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
