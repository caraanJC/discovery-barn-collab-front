import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import Videos from './Videos';
import axios from 'axios';
import WatchVideo from './WatchVideo';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import TaskItem from './TaskItem';
const Main = (props) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const parentUserSignedIn = useSelector((state) => state.parentUserSignedIn);
	const parentToken = useSelector((state) => state.parentToken);

	useEffect(() => {
		axios.get(`http://localhost:8000/api/parents/get-students/${parentToken}`).then((res) => {
			dispatch({ type: 'FETCH_PARENT_CHILDREN', payload: res.data });
		});
	}, []);

	const onToggleSideNav = () => {
		document.querySelector('.App').classList.toggle('sb-sidenav-toggled');
	};

	const handleLogout = () => {
		sessionStorage.removeItem('parentToken');
		dispatch({ type: 'REMOVE_PARENT_TOKEN' });
		dispatch({ type: 'REMOVE_PARENT_USER_SIGNED_IN' });
		history.push('/');
	};
	return (
		<>
			<nav className='sb-topnav navbar navbar-expand navbar-dark bg-green'>
				<a className='navbar-brand' href='/'>
					Distance Learning
				</a>
				<button className='btn btn-link btn-sm order-1 order-lg-0' id='sidebarToggle' href='#' onClick={() => onToggleSideNav()}>
					<i className='fa fa-bars'></i>
				</button>
				<div className='d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0'></div>

				<ul className='navbar-nav ml-auto ml-md-0'>
					<li className='nav-item dropdown'>
						<a className='nav-link dropdown-toggle' type='button' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
							<i className='fa fa-user fa-fw'></i>
						</a>
						<ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
							<li>
								<a className='dropdown-item' href='#'>
									Change Password
								</a>
							</li>
							<li onClick={() => handleLogout()}>
								<a className='dropdown-item' href='#'>
									Logout
								</a>
							</li>
						</ul>
					</li>
				</ul>
			</nav>
			<div id='layoutSidenav'>
				<div id='layoutSidenav_nav'>
					<nav className='sb-sidenav accordion sb-sidenav-light' id='sidenavAccordion'>
						<div className='sb-sidenav-menu'>
							<div className='nav'>
								<div className='sb-sidenav-menu-heading'>MENU</div>
								<Link to='/dashboard' className='nav-link'>
									<div className='sb-nav-link-icon'>
										<i className='fa fa-dashboard'></i>
									</div>
									Dashboard
								</Link>

								<Link to='/videos' className='nav-link'>
									<div className='sb-nav-link-icon'>
										<i className='fa fa-film'></i>
									</div>
									Videos
								</Link>

								<Link to='/tasks' className='nav-link'>
									<div className='sb-nav-link-icon'>
										<i className='fa fa-list'></i>
									</div>
									Tasks
								</Link>
							</div>
						</div>
						<div className='sb-sidenav-footer'>
							<div className='small'>Logged in as:</div>
							<span>{parentUserSignedIn}</span>
						</div>
					</nav>
				</div>
				<div id='layoutSidenav_content'>
					<main>
						<Switch>
							<Route path='/view-task/:taskTitle' render={(props) => <TaskItem {...props} />} />
							<Route path='/videos/:id' render={() => <WatchVideo />} />
							<Route path='/videos' render={() => <Videos />} />
							<Route path='/dashboard' render={() => <Dashboard />} />
							<Route path='/tasks' component={Tasks} />
							<Redirect to='/dashboard' />
						</Switch>
					</main>
					<footer className='py-4 bg-light mt-auto'>
						<div className='container-fluid'>
							<div className='d-flex align-items-center justify-content-between small'>
								<div className='text-muted'>Copyright &copy; Distance Learning</div>
							</div>
						</div>
					</footer>
				</div>
			</div>
		</>
	);
};
export default Main;
