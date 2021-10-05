import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router';

const Calendar = (props) => {
	const { childProgram, childSelected } = props;
	const [events, setEvents] = useState([]);
	const history = useHistory();

	useEffect(() => {
		if (childProgram !== '') {
			axios.get(`http://localhost:8000/api/programs/program-tasks/${childProgram}`).then((res) => {
				let tasks = res.data.map((task) => {
					let title = task.title;
					return {
						id: uuid(),
						title: title,
						start: task.deadline,
						end: task.deadline,
						color: 'green'
					};
				});
				setEvents(tasks);
			});
		} else {
			setEvents([]);
		}
	}, [childProgram]);

	const handleOnEventClicked = (taskName) => {
		history.push(`/view-task/${taskName}`);
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
