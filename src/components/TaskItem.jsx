import { useParams } from 'react-router-dom';
const TaskItem = (props) => {
	const { taskTitle } = useParams();
	return (
		<>
			<div className='container-fluid mt-4'>
				<div className='table-responsive'>
					<div className='d-flex align-items-bottom justify-content-between'>
						<h2>{taskTitle}</h2>
					</div>
					<hr />
				</div>
			</div>
		</>
	);
};

export default TaskItem;
