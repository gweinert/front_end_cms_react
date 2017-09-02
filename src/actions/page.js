import {
	SET_ACTIVE_PAGE,
} from './actionCreators';

export function setActivePage(pageId) {
	return {
		type: SET_ACTIVE_PAGE,
		pageId,
	};
}
