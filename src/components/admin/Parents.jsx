import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
const Parents = (props) => {
    const data = useSelector((state) => state.parents);
    const dispatch = useDispatch();
    const [showModalFlag, setShowModalFlag] = useState(false);
    const [appMessage, setAppMessage] = useState('');
    const [targetParentId, setTargetParentId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isActive, setIsActive] = useState('true');

    useEffect(() => {
        axios.get('http://localhost:8000/api/parents').then((res) => {
            dispatch({ type: 'FETCH_PARENTS', payload: res.data });
        });
    }, []);

    const clearParentModal = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setIsActive('true');
        setAppMessage('');
    };

    const handleParentDelete = (id) => {
        axios.delete(`http://localhost:8000/api/parents/${id}`).then((res) => {
            if (res.data.deletedCount === 1) {
                axios.get('http://localhost:8000/api/parents').then((res) => {
                    dispatch({ type: 'FETCH_PARENTS', payload: res.data });
                });
            } else {
                console.log('Unable to delete parent.' + res.data);
            }
        });
    };

    const handleParentTableRefresh = () => {
        axios.get('http://localhost:8000/api/parents').then((res) => {
            dispatch({ type: 'FETCH_PARENTS', payload: res.data });
        });
    };

    const handleShowModal = (targetParentId) => {
        setShowModalFlag(true);
        setTargetParentId(targetParentId);
    };

    const LoadParentData = (data) => {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email_address);
        setIsActive(data.active_flag);
        setAppMessage('');
    };

    const handleModalHidden = () => {
        setShowModalFlag(false);
    };

    const handleAddEditParent = () => {
        if (firstName.trim() === '') {
            setAppMessage('Please provide first name');
        } else if (lastName.trim() === '') {
            setAppMessage('Please provide last name');
        } else if (email.trim() === '') {
            setAppMessage('Please provide email address');
        } else {
            let newParent = {
                first_name: firstName,
                last_name: lastName,
                email_address: email,
                password: '12345',
                active_flag: isActive === 'true' ? true : false,
            };
            if (targetParentId === 'ADD') {
                axios
                    .post('http://localhost:8000/api/parents', newParent)
                    .then((res) => {
                        if (res.data.success) {
                            setShowModalFlag(false);
                            clearParentModal();
                            axios
                                .get('http://localhost:8000/api/parents')
                                .then((res) => {
                                    dispatch({
                                        type: 'FETCH_PARENTS',
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
                        `http://localhost:8000/api/parents/${targetParentId}`,
                        newParent
                    )
                    .then((res) => {
                        if (res.data.success) {
                            setShowModalFlag(false);
                            clearParentModal();
                            axios
                                .get('http://localhost:8000/api/parents')
                                .then((res) => {
                                    dispatch({
                                        type: 'FETCH_PARENTS',
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

    const handleOnInputChange = (e, fieldtype) => {
        if (fieldtype === 'firstname') {
            setFirstName(e.target.value);
        } else if (fieldtype === 'lastname') {
            setLastName(e.target.value);
        } else if (fieldtype === 'email') {
            setEmail(e.target.value);
        } else if (fieldtype === 'activeflag') {
            setIsActive(e.target.value);
        }
    };

    return (
        <>
            <div className='container-fluid  mt-4'>
                <div className='table-responsive'>
                    <MaterialTable
                        title='Parents'
                        data={data}
                        columns={[
                            {
                                title: 'First Name',
                                field: 'first_name',
                            },
                            {
                                title: 'Last Name',
                                field: 'last_name',
                            },
                            {
                                title: 'Email',
                                field: 'email_address',
                            },
                            {
                                title: 'Active Flag',
                                field: 'active_flag',
                            },
                        ]}
                        actions={[
                            {
                                icon: 'add',
                                tooltip: 'Add Parent',
                                isFreeAction: true,
                                onClick: (event) => handleShowModal('ADD'),
                            },
                            {
                                icon: 'refresh',
                                tooltip: 'Refresh Data',
                                isFreeAction: true,
                                onClick: () => handleParentTableRefresh(),
                            },
                            {
                                icon: 'edit',
                                tooltip: 'Edit Parent',
                                onClick: (event, rowData) => {
                                    handleShowModal(rowData._id);
                                    LoadParentData(rowData);
                                },
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete Parent',
                                onClick: (event, rowData) => {
                                    let parentId = rowData._id;
                                    handleParentDelete(parentId);
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
                        {targetParentId === 'ADD'
                            ? 'New Parent'
                            : 'Edit Parent'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id='appmessage'>{appMessage}</p>
                    <Form.Group className='mb-3'>
                        <Form.Label>First Name*</Form.Label>
                        <Form.Control
                            type='text'
                            value={firstName}
                            onChange={(e) =>
                                handleOnInputChange(e, 'firstname')
                            }
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Last Name*</Form.Label>
                        <Form.Control
                            type='text'
                            value={lastName}
                            onChange={(e) => handleOnInputChange(e, 'lastname')}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Email Address*</Form.Label>
                        <Form.Control
                            type='email'
                            value={email}
                            onChange={(e) => handleOnInputChange(e, 'email')}
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
                        onClick={() => handleAddEditParent()}
                    >
                        <i className='fa fa-save' /> Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default Parents;
