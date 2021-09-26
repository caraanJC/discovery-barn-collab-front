import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
const LogInForm = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();

	const handleOnSubmit = () => {
		let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		let isEmail = regex.test(email);

		let errorFields = document.querySelectorAll('.errormsg');
		for (let i = 0; i < errorFields.length; i++) {
			errorFields[i].textContent = '';
		}

		if (email.trim() === '' || isEmail === false) {
			document.querySelector('.emailErrorMsg').textContent = 'Please provide valid email address';
			document.querySelector('#emailaddressfld').focus();
			document.querySelector('#emailaddressfld').closest('.input-group').classList.add('witherror');
		} else if (password.trim() === '') {
			document.querySelector('.PasswordErrorMsg').textContent = 'Please provide password';
			document.querySelector('#passwordfld').focus();
			document.querySelector('#passwordfld').closest('.input-group').classList.add('witherror');
		} else {
			axios
				.post('https://safe-beyond-96213.herokuapp.com/api/parents/login', {
					email_address: email,
					password: password,
				})
				.then((res) => {
					if (res.data.success) {
						sessionStorage.setItem('parentToken', res.data.userKey);
						sessionStorage.setItem('parentUserSignedIn', res.data.nameOfUser);
						dispatch({
							type: 'SET_PARENT_TOKEN',
							payload: res.data.userKey,
						});
						dispatch({
							type: 'SET_PARENT_USER_SIGNED_IN',
							payload: res.data.nameOfUser,
						});
					} else {
						document.querySelector('.emailErrorMsg').textContent = res.data.message;
						document.querySelector('#emailaddressfld').focus();
						document.querySelector('#emailaddressfld').closest('.input-group').classList.add('witherror');
					}
				});
		}
	};

	return (
		<div className='login-form'>
			<div className='container'>
				<div className='section1'>
					<div className='info-section'>
						<div className='info-section-content'>
							<h1>Distance Learning</h1>
							<img src='./assets/images/admin-login-logo.png' alt='Admin Login' />
						</div>
					</div>
					<div className='login-section'>
						<h2>Login To Your Account</h2>
						<p>Enter your details to login</p>
						<div className='form-group'>
							<label>Email</label>
							<div className='input-group'>
								<span className='fa fa-envelope'></span>
								<input type='email' id='emailaddressfld' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} value={email} required />
							</div>
							<div className='emailErrorMsg errormsg'></div>
						</div>
						<div className='form-group'>
							<label>Password</label>
							<div className='input-group'>
								<span className='fa fa-lock'></span>
								<input type='password' id='passwordfld' placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} value={password} required />
							</div>
							<div className='PasswordErrorMsg errormsg'></div>
						</div>
						<button className='btn btn-danger btn-block' id='loginbtn' type='submit' onClick={() => handleOnSubmit()}>
							Login
						</button>
					</div>
				</div>
			</div>
			<div className='footer'>
				<p>Distance Learning. All Rights Reserved</p>
			</div>
		</div>
	);
};
export default LogInForm;
