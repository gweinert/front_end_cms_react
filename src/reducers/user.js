import {
	REQUEST_LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	REQUEST_USER_SESSION,
	USER_SESSION_SUCCESS,
	USER_SESSION_FAIL,
} from '../actions/actionCreators';

export default function user(
	state = {
		isFetching: false,
		loggedIn: false,
		data: {
			developer: false,
		},
	}, action) {
	switch (action.type) {
	case REQUEST_LOGIN:
		return { ...state, isFetching: true };
	case LOGIN_SUCCESS:
		return {
			...state,
			isFetching: false,
			loggedIn: true,
			data: action.payload.user,
		};
	case LOGIN_FAIL:
		return { ...state, isFetching: false };
	case REQUEST_USER_SESSION:
		return { ...state, isFetching: true };
	case USER_SESSION_SUCCESS:
		return {
			...state,
			isFetching: false,
			loggedIn: true,
			data: action.payload.user,
		};
	case USER_SESSION_FAIL:
		return { ...state, isFetching: false };
	default: return state;
	}
}
