import {
	REQUEST_USERS_SITE,
	RECEIVE_USERS_SITE_SUCCESS,
	RECEIVE_USERS_SITE_FAIL,
	CREATE_NEW_LOCAL_PAGE_ELEMENT,
	REQUEST_CREATE_GROUP,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAIL,
} from '../actions/actionCreators';

export default function site(
	state = {
		isFetching: false,
		isPosting: false,
		data: null,
		error: null,
	},
	action) {
	switch (action.type) {
	case REQUEST_USERS_SITE:
		return { ...state, isFetching: true };
	case RECEIVE_USERS_SITE_SUCCESS:
		return { ...state, isFetching: false, data: action.payload };
	case RECEIVE_USERS_SITE_FAIL:
		return { ...state, isFetching: false, error: action.payload };
	case CREATE_NEW_LOCAL_PAGE_ELEMENT:
		return {
			...state,
			data: addNewPageElement(state, action),
		};
	case REQUEST_CREATE_GROUP:
		return { ...state, isPosting: true };
	case CREATE_GROUP_SUCCESS:
		return {
			...state,
			isPosting: false,
			data: addNewPageElementAndGroup(state, action),
		};
	case CREATE_GROUP_FAIL:
		return { ...state, isPosting: false };
	default: return state;
	}
}

function addNewPageElement(state, action, options = {}) {
	// const buildPageElFunc = options.group ? buildPageElementsWithGroup : buildPageElements;
	const pageId = action.pageId || action.payload.data.pageId;

	return {
		...state.data,
		pages: state.data.pages.map(page => (
			page.id === pageId ?
				{ ...page, elements: buildPageElements(page.elements, action) }
				:
				page
		)),
	};
}

function addNewPageElementAndGroup(state, action) {
	const { elements, group } = action.payload.data;

	return {
		...state.data,
		pages: state.data.pages.map(page => (
			page.id === group.pageId ?
				{
					...page,
					elements: [...page.elements, ...elements],
					groups: [...page.groups, group],
				}
				:
				page
		)),
	};
}

function buildPageElements(oldElements, action) {
	if (Array.isArray(action.pageElements)) {
		return [...oldElements, ...action.pageElements];
	}
	return [...oldElements, action.pageElements];
}

