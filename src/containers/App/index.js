// @flow
import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import {
	BrowserRouter,
	Route,
	withRouter,
} 							from 'react-router-dom';
import { connect } 			from 'react-redux';
import NavBar 				from '../../components/Navbar';
// import Home 				from '../Home';
import EditPage 			from '../EditPage';
import PageTree 			from '../PageTree';
import {
	fetchUsersSiteIfNeeded,
} 							from '../../actions';
import './App.css';


class App extends Component {
	static propTypes = {
		site: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
		page: PropTypes.shape({
			activePageId: PropTypes.number,
		}).isRequired,
		dispatch: PropTypes.func.isRequired,
	}

	static defaultProps = {
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchUsersSiteIfNeeded());
	}

	render() {
		const { site, page, dispatch } = this.props;
		const pages = site.data ? site.data.pages : [];
		const activePage = site.data &&
			site.data.pages.find(pageItem => pageItem.id === page.activePageId);

		return (
			<div className="App">
				<NavBar />
				<div className="main-app">
					<PageTree pages={pages} />
					<Route
						exact
						path="/"
						render={routeProps => (
							<EditPage
								{...routeProps}
								activePage={activePage}
								dispatch={dispatch}
							/>
						)}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { site, page } = state;

	return {
		site,
		page,
	};
};

export default withRouter(connect(mapStateToProps)(App));
// export default connect(mapStateToProps)(App);

