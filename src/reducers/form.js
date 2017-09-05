import {
	LOAD,
	RECEIVE_FORM_ELEMENTS,
	ON_FIELD_CHANGE,
} from '../actions/actionCreators';

export default function page(
	state = {
		formData: {},
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
	default: return state;
	}
}
