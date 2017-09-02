import {
	REQUEST_USERS_SITE,
	RECEIVE_USERS_SITE_SUCCESS,
	RECEIVE_USERS_SITE_FAIL,
} from './actionCreators';
import { GET } from '../api/';

function requestUsersSite() {
	return {
		type: REQUEST_USERS_SITE,
	};
}

function receiveUsersSiteSuccess(payload) {
	return {
		type: RECEIVE_USERS_SITE_SUCCESS,
		payload,
	};
}

function receiveUsersSiteSuccessFail(payload) {
	return {
		type: RECEIVE_USERS_SITE_FAIL,
		payload,
	};
}

function fetchUsersSite() {
	return GET('site', requestUsersSite, receiveUsersSiteSuccess, receiveUsersSiteSuccessFail);
}

function shouldFetchUsersSite(state) {
	if (state.site.isFetching) {
		return false;
	}
	return true;
}

export function fetchUsersSiteIfNeeded() {
	return (dispatch, getState) => {
		if (shouldFetchUsersSite(getState())) {
			return dispatch(fetchUsersSite());
		}
	};
}
