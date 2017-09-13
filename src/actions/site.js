import Cookie from 'js-cookie';
import {
	REQUEST_USERS_SITE,
	RECEIVE_USERS_SITE_SUCCESS,
	RECEIVE_USERS_SITE_FAIL,
	REQUEST_PUBLISH_SITE,
	PUBLISH_SITE_SUCCESS,
	PUBLISH_SITE_FAIL,
} from './actionCreators';
import { POST, GET } from '../api';

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

function requestPublishSite() {
	return {
		type: REQUEST_PUBLISH_SITE,
	};
}

function publishSiteSuccess(payload) {
	return {
		type: PUBLISH_SITE_SUCCESS,
		payload,
	};
}

function publishSiteFail() {
	return {
		type: PUBLISH_SITE_FAIL,
	};
}

function publishSite(userId) {
	const sessionId = Cookie.get('sessionId');
	const formData = JSON.stringify({ sessionId });
	return POST('site/publish', formData, requestPublishSite, publishSiteSuccess, publishSiteFail);
}

function shouldPublishSite(state) {
	if (state.site.isPublishing) {
		return false;
	}
	return true;
}

export function publishSiteSafely() {
	return (dispatch, getState) => {
		if (shouldPublishSite(getState())) {
			return dispatch(publishSite());
		}
	};
}
