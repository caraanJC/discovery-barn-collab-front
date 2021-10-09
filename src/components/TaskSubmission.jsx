import { formatDateString } from '../helper/functions';
import firebaseApp from './admin/firebase';
import { getStorage, ref, deleteObject, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const TaskSubmission = ({ fileName, dateSubmitted, filePath, submissionId, reference }) => {
	const childSelected = useSelector((state) => state.childSelected);
	const studentSubmissions = useSelector((state) => state.submissions);
	const dispatch = useDispatch();

	const handleDeleteSubmission = (e, file, submissionId) => {
		const deletingMsg = e.target.closest('.submission-uploaded-fileitem').querySelector('.deletingMsg');
		const deleteButton = e.target.closest('.submission-uploaded-fileitem').querySelector('.submission-file-delete-button');
		deletingMsg.classList.remove('hidden');
		deleteButton.classList.add('hidden');

		const storage = getStorage();
		const fileRef = ref(storage, file);

		deleteObject(fileRef)
			.then(() => {
				axios.delete(`http://localhost:8000/api/students/delete-submission/${childSelected}/${submissionId}`).then((res) => {
					let updatedSubmissions = studentSubmissions.filter((submission) => submission._id !== submissionId);
					dispatch({ type: 'FETCH_SUBMISSIONS', payload: updatedSubmissions });

					deletingMsg.classList.add('hidden');
					deleteButton.classList.remove('hidden');
				});
			})
			.catch((error) => {
				console.log(error);
				deletingMsg.classList.add('hidden');
				deleteButton.classList.remove('hidden');
			});
	};

	const handleFileDownload = (e, reference) => {
		const downloadingMsg = e.target.closest('.submission-uploaded-fileitem').querySelector('.downloadingMsg');
		const deleteButton = e.target.closest('.submission-uploaded-fileitem').querySelector('.submission-file-delete-button');
		downloadingMsg.classList.remove('hidden');
		deleteButton.classList.add('hidden');
		const storage = getStorage();
		getDownloadURL(ref(storage, reference))
			.then((url) => {
				const xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.onload = (e) => {
					const blob = xhr.response;
					const contentDispo = e.currentTarget.getResponseHeader('Content-Disposition');
					const fileName = contentDispo.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].split("''")[1];
					const link = document.createElement('a');
					link.href = URL.createObjectURL(blob);
					link.download = fileName;
					link.click();
					downloadingMsg.classList.add('hidden');
					deleteButton.classList.remove('hidden');
				};
				xhr.open('GET', url);
				xhr.send();
			})
			.catch((error) => {
				switch (error.code) {
					case 'storage/object-not-found':
						console.log('storage/object-not-found');
						break;

					case 'storage/unauthorized':
						console.log('storage/unauthorized');
						break;

					case 'storage/canceled':
						console.log('storage/canceled');
						break;

					case 'storage/unknown':
						console.log('storage/unknown');
						break;
					default:
						downloadingMsg.classList.add('hidden');
						deleteButton.classList.remove('hidden');
						break;
				}
			});
	};

	return (
		<>
			<div className='submission-uploaded-fileitem d-flex flex-nowrap flex-row justify-content-between'>
				<div className='submission-file-details' title='Click to Download' onClick={(e) => handleFileDownload(e, reference)}>
					<div className='submission-file-name'>{fileName}</div>
					<div className='submission-file-date'>{formatDateString(dateSubmitted)}</div>
				</div>
				<span className='hidden downloadingMsg'>
					<span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Downloading...
				</span>
				<span className='hidden deletingMsg'>
					<span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Deleting...
				</span>
				<span className='submission-file-delete-button' onClick={(e) => handleDeleteSubmission(e, filePath, submissionId)}>
					&#10006;
				</span>
			</div>
		</>
	);
};
export default TaskSubmission;
