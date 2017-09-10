import {
	SET_ACTIVE_PAGE,
	REQUEST_NEW_PAGE,
	CREATE_NEW_PAGE_SUCCESS,
	CREATE_NEW_PAGE_FAIL,
	REQUEST_DELETE_PAGE,
	DELETE_PAGE_SUCCESS,
	DELETE_PAGE_FAIL,
	DRAG_PAGE_ITEM,
	REQUEST_UPDATE_PAGE_SORT_ORDER,
	UPDATE_PAGE_SORT_ORDER_SUCCESS,
	UPDATE_PAGE_SORT_ORDER_FAIL,
} from './actionCreators';
import { POST } from '../api/';

export function setActivePage(pageId) {
	return {
		type: SET_ACTIVE_PAGE,
		pageId,
	};
}

function requestCreatePage() {
	return {
		type: REQUEST_NEW_PAGE,
	};
}

function createPageSuccess(payload) {
	return {
		type: CREATE_NEW_PAGE_SUCCESS,
		payload,
	};
}

function createPageFail(payload) {
	return {
		type: CREATE_NEW_PAGE_FAIL,
		payload,
	};
}

function createNewPage(page) {
	const formData = JSON.stringify(page);
	return POST('page/create', formData, requestCreatePage, createPageSuccess, createPageFail);
}

function shouldCreateNewPage(state) {
	if (state.site.isPosting) {
		return false;
	}

	return true;
}

export function createNewPageSafely(formData) {
	return (dispatch, getState) => {
		if (shouldCreateNewPage(getState())) {
			const page = buildNewPage(formData, getState());

			return dispatch(createNewPage(page));
		}
	};
}

function requestDeletePage() {
	return {
		type: REQUEST_DELETE_PAGE,
	};
}

function deletePageSuccess(payload) {
	return {
		type: DELETE_PAGE_SUCCESS,
		payload,
	};
}

function deletePageFail() {
	return {
		type: DELETE_PAGE_FAIL,
	};
}

function deletePage(id) {
	const formData = JSON.stringify({ id });
	return POST('page/delete', formData, requestDeletePage, deletePageSuccess, deletePageFail);
}

function shouldDeletePage(state) {
	if (state.isDeleting) {
		return false;
	}

	return true;
}

export function deletePageSafely(pageId) {
	return (dispatch, getState) => {
		if (shouldDeletePage(getState())) {
			return dispatch(deletePage(pageId));
		}
	};
}

function buildNewPage(formData, state) {
	const { name, parentId, template } = formData;
	const templateName = template === 'New Template' ? name : template;
	const { data } = state.site;
	const page = {
		title: name,
		path: `/${slugify(name)}`,
		parentId: parseInt(parentId, 10) || 0,
		name,
		showInNav: true,
		siteId: data.id,
		sortOrder: data.pages.length - 1,
		template: templateName,
	};

	return page;
}

function slugify(text) {
	return text.toString().toLowerCase()
		.replace(/\s+/g, '-') 			// Replace spaces with -
		.replace(/[^\w\-]+/g, '')		// Remove all non-word chars
		.replace(/\-\-+/g, '-')			// Replace multiple - with single -
		.replace(/^-+/, '')				// Trim - from start of text
		.replace(/-+$/, '');			// Trim - from end of text
}

export function dragPageItem(dragIndex, hoverIndex) {

	const payload = { dragIndex, hoverIndex };

	return {
		type: DRAG_PAGE_ITEM,
		payload,
	};
}

function requestUpdatePageSortOrder() {
	return {
		type: REQUEST_UPDATE_PAGE_SORT_ORDER,
	};
}

function updatePageSortOrderSuccess(payload) {
	return {
		type: UPDATE_PAGE_SORT_ORDER_SUCCESS,
		payload,
	};
}

function updatePageSortOrderFail() {
	return {
		type: UPDATE_PAGE_SORT_ORDER_FAIL,
	};
}

function updatePageSortOrder(pageId, newIndex) {
	const formData = JSON.stringify({ pageId, newIndex });
	return POST('page/sort-order',
		formData,
		requestUpdatePageSortOrder,
		updatePageSortOrderSuccess,
		updatePageSortOrderFail,
	);
}

function shouldUpdatePageSortOrder(state) {
	if (state.site.isUpdatingPageSortOrder) {
		return false;
	}
	return true;
}

export function updatePageSortOrderSafely(pageId, newIndex) {
	return (dispatch, getState) => {
		if (shouldUpdatePageSortOrder(getState())) {
			return dispatch(updatePageSortOrder(pageId, newIndex));
		}
	}
}
