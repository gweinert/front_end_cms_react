import {
	REQUEST_CREATE_GROUP,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAIL,
	CREATE_NEW_LOCAL_PAGE_ELEMENTS_FOR_GROUP,
	UPDATE_LOCAL_PAGE_ELEMENT_GROUP,
	// REQUEST_DELETE_PAGE_ELEMENTS_SLIDE,
	// DELETE_PAGE_ELEMENTS_SLIDE_SUCCESS,
	// DELETE_PAGE_ELEMENTS_SLIDE_FAIL,
} from './actionCreators';
import { POST } from '../api/';

function DefaultElement(options = {}) {
	return {
		id: options.id || 0,
		pageId: options.pageId || 0,
		groupId: options.groupId || 0,
		sortOrder: options.sortOrder || 0,
		groupSortOrder: options.groupSortOrder || 0,
		name: options.name || '',
		type: options.type || '',
		body: options.body || '',
		imageURL: options.imageURL || '',
		linkPath: options.linkPath || '',
		linkText: options.linkText || '',
	};
}

function requestCreateGroup() {
	return {
		type: REQUEST_CREATE_GROUP,
	};
}


function createGroupSuccess(payload) {
	return {
		type: CREATE_GROUP_SUCCESS,
		payload,
	};
}

function createGroupFail(error) {
	return {
		type: CREATE_GROUP_FAIL,
		error,
	};
}

function postGroup(group) {
	const formData = JSON.stringify(group);

	return POST('group/create', formData, requestCreateGroup, createGroupSuccess, createGroupFail);
}

// can dispatch as single or an array of page elements
function createNewLocalPageElementsForGroup(pageElements, pageId) {
	return {
		type: CREATE_NEW_LOCAL_PAGE_ELEMENTS_FOR_GROUP,
		pageElements,
		pageId,
	};
}

function shouldCreateNewPageElementGroup(state) {
	if (state.site.isPosting) {
		return false;
	}
	return true;
}

export function createPageElementGroup(groupFormState, activePage) {
	const structureArray = Object.keys(groupFormState.structure).map(key => (
		{
			type: key,
			amount: groupFormState.structure[key],
		}
	));
	const group = {
		pageId: activePage.id,
		name: groupFormState.name,
		structure: structureArray,
	};
	return (dispatch, getState) => {
		if (shouldCreateNewPageElementGroup(getState())) {
			return dispatch(postGroup(group));
		}
	};
}

export function createPageElementsForGroup(groupId, activePage) {
	const pageElements = [];
	const group = activePage.groups.find(groupItem => groupItem.id === parseInt(groupId, 10));
	const elementsPerSlide = group.structure.reduce((amount, item) => {
		if (amount.amount) {
			return amount.amount + item.amount;
		}
		return amount + item.amount;
	});

	if (group) {
		let sortOrder = 0;
		group.structure.forEach((structureItem, index) => {
			for (let i = 0; i < structureItem.amount; i += 1) {
				const pageId = activePage.id;
				const groupSortOrder = Math.floor(group.elements.length / elementsPerSlide);
				const newPageGroupElement = buildPageGroupElement(structureItem, pageId, i, groupSortOrder, sortOrder);
				pageElements.push(newPageGroupElement);
				sortOrder += 1;
			}
		});
	}

	return (dispatch) => {
		if (group) {
			dispatch(createNewLocalPageElementsForGroup(pageElements, group.pageId));
		}
	};
}

function buildPageGroupElement(structureItem, pageId, index, groupSortOrder, sortOrder) {
	const {
		type,
		groupId,
	} = structureItem;
	const tempId = makeTempId();

	const defaultElement = DefaultElement({
		id: tempId,
		pageId,
		groupId,
		type,
		groupSortOrder,
		sortOrder,
		name: `${type}${index}`,
	});

	return defaultElement;
}

function makeTempId() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return `_ ${Math.random().toString(36).substr(2, 9)}`;
}

function updateLocalPageElementsForGroup(updatedElements, slideIndex, activePageId) {
	console.log("updated Els", updatedElements);
	return {
		type: UPDATE_LOCAL_PAGE_ELEMENT_GROUP,
		pageId: activePageId,
		slideIndex,
		data: updatedElements,
	};
}

export function savePageElementsForGroup(slideGroup, slideIndex, activePageId) {
	// find page group elements in local state and update them with form data

	return (dispatch, getState) => {
		const updatedElements = buildUpdatePageElements(slideGroup, getState());
		return dispatch(updateLocalPageElementsForGroup(updatedElements, slideIndex, activePageId));
	};
}

function buildUpdatePageElements(slideGroup, state) {
	return slideGroup.map((el) => {
		const nameKey = `${el.type}[${el.id}]`;
		const formName = `page[${el.pageId}]`;

		const form = state.form.formData[formName];
		let updatedValue = el.body;

		if (form) {
			updatedValue = form[nameKey];
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

// function requestDeletePageElementsSlide() {
// 	return {
// 		type: REQUEST_DELETE_PAGE_ELEMENTS_SLIDE,
// 	};
// }

// function deletePageElementsSlideSuccess(payload) {
// 	return {
// 		type: DELETE_PAGE_ELEMENTS_SLIDE_SUCCESS,
// 		payload,
// 	};
// }

// function deletePageElementsSlideFail() {
// 	return {
// 		type: DELETE_PAGE_ELEMENTS_SLIDE_FAIL,
// 	};
// }

// function deletePageElementsSlide(pageElements) {
// 	const formData = JSON.stringify(pageElements);
// 	return POST('group/delete-slide', formData, requestDeletePageElementsSlide, deletePageElementsSlideSuccess, deletePageElementsSlideFail);
// }

// function shouldDeletePageElementsForGroup(state) {
// 	if (state.site.isDeleting) {
// 		return false;
// 	}
// 	return true;
// }
// export function deletePageElementsForGroup(slide, index) {
// 	return (dispatch, getState) => {
// 		if (shouldDeletePageElementsForGroup(getState())) {
// 			dispatch(deletePageElementsSlide(slide));
// 		}
// 	};
// }
