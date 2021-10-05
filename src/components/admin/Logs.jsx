import MaterialTable from 'material-table';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
const Logs = (props) => {
	const data = useSelector((state) => state.systemLog);
	const dispatch = useDispatch();

	const columns = [
		{
			title: 'Module',
			field: 'module'
		},
		{
			title: 'Details',
			field: 'details'
		},
		{
			title: 'Timestamp',
			field: 'created_date'
		},
		{
			title: 'User',
			field: 'user'
		}
	];

	useEffect(() => {
		axios.get('http://localhost:8000/api/logs').then((res) => {
			dispatch({ type: 'FETCH_LOGS', payload: res.data });
		});
	}, []);

	const handleLogTableRefresh = () => {
		axios.get('http://localhost:8000/api/logs').then((res) => {
			dispatch({ type: 'FETCH_LOGS', payload: res.data });
		});
	};

	return (
		<div className='container-fluid  mt-4'>
			<div className='table-responsive'>
				<MaterialTable
					title='System Log'
					data={data}
					columns={columns}
					actions={[
						{
							icon: 'refresh',
							tooltip: 'Refresh Data',
							isFreeAction: true,
							onClick: () => handleLogTableRefresh()
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
	);
};
export default Logs;
