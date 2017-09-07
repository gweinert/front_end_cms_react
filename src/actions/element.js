import {
	CREATE_NEW_LOCAL_PAGE_ELEMENT,
	REQUEST_DELETE_PAGE_ELEMENTS,
	DELETE_PAGE_ELEMENTS_SUCCESS,
	DELETE_PAGE_ELEMENTS_FAIL,
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
	let numberOfSamePageElements = 1; // @DEV: use for label

	normalElements.forEach((el) => {
		if (el.type === type) {
			numberOfSamePageElements += 1;
		}
	});

	const tempId = makeTempId();

	defaultElement.id = tempId;
	defaultElement.pageId = activePage.id;
	defaultElement.sortOrder = normalElements.length;
	defaultElement.name = `${type}${tempId}`;
	defaultElement.type = type;

	return defaultElement;
}

function makeTempId() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return `_ ${Math.random().toString(36).substr(2, 9)}`;
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

// DELETE

function requestDeletePageElements() {
	return {
		type: REQUEST_DELETE_PAGE_ELEMENTS,
	};
}

function deletePageElementsSuccess(payload) {
	return {
		type: DELETE_PAGE_ELEMENTS_SUCCESS,
		payload,
	};
}

function deletePageElementsFail() {
	return {
		type: DELETE_PAGE_ELEMENTS_FAIL,
	};
}

// If its a local element that hasn't been sent to db delete locally, else delete via database call
function deletePageElements(pageElementsIds, groupId) {
	console.log('page els ids', pageElementsIds);
	if (pageElementsIds.length && typeof pageElementsIds[0] === 'string') { // is temp id
		return deletePageElementsSuccess({ groupId, ids: pageElementsIds });
	}

	const formData = JSON.stringify({ groupId, ids: pageElementsIds });
	return POST('element/delete', formData, requestDeletePageElements, deletePageElementsSuccess, deletePageElementsFail);
}


function shouldDeletePageElements(state) {
	if (state.site.isDeleting) {
		return false;
	}

	return true;
}

export function deletePageElementsWithId(pageElementsIds, groupId) {
	return (dispatch, getState) => {
		if (shouldDeletePageElements(getState())) {
			return dispatch(deletePageElements(pageElementsIds, groupId));
		}
	};
}
