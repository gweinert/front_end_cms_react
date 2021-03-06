import React 					from 'react';
import ReactDOM 				from 'react-dom';
import { Provider } 			from 'react-redux';
import { BrowserRouter }		from 'react-router-dom';
import 'milligram/dist/milligram.min.css';
import configureStore 			from './store';
import App 						from './containers/App';
import registerServiceWorker 	from './registerServiceWorker';
import './index.css';

const store = configureStore();

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
	, document.getElementById('root'),
);
registerServiceWorker();

