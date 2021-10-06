import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AdminLoginForm from './components/admin/AdminLoginForm';
import AdminApp from './components/admin/AdminApp';
import Main from './components/Main';
import { useHistory, useLocation } from 'react-router-dom';

function App() {
	const adminToken = useSelector((state) => state.adminToken);
	const parentToken = useSelector((state) => state.parentToken);
	const dispatch = useDispatch();

	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		if (sessionStorage.getItem('adminToken') != null) {
			dispatch({
				type: 'SET_ADMIN_TOKEN',
				payload: sessionStorage.getItem('adminToken')
			});
			dispatch({
				type: 'SET_ADMIN_USER_SIGNED_IN',
				payload: sessionStorage.getItem('adminUserSignedIn')
			});
		}
		if (sessionStorage.getItem('parentToken') != null) {
			dispatch({
				type: 'SET_PARENT_TOKEN',
				payload: sessionStorage.getItem('parentToken')
			});
			dispatch({
				type: 'SET_PARENT_USER_SIGNED_IN',
				payload: sessionStorage.getItem('parentUserSignedIn')
			});
		}
	}, []);

	const checkIfAuthenticated = () => {
		if (location.pathname.slice(0, 6).toLowerCase() === '/admin' && location.pathname !== '/admin') {
			if (!adminToken) {
				history.push('/admin');
			}
		} else if (location.pathname !== '/' && location.pathname !== '/admin') {
			if (!parentToken) {
				history.push('/');
			}
		}
	};
	checkIfAuthenticated();

	return (
		<div className='App'>
			<Switch>
				<Route path='/admin' component={adminToken ? AdminApp : AdminLoginForm} />
				<Route path='/' component={parentToken ? Main : LoginForm} />
			</Switch>
		</div>
	);
}

export default App;
