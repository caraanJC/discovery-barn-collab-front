const initState = {
	adminUserSignedIn: '',
	parentUserSignedIn: '',
	adminToken: '',
	parentToken: '',
	parentChildren: [],
	systemLog: [],
	users: [],
	programs: [],
	parents: [],
	students: [],
	videos: [],
	programVideos: [],
	announcements: [],
	submissions: [],
	childSelected:'',
	childProgramSelected:''
};

const reducer = (state = initState, action) => {
	switch (action.type) {
		case 'SET_ADMIN_TOKEN':
			return { ...state, adminToken: action.payload };
		case 'SET_ADMIN_USER_SIGNED_IN':
			return { ...state, adminUserSignedIn: action.payload };
		case 'REMOVE_ADMIN_USER_SIGNED_IN':
			return { ...state, adminUserSignedIn: '' };
		case 'SET_PARENT_USER_SIGNED_IN':
			return { ...state, parentUserSignedIn: action.payload };
		case 'REMOVE_PARENT_USER_SIGNED_IN':
			return { ...state, parentUserSignedIn: '' };
		case 'REMOVE_ADMIN_TOKEN':
			return { ...state, adminToken: '' };
		case 'SET_PARENT_TOKEN':
			return { ...state, parentToken: action.payload };
		case 'REMOVE_PARENT_TOKEN':
			return { ...state, parentToken: '' };
		case 'FETCH_LOGS':
			return { ...state, systemLog: action.payload };
		case 'FETCH_USERS':
			return { ...state, users: action.payload };
		case 'FETCH_PROGRAMS':
			return { ...state, programs: action.payload };
		case 'FETCH_PARENTS':
			return { ...state, parents: action.payload };
		case 'FETCH_STUDENTS':
			return { ...state, students: action.payload };
		case 'FETCH_VIDEOS':
			return { ...state, videos: action.payload };
		case 'FETCH_PARENT_CHILDREN':
			return { ...state, parentChildren: action.payload };
		case 'FETCH_PROGRAM_VIDEOS':
			return { ...state, programVideos: action.payload };
		case 'FETCH_ANNOUNCEMENTS':
			return { ...state, announcements: action.payload };
		case 'FETCH_SUBMISSIONS':
			return { ...state, submissions: action.payload };
		case 'SET_CHILD_SELECTED':
			return { ...state, childSelected: action.payload };
		case 'SET_CHILD_PROGRAM_SELECTED':
			return { ...state, childProgramSelected: action.payload };
		default:
			return state;
	}
};
export default reducer;
