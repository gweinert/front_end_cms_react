import {
	CREATE_NEW_LOCAL_PAGE_ELEMENT,
} from './actionCreators';
// import { GET } from '../api/';


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
