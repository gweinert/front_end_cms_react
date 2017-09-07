import {
	RECEIVE_FORM_ELEMENTS,
	ON_FIELD_CHANGE,
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


export function loadForm(data, activePageId) {
	return {
		type: RECEIVE_FORM_ELEMENTS,
		data,
		pageName: `page[${activePageId}]`,
	};
}
