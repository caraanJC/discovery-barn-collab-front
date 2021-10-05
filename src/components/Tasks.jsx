import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toNormalTime } from '../helper';

import { Form } from 'react-bootstrap';

import { Button, Card, Modal } from 'react-bootstrap';

// import { storage } from './admin/firebase';
import { storage } from './base';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';

const Tasks = () => {
    const parentToken = useSelector((state) => state.parentToken);
    const students = useSelector((state) => state.students);

    const [showModal, setShowModal] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState({});
    const [selectedTask, setSelectedTask] = useState({});
    const [appMessage, setAppMessage] = useState('');
    const [fileToSubmit, setFileToSubmit] = useState('');
    const [backendFile, setBackendFile] = useState();

    const dispatch = useDispatch();

    const file_type_strings = {
        video: 'video/mp4,video/x-m4v,video/*',
        image: 'image/png, image/gif, image/jpeg',
        audio: 'audio/mpeg3',
    };

    const handleOnChange = async (e) => {
        if (!e.target.value) return;
        const currentStudent = students.find(
            (student) => student._id === e.target.value
        );

        setSelectedStudent(currentStudent);
    };

    const handleOpenModal = (task) => {
        setShowModal(true);
        setSelectedTask({
            ...task,
            file_type_string: file_type_strings[task.file_type],
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFileToSubmit('');
        setAppMessage('');
    };

    const handleSetFile = (e) => {
        setFileToSubmit(e.target.files[0]);
    };

    const getImageURL = (filename, taskID) => {
        getDownloadURL(ref(storage, filename))
            .then((url) => {
                setBackendFile({ taskID, url });
            })
            .catch((error) => {
                // Handle any errors
                console.log(error);
            });
    };

    const getTasks = async (student) => {
        let tasks;
        await axios
            .get(
                `http://localhost:8000/api/programs/${student.program_id}/getTasks`
            )
            .then((res) => {
                tasks = res.data;
            });
        return tasks;
    };

    const fileExists = async (taskID) => {
        let result;

        await axios
            .post(
                `http://localhost:8000/api/students/${selectedStudent._id}/submissions/file-exist`,
                { task_id: taskID }
            )
            .then((res) => (result = res.data));
        return result;
    };

    const handleSubmit = async (task) => {
        if (!fileToSubmit.name) return setAppMessage('Please provide the file');

        const existing = await fileExists(task._id);

        if (!existing) {
            //  submit file to firebase

            const location = `${
                selectedStudent.first_name
            }${selectedStudent.last_name.replace(
                / /g,
                ''
            )}/${task.title.replace(/ /g, '')}/${fileToSubmit.name}`;

            const imagesRef = ref(storage, location);
            await uploadBytes(imagesRef, fileToSubmit).then((snapshot) => {
                console.log('Uploaded a file');
            });

            getImageURL(`${location}`, task._id);
        } else {
            setAppMessage('Already Submitted');
        }
    };

    const getStatus = async (student) => {
        let tasks = student.task_list.map((task) => {
            const foundSubmission = student?.submissions.find(
                (submission) => submission.task_id === task._id
            )
                ? student?.submissions.find(
                      (submission) => submission.task_id === task._id
                  )
                : {};

            if (Object.keys(foundSubmission).length !== 0) {
                if (foundSubmission.date_submitted) {
                    if (
                        toNormalTime(foundSubmission.date_submitted) >
                        toNormalTime(task.deadline)
                    ) {
                        task.status = 'Late';
                    } else {
                        task.status = 'Submitted';
                    }
                }
            } else {
                task.status = 'Not Submitted';
            }
            return task;
        });

        return tasks;
    };

    const getAllStudents = async () => {
        await axios
            .get(
                `http://localhost:8000/api/parents/get-students/${parentToken}`
            )
            .then(async (res) => {
                res.data.map(async (student) => {
                    student.task_list = await getTasks(student);
                    student.task_list = await getStatus(student);

                    dispatch({
                        type: 'FETCH_STUDENT',
                        payload: student,
                    });
                    return student;
                });
            });
    };

    useEffect(() => {
        (async () => await getAllStudents())();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (backendFile) {
            const init = async () => {
                await axios.post(
                    `http://localhost:8000/api/students/${selectedStudent._id}/submissions/upload`,
                    {
                        link: backendFile.url,
                        task_id: backendFile.taskID,
                    }
                );
                handleCloseModal();
            };
            init();
        }
        // eslint-disable-next-line
    }, [backendFile]);

    return (
        <>
            <div className='container-fluid mt-4'>
                <div className='table-responsive'>
                    <div className='d-flex align-items-bottom justify-content-between'>
                        <h2>Tasks</h2>

                        <select
                            className='form-select form-select-md mb-3 '
                            aria-label='.form-select-md'
                            id='childselection'
                            onChange={handleOnChange}
                        >
                            <option value=''>Select A Student</option>
                            {students?.map((student) => {
                                return (
                                    <option
                                        key={student._id}
                                        value={student._id}
                                    >
                                        {student.first_name} {student.last_name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className='d-flex align-items-center justify-content-start'>
                        {Object.keys(selectedStudent).length > 0 &&
                            selectedStudent?.task_list.map((task) => (
                                <div xs={4} key={task?._id}>
                                    <Card
                                        className='text-center m-4 '
                                        style={{
                                            height: '300px',
                                            width: '250px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        <Card.Header>
                                            {task?.file_type}
                                        </Card.Header>
                                        <Card.Body className='d-flex flex-wrap flex-row align-items-center justify-content-center'>
                                            <Card.Title>
                                                {task?.title}
                                            </Card.Title>
                                            <Card.Text>
                                                Description: {task?.description}
                                            </Card.Text>
                                            <Card.Text>
                                                Status: {task?.status}
                                            </Card.Text>
                                            {task?.status ===
                                                'Not Submitted' && (
                                                <Button
                                                    className='myButton align-self-end mt-2'
                                                    onClick={() =>
                                                        handleOpenModal(task)
                                                    }
                                                >
                                                    Submit Work
                                                </Button>
                                            )}
                                        </Card.Body>
                                        <Card.Footer className='text-muted'>
                                            Deadline:{' '}
                                            {task?.deadline &&
                                                toNormalTime(task?.deadline)}
                                        </Card.Footer>
                                    </Card>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size='lg'
                aria-labelledby='contained-modal-title-vcenter'
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id='contained-modal-title-vcenter'>
                        Submit Work for {selectedTask.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id='appmessage'>{appMessage}</p>
                    <h4>File Submission</h4>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            File Type: {selectedTask.file_type}
                        </Form.Label>
                        <Form.Control
                            onChange={handleSetFile}
                            type='file'
                            accept={selectedTask.file_type_string}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleSubmit(selectedTask)}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Tasks;
