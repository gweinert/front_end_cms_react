
// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import reducers from '../reducers';

// const middleWare = [thunk];

// const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);

// const store = createStoreWithMiddleware(reducers);

// export default store;
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
	return createStore(
		rootReducer,
		preloadedState,
		applyMiddleware(
			thunkMiddleware,
			loggerMiddleware,
		),
	);
}
