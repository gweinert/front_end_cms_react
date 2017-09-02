import {
	SET_ACTIVE_PAGE,
	UPDATE_PAGE_SUCCESS,
	UPDATE_PAGE_FAIL,
} from '../actions/actionCreators';

export default function page(
	state = {
		activePageId: null,
		updateSuccess: null,
	},
	action) {
	switch (action.type) {
	case SET_ACTIVE_PAGE:
		return { ...state, activePageId: action.pageId };
	case UPDATE_PAGE_SUCCESS:
		return { ...state, updateSuccess: true };
	case UPDATE_PAGE_FAIL:
		return { ...state, updateSuccess: false };
	default: return state;
	}
}
