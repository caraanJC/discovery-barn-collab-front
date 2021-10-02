import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

import { getTimeToday, toNormalTime } from '../../Helper';

const Programs = (props) => {
    const data = useSelector((state) => state.programs);
    const dispatch = useDispatch();
    const [showModalFlag, setShowModalFlag] = useState(false);
    const [shoTaskModalFlag, setShowTaskModalFlag] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [taskListProgramName, setTaskListProgramName] = useState('');
    const [appMessage, setAppMessage] = useState('');
    const [targetProgramId, setTargetProgramId] = useState('');
    const [targetTaskId, setTargetTaskId] = useState('');
    const [programName, setProgramName] = useState('');
    const [taskItem, setTaskItem] = useState({
        title: '',
        description: '',
        deadline: getTimeToday(),
    });
    const [isActive, setIsActive] = useState('true');

    useEffect(() => {
        axios.get('http://localhost:8000/api/programs').then((res) => {
            dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
        });
        // eslint-disable-next-line
    }, []);

    const clearProgramModal = () => {
        setProgramName('');
        setIsActive('true');
        setAppMessage('');
    };

    const clearTaskModal = () => {
        setTaskItem({
            title: '',
            description: '',
            deadline: getTimeToday(),
        });
        setShowTaskModalFlag(false);
        setAppMessage('');
    };

    const handleProgramDelete = (id) => {
        axios.delete(`http://localhost:8000/api/programs/${id}`).then((res) => {
            if (res.data.deletedCount === 1) {
                axios.get('http://localhost:8000/api/programs').then((res) => {
                    dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
                });
            } else {
                console.log('Unable to delete program.' + res.data);
            }
        });
    };

    const handleTaskDelete = (taskID) => {
        axios
            .put(`http://localhost:8000/api/programs/${taskID}/deleteTask`, {
                name: taskListProgramName,
            })
            .then((res) => {
                if (res.data.success) {
                    axios
                        .get('http://localhost:8000/api/programs')
                        .then((res) => {
                            dispatch({
                                type: 'FETCH_PROGRAMS',
                                payload: res.data,
                            });
                            setTaskList(
                                res.data.find(
                                    (program) =>
                                        program.name === taskListProgramName
                                ).task_list
                            );
                        });
                } else {
                    console.log('Unable to delete program.' + res.data);
                }
            });
    };

    const handleProgramTableRefresh = () => {
        axios.get('http://localhost:8000/api/programs').then((res) => {
            dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
        });
    };

    const handleTaskTableRefresh = () => {
        axios.get('http://localhost:8000/api/programs').then((res) => {
            dispatch({ type: 'FETCH_PROGRAMS', payload: res.data });
            setTaskList(
                res.data.find((program) => program.name === taskListProgramName)
                    .task_list
            );
        });
    };

    const handleShowModal = (targetProgramId) => {
        setShowModalFlag(true);
        setTargetProgramId(targetProgramId);
    };

    const handleShowTaskModal = (id) => {
        setShowTaskModalFlag(true);
        setTargetTaskId(id);
    };

    const LoadProgramData = (data) => {
        console.log(data);
        setProgramName(data.name);
        setIsActive(data.active_flag);
        setAppMessage('');
    };

    const LoadTodoProgramData = (data) => {
        // console.log(data);
        setTaskItem({
            title: data.title,
            description: data.description,
            deadline: toNormalTime(data.deadline),
        });
        setAppMessage('');
    };

    const handleModalHidden = () => {
        setShowModalFlag(false);
    };

    const handleTodoModalHidden = () => {
        setShowTaskModalFlag(false);
        clearTaskModal();
    };

    const handleAddEditProgram = () => {
        if (programName.trim() === '') {
            setAppMessage('Please provide program name');
        } else {
            let newProgram = {
                name: programName,
                active_flag: isActive === 'true' ? true : false,
            };
            if (targetProgramId === 'ADD') {
                axios
                    .post('http://localhost:8000/api/programs', newProgram)
                    .then((res) => {
                        if (res.data.success) {
                            setShowModalFlag(false);
                            clearProgramModal();
                            axios
                                .get('http://localhost:8000/api/programs')
                                .then((res) => {
                                    dispatch({
                                        type: 'FETCH_PROGRAMS',
                                        payload: res.data,
                                    });
                                });
                        } else {
                            setAppMessage(res.data.message);
                        }
                    });
            } else {
                axios
                    .put(
                        `http://localhost:8000/api/programs/${targetProgramId}`,
                        newProgram
                    )
                    .then((res) => {
                        if (res.data.success) {
                            setShowModalFlag(false);
                            clearProgramModal();
                            axios
                                .get('http://localhost:8000/api/programs')
                                .then((res) => {
                                    dispatch({
                                        type: 'FETCH_PROGRAMS',
                                        payload: res.data,
                                    });
                                });
                        } else {
                            setAppMessage(res.data.message);
                        }
                    });
            }
        }
    };

    const handleAddEditTask = () => {
        if (!taskItem.title) return setAppMessage('Please provide task name');
        if (!taskItem.description)
            return setAppMessage('Please provide description name');
        if (!taskItem.deadline) return setAppMessage('Please provide deadline');
        let newTask = taskItem;
        if (targetTaskId === 'ADD') {
            axios
                .post('http://localhost:8000/api/programs/addTask', {
                    task: newTask,
                    programName: taskListProgramName,
                })
                .then((res) => {
                    if (res.data.success) {
                        clearTaskModal();
                        axios
                            .get('http://localhost:8000/api/programs')
                            .then(async (res) => {
                                dispatch({
                                    type: 'FETCH_PROGRAMS',
                                    payload: res.data,
                                });

                                setTaskList(
                                    res.data.find(
                                        (program) =>
                                            program.name === taskListProgramName
                                    ).task_list
                                );
                            });
                    } else {
                        setAppMessage(res.data.message);
                    }
                });
        } else {
            axios
                .put(
                    `http://localhost:8000/api/programs/${targetTaskId}/editTask`,
                    {
                        task: newTask,
                        programName: taskListProgramName,
                    }
                )
                .then((res) => {
                    if (res.data.success) {
                        clearTaskModal();
                        axios
                            .get('http://localhost:8000/api/programs')
                            .then((res) => {
                                dispatch({
                                    type: 'FETCH_PROGRAMS',
                                    payload: res.data,
                                });
                                setTaskList(
                                    res.data.find(
                                        (program) =>
                                            program.name === taskListProgramName
                                    ).task_list
                                );
                            });
                    } else {
                        setAppMessage(res.data.message);
                    }
                });
        }
    };

    const handleOnInputChange = (e, fieldtype) => {
        if (fieldtype === 'programname') {
            setProgramName(e.target.value);
        } else if (fieldtype === 'activeflag') {
            setIsActive(e.target.value);
        } else if (fieldtype === 'todoTitle') {
            setTaskItem({ ...taskItem, title: e.target.value });
        } else if (fieldtype === 'todoDescription') {
            setTaskItem({ ...taskItem, description: e.target.value });
        } else if (fieldtype === 'todoDeadline') {
            setTaskItem({ ...taskItem, deadline: e.target.value });
        }
    };

    return (
        <>
            <div className='container-fluid  mt-4'>
                <div className='table-responsive'>
                    <MaterialTable
                        title='Programs'
                        data={data}
                        columns={[
                            {
                                title: 'Program Name',
                                field: 'name',
                            },
                            {
                                title: 'Task List',
                                field: 'task_list',
                                render: (datum) => (
                                    <button
                                        onClick={() => {
                                            datum?.task_list?.length > 0
                                                ? setTaskList(datum.task_list)
                                                : setTaskList([
                                                      {
                                                          title: 'Make a new entry',
                                                          description:
                                                              'do not edit',
                                                          deadline: new Date(
                                                              Date.now()
                                                          ),
                                                          _id: uuidv4(),
                                                      },
                                                  ]);
                                            setTaskListProgramName(datum.name);
                                        }}
                                    >
                                        View taskList
                                    </button>
                                ),
                            },
                            {
                                title: 'Active',
                                field: 'active_flag',
                                render: (datum) =>
                                    datum.active_flag ? 'Yes' : 'No',
                            },
                        ]}
                        actions={[
                            {
                                icon: 'add',
                                tooltip: 'Add Program',
                                isFreeAction: true,
                                onClick: (event) => handleShowModal('ADD'),
                            },
                            {
                                icon: 'refresh',
                                tooltip: 'Refresh Data',
                                isFreeAction: true,
                                onClick: () => handleProgramTableRefresh(),
                            },
                            {
                                icon: 'edit',
                                tooltip: 'Edit Program',
                                onClick: (event, rowData) => {
                                    handleShowModal(rowData._id);
                                    LoadProgramData(rowData);
                                },
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete Program',
                                onClick: (event, rowData) => {
                                    let userId = rowData._id;
                                    handleProgramDelete(userId);
                                },
                            },
                        ]}
                        options={{
                            search: true,
                            paging: true,
                            filtering: true,
                            exportButton: true,
                            pageSize: 10,
                            maxBodyHeight: '90vh',
                        }}
                    />
                </div>
            </div>

            <Modal
                show={showModalFlag}
                onHide={() => handleModalHidden()}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {targetProgramId === 'ADD'
                            ? 'New Program'
                            : 'Edit Program'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id='appmessage'>{appMessage}</p>
                    <Form.Group className='mb-3'>
                        <Form.Label>Program Name*</Form.Label>
                        <Form.Control
                            type='text'
                            value={programName}
                            onChange={(e) =>
                                handleOnInputChange(e, 'programname')
                            }
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Active Flag*</Form.Label>
                        <Form.Select
                            value={isActive}
                            onChange={(e) =>
                                handleOnInputChange(e, 'activeflag')
                            }
                        >
                            <option value='true'>True</option>
                            <option value='false'>False</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className='py-3'>
                    <Button
                        className='myButton'
                        onClick={() => handleAddEditProgram()}
                    >
                        <i className='fa fa-save' /> Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* taskList */}
            <Modal
                show={taskList?.length > 0}
                onHide={() => setTaskList([])}
                keyboard={false}
                size='xl'
            >
                <Modal.Header closeButton>
                    <Modal.Title>{taskListProgramName} Task List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id='appmessage'>{appMessage}</p>
                    <div className='container-fluid mt-4 '>
                        <div className='table-responsive'>
                            <MaterialTable
                                title={`${taskListProgramName} Task List`}
                                data={taskList}
                                columns={[
                                    {
                                        title: 'Title',
                                        field: 'title',
                                    },
                                    {
                                        title: 'Description',
                                        field: 'description',
                                    },
                                    {
                                        title: 'Deadline',
                                        field: 'deadline',
                                        render: (tasks) =>
                                            toNormalTime(tasks.deadline),
                                    },
                                ]}
                                actions={[
                                    {
                                        icon: 'add',
                                        tooltip: 'Add Task',
                                        isFreeAction: true,
                                        onClick: (event) =>
                                            handleShowTaskModal('ADD'),
                                    },
                                    {
                                        icon: 'refresh',
                                        tooltip: 'Refresh Data',
                                        isFreeAction: true,
                                        onClick: () => handleTaskTableRefresh(),
                                    },
                                    {
                                        icon: 'edit',
                                        tooltip: 'Edit Task',
                                        onClick: (event, rowData) => {
                                            handleShowTaskModal(rowData._id);
                                            LoadTodoProgramData(rowData);
                                        },
                                    },
                                    {
                                        icon: 'delete',
                                        tooltip: 'Delete Task',
                                        onClick: (event, rowData) => {
                                            let taskID = rowData._id;
                                            handleTaskDelete(taskID);
                                        },
                                    },
                                ]}
                                options={{
                                    search: true,
                                    paging: true,
                                    filtering: true,
                                    exportButton: true,
                                    pageSize: 10,
                                    maxBodyHeight: '90vh',
                                }}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* edit Task List */}
            <Modal
                show={shoTaskModalFlag}
                onHide={() => handleTodoModalHidden()}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {targetTaskId === 'ADD' ? 'New Task' : 'Edit Task'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id='appmessage'>{appMessage}</p>
                    <Form.Group className='mb-3'>
                        <Form.Label>Title*</Form.Label>
                        <Form.Control
                            type='text'
                            value={taskItem?.title}
                            onChange={(e) =>
                                handleOnInputChange(e, 'todoTitle')
                            }
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Task Description*</Form.Label>
                        <Form.Control
                            type='text'
                            value={taskItem?.description}
                            onChange={(e) =>
                                handleOnInputChange(e, 'todoDescription')
                            }
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Task Deadline*</Form.Label>
                        <Form.Control
                            type='date'
                            value={taskItem?.deadline}
                            onChange={(e) =>
                                handleOnInputChange(e, 'todoDeadline')
                            }
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className='py-3'>
                    <Button
                        className='myButton'
                        onClick={() => handleAddEditTask()}
                    >
                        <i className='fa fa-save' /> Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default Programs;
