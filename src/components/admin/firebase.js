import { initializeApp } from 'firebase/app';
const firebaseConfig = {
	apiKey: 'AIzaSyCIUDN1zjuBVwIKcsYchW46gbEBtA9J23Y',
	authDomain: 'discoverybarnpreschooluplift.firebaseapp.com',
	projectId: 'discoverybarnpreschooluplift',
	storageBucket: 'discoverybarnpreschooluplift.appspot.com',
	messagingSenderId: '956487045229',
	appId: '1:956487045229:web:87519a3a72e4bbeb6e2f64',
	measurementId: 'G-H4E9F99S8W'
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
