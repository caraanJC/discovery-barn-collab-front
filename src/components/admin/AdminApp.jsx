import { Route, Link, Switch } from 'react-router-dom';
import Users from './Users';
import Logs from './Logs';
import Programs from './Programs';
import Parents from './Parents';
import Students from './Students';
import Videos from './Videos';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
const AdminApp = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const adminUserSignedIn = useSelector((state) => state.adminUserSignedIn);
	const adminToken = useSelector((state) => state.adminToken);

	const onToggleSideNav = () => {
		document.querySelector('.App').classList.toggle('sb-sidenav-toggled');
	};

	const handleLogout = () => {
		sessionStorage.removeItem('adminToken');
		dispatch({ type: 'REMOVE_ADMIN_TOKEN' });
		dispatch({ type: 'REMOVE_ADMIN_USER_SIGNED_IN' });
		history.push('/admin');
	};
	return (
		<>
			<nav className='sb-topnav navbar navbar-expand navbar-dark bg-green'>
				<a className='navbar-brand' href='./admin'>
					Distance Learning
				</a>
				<button className='btn btn-link btn-sm order-1 order-lg-0' id='sidebarToggle' href='#' onClick={() => onToggleSideNav()}>
					<i className='fa fa-bars'></i>
				</button>
				<div class='d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0'></div>

				<ul className='navbar-nav ml-auto ml-md-0'>
					<li className='nav-item dropdown'>
						<a class='nav-link dropdown-toggle' type='button' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
							<i className='fa fa-user fa-fw'></i>
						</a>
						<ul class='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
							<li>
								<a class='dropdown-item' href='#'>
									Change Password
								</a>
							</li>
							<li onClick={() => handleLogout()}>
								<a class='dropdown-item' href='#'>
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
								<div className='sb-sidenav-menu-heading'>System</div>
								<Link to='/admin/users' className='nav-link'>
									<div className='sb-nav-link-icon'>
										<i className='fa fa-user-plus'></i>
									</div>
									Users
								</Link>
								<Link to='/admin/logs' className='nav-link'>
									<div className='sb-nav-link-icon'>
										<i className='fa fa-history'></i>
									</div>
									Logs
								</Link>
								<div className='sb-sidenav-menu-heading'>Maintenance</div>
								<Link to='/admin/programs' className='nav-link'>
									<div className='sb-nav-link-icon'>
										<i class='fa fa-clipboard'></i>
									</div>
									Programs
								</Link>
								<Link to='/admin/parents' className='nav-link'>
									<div className='sb-nav-link-icon'>
										<i className='fa fa-users'></i>
									</div>
									Parents
								</Link>
								<Link to='/admin/students' className='nav-link'>
									<div className='sb-nav-link-icon'>
										<i className='fa fa-child'></i>
									</div>
									Students
								</Link>
								<Link to='/admin/videos' className='nav-link'>
									<div className='sb-nav-link-icon'>
										<i className='fa fa-film'></i>
									</div>
									Videos
								</Link>
							</div>
						</div>
						<div className='sb-sidenav-footer'>
							<div className='small'>Logged in as:</div>
							<span>{adminUserSignedIn}</span>
						</div>
					</nav>
				</div>
				<div id='layoutSidenav_content'>
					<main>
						<Switch>
							<Route exact path='/admin/users' render={() => <Users />} />
							<Route exact path='/admin/logs' render={() => <Logs />} />
							<Route exact path='/admin/programs' render={() => <Programs />} />
							<Route exact path='/admin/parents' render={() => <Parents />} />
							<Route exact path='/admin/students' render={() => <Students />} />
							<Route exact path='/admin/videos' render={() => <Videos />} />
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
export default AdminApp;
