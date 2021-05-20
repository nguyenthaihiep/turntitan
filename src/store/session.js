const sessionData = {
	token: null,
	email: null,
	employees: [],
	fetchDate: null,
	memberAddTurnId: null,
	memberId: null,
	action: null
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
		case 'SETUP':
			return {
				...state, 
				employees: action.employees,
				fetchDate: action.fetchDate
			};
		case 'UPDATE_EMPLOYEE':
			const employees = state.employees;
			employees[action.index] = action.employee;
			return {
				...state, 
				employees: employees
			};
		case 'UPDATE_EMPLOYEES':
			return {
				...state, 
				employees: action.employees
			};
		case 'SET_MEMBER_ADD_TURN':
			return {
				...state, 
				memberAddTurnId: action.index,
			};
		case 'SET_MEMBER_ACTION':
			return {
				...state,
				memberId: action.index,
				action: action.action
			}
		default: 
			return state
	}
}