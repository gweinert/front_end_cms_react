import {
	RECEIVE_FORM_ELEMENTS,
	ON_FIELD_CHANGE,
	UPDATE_PAGE_SUCCESS,
} from '../actions/actionCreators';

export default function form(
	state = {
		formData: {},
		success: null,
	},
	action) {
	switch (action.type) {
	case RECEIVE_FORM_ELEMENTS:
		return {
			...state,
			formData: { ...state.formData, [action.pageName]: action.data },
		};
	case ON_FIELD_CHANGE:
		return {
			...state,
			formData: {
				...state.formData,
				[action.pageName]: {
					...state.formData[action.pageName],
					[action.data.name]: action.data.value,
				},
			},
		};
	case UPDATE_PAGE_SUCCESS:
		return { ...state, success: true };
	default: return state;
	}
}
