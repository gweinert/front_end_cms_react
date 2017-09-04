import {
	CREATE_NEW_LOCAL_PAGE_ELEMENT,
	REQUEST_DELETE_PAGE_ELEMENT,
	DELETE_PAGE_ELEMENT_SUCCESS,
	DELETE_PAGE_ELEMENT_FAIL,
} from './actionCreators';
import { POST } from '../api/';


function DefaultElement() {
	return {
		// "id": 0,
		pageId: 0,
		groupId: 0,
		sortOrder: 0,
		groupSortOrder: 0,
		name: '',
		type: '',
		body: '',
		imageURL: '',
		linkPath: '',
		linkText: '',
	};
}


function buildPageElement(type, activePage) {
	const defaultElement = DefaultElement();
	const normalElements = activePage.elements.filter(el => el.groupId === 0);
	let numberOfSamePageElements = 1;

	normalElements.forEach((el) => {
		if (el.type === type) {
			numberOfSamePageElements += 1;
		}
	});

	defaultElement.pageId = activePage.id;
	defaultElement.sortOrder = normalElements.length;
	defaultElement.name = `${type}${numberOfSamePageElements}`;
	defaultElement.type = type;

	return defaultElement;
}

// can dispatch aa single or an array of page elements
function createNewLocalPageElements(pageElements, pageId) {
	return {
		type: CREATE_NEW_LOCAL_PAGE_ELEMENT,
		pageElements,
		pageId,
	};
}

export function createPageElement(pageElementType, activePage) {
	const pageElement = buildPageElement(pageElementType, activePage);
	return dispatch => dispatch(createNewLocalPageElements(pageElement, activePage.id));
}

function requestDeletePageElement() {
	return {
		type: REQUEST_DELETE_PAGE_ELEMENT,
	};
}

function deletePageElementSuccess(payload) {
	return {
		type: DELETE_PAGE_ELEMENT_SUCCESS,
		payload,
	};
}

function deletePageElementFail() {
	return {
		type: DELETE_PAGE_ELEMENT_FAIL,
	};
}

function deletePageElement(id) {
	const formData = JSON.stringify({ id });
	return POST('element/delete', formData, requestDeletePageElement, deletePageElementSuccess, deletePageElementFail);
}


function shouldDeletePageElement(state) {
	if (state.site.isDeleting) {
		return false;
	}

	return true;
}

export function deletePageElementWithId(id) {
	return (dispatch, getState) => {
		if (shouldDeletePageElement(getState())) {
			return dispatch(deletePageElement(id));
		}
	}
}
