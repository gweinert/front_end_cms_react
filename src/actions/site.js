import Cookie from 'js-cookie';
import {
	REQUEST_PUBLISH_SITE,
	PUBLISH_SITE_SUCCESS,
	PUBLISH_SITE_FAIL,
} from './actionCreators';
import { POST } from '../api';

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
	if (state.site.isPosting) {
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
