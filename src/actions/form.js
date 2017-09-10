import {
	RECEIVE_FORM_ELEMENTS,
	ON_FIELD_CHANGE,
	RESET_FORM_SUCCESS,
} from './actionCreators';

function fieldChange(fieldData, activePageId) {
	return {
		type: ON_FIELD_CHANGE,
		data: fieldData,
		pageName: `page[${activePageId}]`,
	};
}

export function onFieldChange(fieldData, activePageId) {
	return (dispatch, getState) => {
		return dispatch(fieldChange(fieldData, activePageId));
	};
}

function receiveFormElements(data, activePageId) {
	return {
		type: RECEIVE_FORM_ELEMENTS,
		data,
		pageName: `page[${activePageId}]`,
	};
}

export function loadForm(nextProps) {
	console.log("LOADFORM");
	return (dispatch, getState) => {
		const { data, activePageId } = buildFormFromState(getState(), nextProps);
		return dispatch(receiveFormElements(data, activePageId));
	};
}

function buildFormFromState(state) {
	const data = {};
	const activePage = state.site.data.pages.find(page => page.id === state.site.activePageId);

	activePage.elements.forEach((el) => {
		const key = `${el.type}[${el.id}]`;
		data[key] = el.body;
	});

	data.name = activePage.name;
	data.path = activePage.path;

	return {
		data,
		activePageId: state.site.activePageId,
	};
}


// export function loadForm(data, activePageId) {
// 	return {
// 		type: RECEIVE_FORM_ELEMENTS,
// 		data,
// 		pageName: `page[${activePageId}]`,
// 	};
// }

export function resetFormSuccess() {
	return {
		type: RESET_FORM_SUCCESS,
	};
}
