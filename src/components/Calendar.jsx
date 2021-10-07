import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router';

const Calendar = ({ childProgram, childSelected }) => {
	const [events, setEvents] = useState([]);
	const history = useHistory();
	const studentSubmissions = useSelector((state) => state.submissions);
	const dispatch = useDispatch();

	useEffect(() => {
		if (childProgram !== '') {
			axios.get(`http://localhost:8000/api/programs/program-tasks/${childProgram}`).then((res) => {
				let tasks = res.data.map((task) => {
					let title = task.title;
					let status = getChildTaskStatus(title);
					return {
						id: uuid(),
						title: title,
						start: task.deadline,
						end: task.deadline,
						color: status === 'COMPLETED' ? 'green' : 'red'
					};
				});
				setEvents(tasks);
			});
		} else {
			setEvents([]);
		}
	}, [childSelected, studentSubmissions, childProgram]);

	const handleOnEventClicked = (taskName) => {
		history.push(`/view-task/${taskName}`);
	};

	const getChildTaskStatus = (taskTitle) => {
		let status = 'PENDING';
		studentSubmissions.map((file) => {
			if (file.task_title === taskTitle) {
				status = 'COMPLETED';
			}
			return file;
		});
		return status;
	};

	return (
		<div className='App'>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				headerToolbar={{
					start: 'today',
					center: 'title',
					end: 'prev,next'
				}}
				events={events}
				eventClick={(e) => handleOnEventClicked(e.event.title)}
				dateClick={(e) => console.log(e.dateStr)}
				initialView='dayGridMonth'
			/>
		</div>
	);
};
export default Calendar;
