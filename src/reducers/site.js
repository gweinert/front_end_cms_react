import {
	REQUEST_USERS_SITE,
	RECEIVE_USERS_SITE_SUCCESS,
	RECEIVE_USERS_SITE_FAIL,
	CREATE_NEW_LOCAL_PAGE_ELEMENT,
	REQUEST_CREATE_GROUP,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAIL,
	REQUEST_DELETE_PAGE_ELEMENT,
	DELETE_PAGE_ELEMENT_SUCCESS,
	DELETE_PAGE_ELEMENT_FAIL,
	REQUEST_NEW_PAGE,
	CREATE_NEW_PAGE_SUCCESS,
	CREATE_NEW_PAGE_FAIL,
	REQUEST_DELETE_PAGE,
	DELETE_PAGE_SUCCESS,
	DELETE_PAGE_FAIL,
} from '../actions/actionCreators';

export default function site(
	state = {
		isFetching: false,
		isPosting: false,
		isDeleting: false,
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
	case REQUEST_DELETE_PAGE_ELEMENT:
		return { ...state, isDeleting: true };
	case DELETE_PAGE_ELEMENT_SUCCESS:
		return { 
			...state,
			isDeleting: true,
			data: removePageElement(state.data, action),
		};
	case DELETE_PAGE_ELEMENT_FAIL:
		return { ...state, isDeleting: false };
	case REQUEST_NEW_PAGE:
		return { ...state, isPosting: true };
	case CREATE_NEW_PAGE_SUCCESS:
		return {
			...state,
			isPosting: false,
			data: addPage(state.data, action),
		};
	case CREATE_NEW_PAGE_FAIL:
		return { ...state, isPosting: false };
	case REQUEST_DELETE_PAGE:
		return { ...state, isDeleting: true };
	case DELETE_PAGE_SUCCESS:
		return {
			...state,
			isDeleting: false,
			data: { ...state.data, pages: state.data.pages.filter(page => page.id !== action.payload.id) },
		};
	case DELETE_PAGE_FAIL:
		return { ...state, isDeleting: false };
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

function removePageElement(state, action) {
	const { id, pageId } = action.payload;

	return {
		...state,
		pages: state.pages.map(page => (
			page.id === pageId ?
				{
					...page,
					elements: page.elements.filter(el => el.id !== id),
				}
				:
				page
		)),
	};
}

function addPage(state, action) {
	const { data } = action.payload;

	// add elements and groups array if null
	if (!data.elements) {
		data.elements = [];
	}
	if (!data.groups) {
		data.groups = [];
	}

	return {
		...state,
		pages: [...state.pages, data],
	};
}

