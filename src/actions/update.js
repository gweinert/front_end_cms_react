import {
	REQUEST_UPDATE_PAGE,
	UPDATE_PAGE_SUCCESS,
	UPDATE_PAGE_FAIL,
} from './actionCreators';
import { POST } from '../api/';

function requestUpdatePage() {
	return {
		type: REQUEST_UPDATE_PAGE,
	};
}

function updatePageSuccess(payload) {
	return {
		type: UPDATE_PAGE_SUCCESS,
		payload,
	};
}

function updatePageFail(payload) {
	return {
		type: UPDATE_PAGE_FAIL,
		payload,
	};
}


function updatePage(updatedPage) {
	const formData = JSON.stringify(updatedPage);
	return POST('page/update', formData, requestUpdatePage, updatePageSuccess, updatePageFail);
}

function shouldUpdatePage(state) {
	if (state.site.isPosting) {
		return false;
	}

	return true;
}

export function updatePageSafely(updatedPage) {
	return (dispatch, getState) => {
		if (shouldUpdatePage(getState())) {
			return dispatch(updatePage(updatedPage));
		}
	}
}