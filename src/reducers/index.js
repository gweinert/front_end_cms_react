import { combineReducers } 	from 'redux';
import { reducer as form } 	from 'redux-form';
import site 				from './site';
import page 				from './page';

const appReducer = combineReducers({
	site,
	form,
	page,
});

export default appReducer;

// export default function (state, action) {
// 	if (action.type === 'LOGOUT') {
// 		return appReducer(undefined, action);
// 	}
// 	return appReducer(state, action);
// }
