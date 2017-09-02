import {
	REQUEST_CREATE_GROUP,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAIL,
	CREATE_NEW_LOCAL_PAGE_ELEMENT,
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

function requestCreateGroup() {
	return {
		type: REQUEST_CREATE_GROUP,
	};
}

// on success lets create page elements ourselves
function createGroupSuccess(payload) {
	// createLocalGroupElements(payload);
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

function createLocalGroupElements(group) {
	const pageElements = [];

	Object.keys(group.structure).map((groupType) => {
		const numberOfElements = group[groupType];
		for (let i = 0; i < numberOfElements; i += 1) {
			const newPageElement = buildPageGroupElement(groupType, group.pageId, i);
			pageElements.push(newPageElement);
		}
	});

	return dispatch => dispatch(createNewLocalPageElements(pageElements, group.pageId));
}

function buildPageGroupElement(type, pageId, index) {
	const defaultElement = DefaultElement();
	// const groupElements = activePage.elements.filter(el => el.groupId !== 0);
	// const disinctGroups = uniq(groupElements);

	defaultElement.pageId = pageId;
	// defaultElement.sortOrder = activePage.elements.length;
	defaultElement.type = type;

	defaultElement.groupSortOrder = index;
	// defaultElement.groupId = disinctGroups.length + 1;
	defaultElement.name = `${type}${index + 1}`;

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

// used to serialize the group id
// function uniq(a) {
// 	const seen = {};
// 	return a.filter(item => {
// 		console.log("item", item);
// 		return seen.hasOwnProperty(item.id) ? false : (seen[item.id] = true)
// 	});
// }