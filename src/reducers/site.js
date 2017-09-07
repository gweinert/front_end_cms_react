import {
	REQUEST_USERS_SITE,
	RECEIVE_USERS_SITE_SUCCESS,
	RECEIVE_USERS_SITE_FAIL,
	CREATE_NEW_LOCAL_PAGE_ELEMENT,
	REQUEST_CREATE_GROUP,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAIL,
	REQUEST_DELETE_PAGE_ELEMENTS,
	DELETE_PAGE_ELEMENTS_SUCCESS,
	DELETE_PAGE_ELEMENTS_FAIL,
	REQUEST_NEW_PAGE,
	CREATE_NEW_PAGE_SUCCESS,
	CREATE_NEW_PAGE_FAIL,
	REQUEST_DELETE_PAGE,
	DELETE_PAGE_SUCCESS,
	DELETE_PAGE_FAIL,
	UPDATE_LOCAL_PAGE_ELEMENT_GROUP,
	CREATE_NEW_LOCAL_PAGE_ELEMENTS_FOR_GROUP,
	SET_ACTIVE_PAGE,
	UPDATE_PAGE_SUCCESS,
} from '../actions/actionCreators';


export default function site(
	state = {
		isFetching: false,
		isPosting: false,
		isDeleting: false,
		data: null,
		error: null,
		activePageId: null,
	},
	action) {
	switch (action.type) {
	case REQUEST_USERS_SITE:
		return { ...state, isFetching: true };
	case RECEIVE_USERS_SITE_SUCCESS:
		return { ...state, isFetching: false, data: action.payload };
	case RECEIVE_USERS_SITE_FAIL:
		return { ...state, isFetching: false, error: action.payload };
	case SET_ACTIVE_PAGE:
		return { ...state, activePageId: action.pageId };
	case UPDATE_PAGE_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				pages: state.data.pages.map(page => (
					page.id === action.payload.data.id ?
						action.payload.data
						:
						page
				)),
			},
		};
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
	case REQUEST_DELETE_PAGE_ELEMENTS:
		return { ...state, isDeleting: true };
	case DELETE_PAGE_ELEMENTS_SUCCESS:
		return {
			...state,
			isDeleting: false,
			data: removePageElements(state, action),
		};
	case DELETE_PAGE_ELEMENTS_FAIL:
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
			data: {
				...state.data,
				pages: state.data.pages.filter(page => page.id !== action.payload.id) },
		};
	case DELETE_PAGE_FAIL:
		return { ...state, isDeleting: false };
	case CREATE_NEW_LOCAL_PAGE_ELEMENTS_FOR_GROUP:
		return {
			...state,
			data: {
				...state.data,
				pages: state.data.pages.map(page => (
					page.id === action.pageId ?
						{
							...page,
							elements: [
								...page.elements, ...action.pageElements,
							],
							groups: page.groups.map(group => (
								group.id === action.pageElements[0].groupId ?
									{
										...group,
										elements: [...group.elements, ...action.pageElements],
									}
									:
									group
							)),
						}
						:
						page
				)),
			},
		};
	case UPDATE_LOCAL_PAGE_ELEMENT_GROUP:
		return {
			...state,
			data: {
				...state.data,
				pages: state.data.pages.map(page => (
					page.id === action.pageId ?
						{
							...page,
							elements: page.elements.map(el => (
								(el.groupSortOrder === action.slideIndex) &&
								(el.groupId === action.data[0].groupId) ?
									action.data.find(actionPe => actionPe.id === el.id)
									:
									el
							)),
							groups: page.groups.map(group => (
								group.id === action.data[0].groupId ?
									{
										...group,
										elements: group.elements.map((el, index) => (
											el.groupSortOrder === action.slideIndex ?
												action.data.find(actionPe => actionPe.id === el.id)
												:
												el
										)),
									}
									:
									group
							)),
						}
						:
						page
				)),
			},
		};
	default: return state;
	}
}


// function buildGroups(payload) {
// 	const { elements, groups } = payload;
// 	let slideGroup = [];

// 	const groupedElements = elements.filter(el => el.groupId !== 0)
// 		.reduce((accum, cur) => {
// 			(accum[cur.groupId] = accum[cur.groupId] || []).push(cur);
// 			return accum;
// 		}, {});

// 	Object.keys(groupedElements).forEach((key) => {
// 		const ge = groupedElements[key];
// 		const currentGroup = groups.find(groupItem => groupItem.id === parseInt(key, 10));
// 		const elementsPerSlide = currentGroup.structure
// 			.reduce((accum, item) => (
// 				accum.amount ? accum.amount + item.amount : accum + item.amount
// 			), 0);

// 		let slide = [];
// 		ge.forEach((el, index) => {
// 			const slideNum = Math.floor(index / elementsPerSlide);
// 			const nextSlide = Math.floor((index + 1) / elementsPerSlide) > slideNum;

// 			slide.push(el);

// 			if (nextSlide) {
// 				slideGroup.push(slide);
// 				slide = [];
// 			}
// 		});

// 		groupedElements[key] = slideGroup;
// 		slideGroup = [];
// 	});

// 	return groupedElements;
// }

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
					groups: [
						...page.groups,
						{ ...group, elements },
					],
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

function removePageElements(state, action) {
	const { ids } = action.payload;

	return {
		...state.data,
		pages: state.data.pages.map(page => (
			page.id === state.activePageId ?
				{
					...page,
					elements: page.elements.filter(el => ids.indexOf(el.id) < 0),
					groups: page.groups.map(group => (
						group.id === action.payload.groupId ?
							{
								...group,
								elements: group.elements.filter(el => ids.indexOf(el.id) < 0),
							}
							:
							group
					)),
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

