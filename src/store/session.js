const sessionData = {
	token: null,
	email: null
}

export default function session(state = sessionData, action) {
	switch(action.type) {
		case 'SET_TOKEN': 
			localStorage.setItem('token', action.token);
			localStorage.setItem('email', action.email);
			return {
				...state, 
				token: action.token,
				email: action.email
			};
		default: 
			return state
	}
}