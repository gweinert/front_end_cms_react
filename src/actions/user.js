import Cookie from 'js-cookie';
import {
	REQUEST_LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	REQUEST_USER_SESSION,
	USER_SESSION_SUCCESS,
	USER_SESSION_FAIL,
} from './actionCreators';
import { POST } from '../api';

function requestLogin() {
	return {
		type: REQUEST_LOGIN,
	};
}

function loginSuccess(payload) {
	// Cookie.set('sessionId', payload.sessionId);
	Cookie.set('sessionId', payload.sessionId);
	return {
		type: LOGIN_SUCCESS,
		payload,
	};
}

function loginFail() {
	return {
		type: LOGIN_FAIL,
	};
}

function loginUser(creds) {
	const formData = JSON.stringify(creds);
	return POST('login', formData, requestLogin, loginSuccess, loginFail);
}

function shouldLogin(state) {
	if (state.user.isFetching) {
		return false;
	}
	return true;
}

export function login(creds) {
	return (dispatch, getState) => {
		if (shouldLogin(getState())) {
			return dispatch(loginUser(creds));
		}
	};
}

function requestUserSession() {
	return {
		type: REQUEST_USER_SESSION,
	};
}

function userSessionSuccess(payload) {
	// set user sessionid
	// Cookie.set('sessionId', payload.sessionId);
	return {
		type: USER_SESSION_SUCCESS,
		payload,
	};
}

function userSessionFail() {
	return {
		type: USER_SESSION_FAIL,
	};
}

function getUserSession() {
	const sessionId = Cookie.get('sessionId'); // get sessionid from cookie
	const formData = JSON.stringify({ id: sessionId });
	return POST('user/session', formData, requestUserSession, userSessionSuccess, userSessionFail);
}

function shouldGetUser(state) {
	if (state.user.isFetching) {
		return false;
	}
	return true;
}

export function getUser() {
	return (dispatch, getState) => {
		if (shouldGetUser(getState())) {
			return dispatch(getUserSession());
		}
	};
}

// expotr fetchGUIDIfNeeded() {
// 	return (dispatch, getState) => {
// 		if (shouldLogin)
// 	}
// }
