// @flow
import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import {
	Route,
	withRouter,
} 							from 'react-router-dom';
import { connect } 			from 'react-redux';
import { DragDropContext } 	from 'react-dnd';
import HTML5Backend 		from 'react-dnd-html5-backend';
import Cookie 				from 'js-cookie';
import Login 				from '../Login';
import NavBar 				from '../../components/Navbar';
import EditPage 			from '../EditPage';
import PageTree 			from '../PageTree';
import {
	fetchUsersSiteIfNeeded,
	getUser,
} 							from '../../actions';
import './App.css';


class App extends Component {
	static propTypes = {
		site: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
		page: PropTypes.shape({
			activePageId: PropTypes.number,
		}).isRequired,
		user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
		dispatch: PropTypes.func.isRequired,
	}

	static defaultProps = {
	}

	componentDidMount() {
		const { dispatch } = this.props;

		if (Cookie.get('sessionId')) {
			dispatch(getUser())
				.then(() => {
					dispatch(fetchUsersSiteIfNeeded());
				});
		}
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch } = this.props;

		if (nextProps.user.loggedIn && !this.props.user.loggedIn) {
			if (!Cookie.get('sessionId')) {
				dispatch(fetchUsersSiteIfNeeded());
			}
		}
	}


	render() {
		const { site, page, user, dispatch } = this.props;
		const pages = site.data ? site.data.pages : [];
		const activePage = site.data &&
			site.data.pages.find(pageItem => pageItem.id === page.activePageId);

		return (
			<div className="App">
				{ user.loggedIn ?
					<div>
						<NavBar
							user={user}
						/>
						<div className="main-app">
							<PageTree
								pages={pages}
								activePage={activePage}
							/>
							<div className="edit-container">
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
					</div>
					:
					<Login
						dispatch={dispatch}
					/>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { site, page, user } = state;

	return {
		site,
		page,
		user,
	};
};

const draggableApp = DragDropContext(HTML5Backend)(App);

export default withRouter(connect(mapStateToProps)(draggableApp));
// export default connect(mapStateToProps)(App);

