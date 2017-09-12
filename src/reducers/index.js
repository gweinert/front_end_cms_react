import { combineReducers } 	from 'redux';
// import { reducer as form } 	from 'redux-form';
import form from './form';
import site 				from './site';
import page 				from './page';
import user 				from './user';

const appReducer = combineReducers({
	site,
	form,
	page,
	user,
});

export default appReducer;

// export default function (state, action) {
// 	if (action.type === 'LOGOUT') {
// 		return appReducer(undefined, action);
// 	}
// 	return appReducer(state, action);
// }
