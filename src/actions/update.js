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
	console.log("updatedPage", updatedPage);
	return POST('page/update', formData, requestUpdatePage, updatePageSuccess, updatePageFail);
}

function shouldUpdatePage(state) {
	if (state.site.isPosting) {
		return false;
	}

	return true;
}

export function updatePageSafely(pageForm) {
	return (dispatch, getState) => {
		if (shouldUpdatePage(getState())) {
			const updatedPage = buildPage(pageForm, getState());
			return dispatch(updatePage(updatedPage));
		}
	}
}

function buildPage(state, _state) {
	const { activePageId } = _state.page;
	const activePage = _state.site.data.pages.find(page => page.id === activePageId);
	const formName = `page[${activePageId}]`;
	const form = _state.form.formData[formName];
	const pageName = form.name || activePage.name;
	const pagePath = form.path || activePage.path;
	const updatedElements = buildPageElementsFromForm(activePage.elements, form);

	return {
		...activePage,
		name: pageName,
		path: pagePath,
		elements: updatedElements,
	};
}

function buildPageElementsFromForm(elements, formState) {
	return elements.map((el) => {
		const nameKey = `${el.type}[${el.id}]`;
		const updatedValue = formState[nameKey] || el.body;

		// remove temp id if its has one
		if (typeof el.id === 'string' && el.id[0] === '_') {
			delete el.id;
		}

		switch (el.type.toLowerCase()) {
		case 'title':
			return { ...el, body: updatedValue };
		case 'blurb':
			return { ...el, body: updatedValue };
		default: return el;
		}
	});
}
