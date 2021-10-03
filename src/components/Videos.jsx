import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Videos = (props) => {
    const parentChildren = useSelector((state) => state.parentChildren);
    const programVideos = useSelector((state) => state.programVideos);
    const dispatch = useDispatch();
    const [program, setProgram] = useState('');
    const childSelected = useSelector((state) => state.childSelected);
    const childProgramSelected = useSelector((state) => state.childProgramSelected);

    const handleOnChange = (e) => {
        let child = e.target.value;
        let childprogram = e.target.childNodes[e.target.selectedIndex].getAttribute('data-program-id');
        dispatch({type:"SET_CHILD_PROGRAM_SELECTED",payload:childprogram});
        dispatch({type:"SET_CHILD_SELECTED",payload:child});
    };

    useEffect(() => {
        if (childProgramSelected !== '') {
            axios
                .get(`http://localhost:8000/api/programs/${childProgramSelected}`)
                .then((res) => {
                    setProgram(res.data.name);
                });
            axios
                .get(`http://localhost:8000/api/videos/${childProgramSelected}`)
                .then((res) => {
                    dispatch({
                        type: 'FETCH_PROGRAM_VIDEOS',
                        payload: res.data,
                    });
                });
        } else {
            dispatch({
                type: 'FETCH_PROGRAM_VIDEOS',
                payload: [],
            });
            setProgram('');
        }
    }, [childProgramSelected]);

    return (
        <div className='container-fluid mt-4'>
            <div className='table-responsive'>
                <div className='d-flex align-items-bottom justify-content-between'>
                    <h2>Videos</h2>
                    <select
                        className='form-select form-select-md mb-3 '
                        aria-label='.form-select-md'
                        id='childselection'
                        onChange={(e) => handleOnChange(e)}
                        value={childSelected}
                    >
                        <option value='' data-program-id=''>Select A Student</option>
                        {parentChildren.map((child) => {
                            return (
                                <option
                                    key={child._id}
                                    value={child._id}
                                    data-program-id={child.program_id}
                                >
                                    {child.first_name} {child.last_name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <hr/>
                <div className='row' id='programvideocontent'>
                    <h3 className='mt-1 mb-3' id='programtitle'>
                        {program}
                    </h3>
                    {programVideos.length===0&&childSelected!==''&&<i><h5>No Videos Available</h5></i>}
                    {programVideos.map((video) => {
                        let lessondate = new Date(video.lesson_date);
                        let dateformat = {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        };
                        return (
                            <>
                                <div
                                    key={video._id}
                                    className='col-xl-3 col-lg-4 col-sm-6 mb-4'
                                >
                                    <div className='dbp-thumbnail card'>
                                        <Link
                                            to={`/videos/${video._id}`}
                                            className='card-img-container'
                                        >
                                            <img
                                                className='card-img-top img-responsive'
                                                src={video.thumbnail_path}
                                                alt={video.title}
                                            />
                                        </Link>
                                        <div className='card-body'>
                                            <h6 className='card-title'>
                                                <Link to={`/videos/${video._id}`}>
                                                    {video.title}
                                                </Link>
                                            </h6>
                                            <h6 className='card-subtitle mb-3'>
                                                {lessondate.toLocaleDateString(
                                                    'en-US',
                                                    dateformat
                                                )}
                                            </h6>
                                            <p className='card-text'>
                                                {video.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default Videos;
