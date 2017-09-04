import {
	SET_ACTIVE_PAGE,
	UPDATE_PAGE_SUCCESS,
	UPDATE_PAGE_FAIL,
	DELETE_PAGE_SUCCESS,
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
	case DELETE_PAGE_SUCCESS:
		return { ...state, activePageId: null };
	default: return state;
	}
}
