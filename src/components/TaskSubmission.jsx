import { formatDateString } from '../helper/functions';
import firebaseApp from './admin/firebase';
import { getStorage, ref, deleteObject, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const TaskSubmission = ({ fileName, dateSubmitted, filePath, submissionId, reference }) => {
	const childSelected = useSelector((state) => state.childSelected);
	const studentSubmissions = useSelector((state) => state.submissions);
	const dispatch = useDispatch();

	const handleDeleteSubmission = (file, submissionId) => {
		const storage = getStorage();
		const fileRef = ref(storage, file);

		deleteObject(fileRef)
			.then(() => {
				axios.delete(`http://localhost:8000/api/students/delete-submission/${childSelected}/${submissionId}`).then((res) => {
					let updatedSubmissions = studentSubmissions.filter((submission) => submission._id !== submissionId);
					dispatch({ type: 'FETCH_SUBMISSIONS', payload: updatedSubmissions });
				});
			})
			.catch((error) => {
				// Uh-oh, an error occurred!
				console.log(error);
			});
	};

	const handleFileDownload = (reference) => {
		const storage = getStorage();
		getDownloadURL(ref(storage, reference))
			.then((url) => {
				// `url` is the download URL for 'images/stars.jpg'

				// This can be downloaded directly:
				const xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.onload = (event) => {
					const blob = xhr.response;
				};
				xhr.open('GET', url);
				xhr.send();
			})
			.catch((error) => {
				// Handle any errors
			});
	};

	return (
		<>
			<div className='submission-uploaded-fileitem d-flex flex-nowrap flex-row justify-content-between'>
				<div className='submission-file-details'>
					<div className='submission-file-name' onClick={() => handleFileDownload(reference)}>
						{fileName}
					</div>
					<div className='submission-file-date'>{formatDateString(dateSubmitted)}</div>
				</div>
				<span className='submission-file-delete-button' onClick={() => handleDeleteSubmission(filePath, submissionId)}>
					&#10006;
				</span>
			</div>
		</>
	);
};
export default TaskSubmission;
