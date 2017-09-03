import {
	REQUEST_CREATE_GROUP,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAIL,
	CREATE_NEW_LOCAL_PAGE_ELEMENT,
} from './actionCreators';
import { POST } from '../api/';

function DefaultElement(options = {}) {
	return {
		// "id": 0,
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
function createNewLocalPageElements(pageElements, pageId) {
	return {
		type: CREATE_NEW_LOCAL_PAGE_ELEMENT,
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

	if (group) {
		group.structure.forEach((structureItem, index) => {
			for (let i = 0; i < structureItem.amount; i += 1) {
				const pageId = activePage.id;
				const newPageGroupElement = buildPageGroupElement(structureItem, pageId, i);
				pageElements.push(newPageGroupElement);
			}
		});
	}

	return (dispatch) => {
		if (group) {
			dispatch(createNewLocalPageElements(pageElements, group.pageId));
		}
	};
}

function buildPageGroupElement(structureItem, pageId, index) {
	const {
		type,
		amount,
		groupId,
	} = structureItem;
	const groupSortOrder = index + amount;

	const defaultElement = DefaultElement({
		pageId,
		groupId,
		type,
		groupSortOrder,
		name: `${type}${index}`,
	});

	return defaultElement;
}
